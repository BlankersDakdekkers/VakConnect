import "server-only";
import { LeadSubmissionError } from "@/lib/leads/errors";
import { scoreLead } from "@/lib/leads/scoring";
import { refreshLeadMatchesForLead } from "@/lib/matching";
import type { DynamicAnswerValue, ServiceQuestionDefinition } from "@/lib/validation";
import { createLeadSubmissionSchema } from "@/lib/validation/leads";
import { getActiveServiceQuestionDefinitions } from "@/lib/services/queries";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buildLeadImagePath, leadImagesBucket, validateLeadImages } from "@/lib/storage/leads";
import { leadSubmissionSchema } from "@/lib/validation/leads";

function getRawDynamicAnswers(formData: FormData, questions: ServiceQuestionDefinition[]) {
  return Object.fromEntries(
    questions.map((question) => {
      const key = `question:${question.id}`;

      if (question.type === "multiselect") {
        return [question.id, formData.getAll(key)];
      }

      return [question.id, formData.get(key)];
    }),
  );
}

function isDynamicAnswerProvided(question: ServiceQuestionDefinition, answer: DynamicAnswerValue | undefined) {
  if (question.type === "multiselect") {
    return Array.isArray(answer) && answer.length > 0;
  }

  if (question.type === "boolean") {
    return typeof answer === "boolean";
  }

  if (question.type === "number") {
    return typeof answer === "number" && Number.isFinite(answer);
  }

  return typeof answer === "string" && answer.trim().length > 0;
}

function buildLeadAnswerRows(
  leadId: string,
  questions: ServiceQuestionDefinition[],
  answers: Record<string, DynamicAnswerValue | undefined>,
) {
  return questions.flatMap<Record<string, DynamicAnswerValue | string>>((question) => {
    const answer = answers[question.id];
    if (!isDynamicAnswerProvided(question, answer)) {
      return [];
    }

    if (question.type === "multiselect") {
      return [{
        lead_id: leadId,
        question_id: question.id,
        answer_json: answer as DynamicAnswerValue,
      }];
    }

    if (question.type === "boolean") {
      return [{
        lead_id: leadId,
        question_id: question.id,
        answer_boolean: answer as DynamicAnswerValue,
      }];
    }

    if (question.type === "number") {
      return [{
        lead_id: leadId,
        question_id: question.id,
        answer_number: answer as DynamicAnswerValue,
      }];
    }

    return [{
      lead_id: leadId,
      question_id: question.id,
      answer_text: answer as DynamicAnswerValue,
    }];
  });
}

function buildLeadScoringInput(
  payload: ReturnType<typeof leadSubmissionSchema.parse>,
  questions: ServiceQuestionDefinition[],
  answers: Record<string, DynamicAnswerValue | undefined>,
  imageCount: number,
) {
  const answeredQuestionCount = questions.filter((question) => isDynamicAnswerProvided(question, answers[question.id])).length;
  const requiredQuestions = questions.filter((question) => question.required);
  const requiredQuestionsAnswered = requiredQuestions.filter((question) => isDynamicAnswerProvided(question, answers[question.id])).length;

  return {
    contactFieldsCompleted: [payload.firstName, payload.lastName, payload.phone, payload.email].filter((value) => value.trim().length > 0).length,
    addressFieldsCompleted: [payload.postalCode, payload.houseNumber].filter((value) => value.trim().length > 0).length,
    descriptionLength: payload.description.trim().length,
    imageCount,
    requiredQuestionsCount: requiredQuestions.length,
    requiredQuestionsAnswered,
    answeredQuestionCount,
    totalQuestionCount: questions.length,
    preferredTimingProvided: payload.preferredTiming !== "unknown",
  };
}

export async function createLeadSubmission(formData: FormData) {
  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  try {
    validateLeadImages(files);
  } catch (error) {
    throw new LeadSubmissionError(error instanceof Error ? error.message : "De geüploade afbeeldingen zijn ongeldig.", 400);
  }

  const payload = leadSubmissionSchema.safeParse({
    serviceId: formData.get("serviceId"),
    postalCode: formData.get("postalCode"),
    houseNumber: formData.get("houseNumber"),
    houseNumberAddition: formData.get("houseNumberAddition"),
    description: formData.get("description"),
    urgency: formData.get("urgency"),
    preferredTiming: formData.get("preferredTiming"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  });

  if (!payload.success) {
    throw new LeadSubmissionError(payload.error.issues[0]?.message ?? "De aanvraaggegevens zijn ongeldig.", 400);
  }

  const supabase = createAdminSupabaseClient();
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id")
    .eq("id", payload.data.serviceId)
    .eq("active", true)
    .maybeSingle();

  if (serviceError) {
    throw new LeadSubmissionError("De aanvraag kon niet worden opgeslagen.", 500);
  }

  if (!service) {
    throw new LeadSubmissionError("De gekozen dienst is niet beschikbaar.", 400);
  }

  let questions: ServiceQuestionDefinition[] = [];

  try {
    questions = await getActiveServiceQuestionDefinitions(payload.data.serviceId);
  } catch {
    throw new LeadSubmissionError("De intakevragen konden niet worden geladen.", 500);
  }

  const submissionPayload = createLeadSubmissionSchema(questions).safeParse({
    ...payload.data,
    dynamicAnswers: getRawDynamicAnswers(formData, questions),
  });

  if (!submissionPayload.success) {
    throw new LeadSubmissionError(submissionPayload.error.issues[0]?.message ?? "De intake-antwoorden zijn ongeldig.", 400);
  }

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      service_id: payload.data.serviceId,
      first_name: payload.data.firstName,
      last_name: payload.data.lastName,
      email: payload.data.email,
      phone: payload.data.phone,
      postal_code: payload.data.postalCode,
      house_number: payload.data.houseNumber,
      house_number_addition: payload.data.houseNumberAddition || null,
      city: null,
      description: payload.data.description,
      urgency: payload.data.urgency,
      preferred_timing: payload.data.preferredTiming,
      status: "new",
      source: "website",
    })
    .select("id, public_reference")
    .single();

  if (leadError || !lead) {
    throw new LeadSubmissionError("De aanvraag kon niet worden opgeslagen.", 500);
  }

  const uploadedPaths: string[] = [];

  try {
    for (const file of files) {
      const path = buildLeadImagePath(lead.id, file.type);
      const { error: uploadError } = await supabase.storage
        .from(leadImagesBucket)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        throw new LeadSubmissionError("Een of meer afbeeldingen konden niet worden opgeslagen.", 500);
      }

      uploadedPaths.push(path);
      const { error: imageError } = await supabase.from("lead_images").insert({
        lead_id: lead.id,
        storage_path: path,
        mime_type: file.type,
        file_size: file.size,
      });

      if (imageError) {
        throw new LeadSubmissionError("De afbeeldingsmetadata kon niet worden opgeslagen.", 500);
      }
    }

    const leadAnswers = buildLeadAnswerRows(lead.id, questions, submissionPayload.data.dynamicAnswers);

    if (leadAnswers.length) {
      const { error: answersError } = await supabase.from("lead_answers").insert(leadAnswers);
      if (answersError) {
        throw new LeadSubmissionError("De intake-antwoorden konden niet worden opgeslagen.", 500);
      }
    }

    const scoreResult = scoreLead(buildLeadScoringInput(submissionPayload.data, questions, submissionPayload.data.dynamicAnswers, files.length));
    const { error: scoreError } = await supabase
      .from("leads")
      .update({
        lead_score: scoreResult.score,
        score_reasons: scoreResult.reasons,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    if (scoreError) {
      throw new LeadSubmissionError("De leadscore kon niet worden opgeslagen.", 500);
    }

    await refreshLeadMatchesForLead({
      leadId: lead.id,
      serviceId: submissionPayload.data.serviceId,
      postalCode: submissionPayload.data.postalCode,
    });
  } catch (error) {
    if (uploadedPaths.length) {
    await supabase.storage.from(leadImagesBucket).remove(uploadedPaths);
    }
    await supabase.from("leads").delete().eq("id", lead.id);
    if (error instanceof LeadSubmissionError) {
      throw error;
    }
    throw new LeadSubmissionError("De aanvraag kon niet worden opgeslagen.", 500);
  }

  return { reference: lead.public_reference };
}

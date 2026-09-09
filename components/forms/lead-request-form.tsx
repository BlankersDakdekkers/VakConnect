"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import {
  allowedLeadImageTypes,
  leadSubmissionSchema,
  leadUrgencyValues,
  maxLeadImageCount,
  maxLeadImageSizeBytes,
  preferredTimingValues,
  validateDynamicAnswers,
  type DynamicAnswerValue,
  type ServiceQuestionDefinition,
} from "@/lib/validation";
import { formatFileSize, formatPostalCode, normalizePostalCode } from "@/lib/utils";
import type { Service } from "@/types/database";
import { getClientAttributionSnapshot, trackFunnelEvent } from "@/lib/analytics/client";
import { funnelEventNames } from "@/lib/analytics/events";
import { getOrCreateAnonymousSessionId } from "@/lib/analytics/session";

const serviceStepSchema = leadSubmissionSchema.pick({ serviceId: true });
const locationStepSchema = leadSubmissionSchema.pick({ postalCode: true, houseNumber: true, houseNumberAddition: true });
const detailsStepSchema = leadSubmissionSchema.pick({ description: true, urgency: true, preferredTiming: true });
const contactStepSchema = leadSubmissionSchema.pick({ firstName: true, lastName: true, phone: true, email: true });

type LeadDraft = {
  serviceId: string;
  postalCode: string;
  houseNumber: string;
  houseNumberAddition: string;
  description: string;
  urgency: (typeof leadUrgencyValues)[number];
  preferredTiming: (typeof preferredTimingValues)[number];
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type DynamicAnswerDraft = Record<string, string | string[] | boolean>;

const initialDraft: LeadDraft = {
  serviceId: "",
  postalCode: "",
  houseNumber: "",
  houseNumberAddition: "",
  description: "",
  urgency: "normal",
  preferredTiming: "unknown",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

const stepTitles = ["Dienst", "Dienstvragen", "Locatie", "Klus", "Foto's", "Contact", "Samenvatting"];

function isDynamicAnswerFilled(value: DynamicAnswerValue | undefined) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  return typeof value === "string" && value.trim().length > 0;
}

function getQuestionDisplayValue(question: ServiceQuestionDefinition, value: DynamicAnswerValue | undefined) {
  if (!isDynamicAnswerFilled(value)) {
    return "Niet ingevuld";
  }

  if (question.type === "multiselect" && Array.isArray(value)) {
    return value
      .map((entry) => question.options.find((option) => option.value === entry)?.label ?? entry)
      .join(", ");
  }

  if (question.type === "radio" || question.type === "select") {
    return question.options.find((option) => option.value === value)?.label ?? String(value);
  }

  if (question.type === "boolean") {
    return value ? "Ja" : "Nee";
  }

  return String(value);
}

function getStringAnswer(value: DynamicAnswerValue | undefined) {
  return typeof value === "string" ? value : "";
}

function getArrayAnswer(value: DynamicAnswerValue | undefined) {
  return Array.isArray(value) ? value : [];
}

export function LeadRequestForm({
  services,
}: Readonly<{
  services: Array<Service & { questions: ServiceQuestionDefinition[] }>;
}>) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<LeadDraft>(initialDraft);
  const [dynamicAnswers, setDynamicAnswers] = useState<DynamicAnswerDraft>({});
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attribution] = useState(() => getClientAttributionSnapshot());

  useEffect(() => {
    void trackFunnelEvent(funnelEventNames.leadFunnelStarted, { step: 1 });
  }, []);

  const selectedService = useMemo(
    () => services.find((service) => service.id === draft.serviceId) ?? null,
    [draft.serviceId, services],
  );
  const selectedQuestions = selectedService?.questions ?? [];

  function updateDraft<K extends keyof LeadDraft>(key: K, value: LeadDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function updateDynamicAnswer(questionId: string, value: string | boolean) {
    setDynamicAnswers((current) => ({ ...current, [questionId]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  }

  function toggleDynamicMultiSelect(questionId: string, value: string, checked: boolean) {
    setDynamicAnswers((current) => {
      const currentValues = Array.isArray(current[questionId]) ? current[questionId] : [];
      const nextValues = checked
        ? Array.from(new Set([...currentValues, value]))
        : currentValues.filter((entry) => entry !== value);

      return {
        ...current,
        [questionId]: nextValues,
      };
    });
    setErrors((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  }

  function validateStep(step = currentStep) {
    setFormError(null);
    let result;

    if (step === 0) {
      result = serviceStepSchema.safeParse(draft);
    } else if (step === 1) {
      result = validateDynamicAnswers(
        selectedQuestions,
        Object.fromEntries(selectedQuestions.map((question) => [question.id, dynamicAnswers[question.id]])),
      );
    } else if (step === 2) {
      result = locationStepSchema.safeParse(draft);
    } else if (step === 3) {
      result = detailsStepSchema.safeParse(draft);
    } else if (step === 4) {
      const nextErrors: Record<string, string> = {};
      if (images.length > maxLeadImageCount) {
        nextErrors.images = `Je kunt maximaal ${maxLeadImageCount} afbeeldingen uploaden.`;
      }
      const invalidFile = images.find(
        (file) => !allowedLeadImageTypes.includes(file.type as (typeof allowedLeadImageTypes)[number]) || file.size > maxLeadImageSizeBytes,
      );
      if (invalidFile) {
        nextErrors.images = "Gebruik alleen JPG, PNG of WebP tot maximaal 5 MB per bestand.";
      }
      setErrors((current) => ({ ...current, ...nextErrors }));
      return Object.keys(nextErrors).length === 0;
    } else {
      result = contactStepSchema.safeParse(draft);
    }

    if (!result?.success) {
      const nextErrors = Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message]));
      setErrors((current) => ({ ...current, ...nextErrors }));
      return false;
    }

    return true;
  }

  function handleNext() {
    if (!validateStep()) return;

    if (currentStep === 0) {
      void trackFunnelEvent(funnelEventNames.serviceSelected, { service_id: draft.serviceId });
    }
    if (currentStep === 1) {
      const answeredCount = selectedQuestions.filter((question) => isDynamicAnswerFilled(dynamicAnswers[question.id])).length;
      void trackFunnelEvent(funnelEventNames.dynamicQuestionsCompleted, {
        question_count: selectedQuestions.length,
        answered_count: answeredCount,
      });
    }
    if (currentStep === 2) {
      void trackFunnelEvent(funnelEventNames.locationCompleted, { step: 3 });
    }
    if (currentStep === 4) {
      void trackFunnelEvent(funnelEventNames.mediaStepCompleted, { upload_count: images.length });
    }
    if (currentStep === 5) {
      void trackFunnelEvent(funnelEventNames.contactCompleted, { step: 6 });
    }

    setCurrentStep((step) => Math.min(step + 1, stepTitles.length - 1));
  }

  function handleBack() {
    setFormError(null);
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextImages = Array.from(event.target.files ?? []);
    setImages(nextImages);
    setErrors((current) => {
      const next = { ...current };
      delete next.images;
      return next;
    });
  }

  async function handleSubmit() {
    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    if (!validateStep(5)) {
      setCurrentStep(5);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const body = new FormData();
    body.set("serviceId", draft.serviceId);
    body.set("postalCode", normalizePostalCode(draft.postalCode));
    body.set("houseNumber", draft.houseNumber);
    body.set("houseNumberAddition", draft.houseNumberAddition);
    body.set("description", draft.description);
    body.set("urgency", draft.urgency);
    body.set("preferredTiming", draft.preferredTiming);
    body.set("firstName", draft.firstName);
    body.set("lastName", draft.lastName);
    body.set("phone", draft.phone);
    body.set("email", draft.email);
    body.set("anonymousSessionId", getOrCreateAnonymousSessionId());

    const attributionEntries = Object.entries(attribution) as Array<[string, string | null]>;
    attributionEntries.forEach(([key, value]) => {
      if (value) {
        body.set(key, value);
      }
    });
    selectedQuestions.forEach((question) => {
      const answer = dynamicAnswers[question.id];

      if (Array.isArray(answer)) {
        answer.forEach((value) => body.append(`question:${question.id}`, value));
        return;
      }

      if (typeof answer === "boolean") {
        body.set(`question:${question.id}`, String(answer));
        return;
      }

      if (typeof answer === "string" && answer.length) {
        body.set(`question:${question.id}`, answer);
      }
    });
    images.forEach((image) => body.append("images", image));

    const response = await fetch("/api/leads", {
      method: "POST",
      body,
    });

    const payload = (await response.json().catch(() => null)) as { error?: string; reference?: string } | null;

    if (!response.ok || !payload?.reference) {
      setSubmitting(false);
      setFormError(payload?.error ?? "De aanvraag kon niet worden verstuurd.");
      return;
    }

    router.push(`/aanvraag/bedankt?ref=${payload.reference}`);
  }

  return (
    <Card className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {stepTitles.map((title, index) => (
            <div
              key={title}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                index === currentStep ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted-foreground"
              }`}
            >
              Stap {index + 1}: {title}
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{stepTitles[currentStep]}</h2>
          <p className="text-sm text-muted-foreground">Doorloop stap voor stap je aanvraag. Server-side validatie blijft altijd leidend.</p>
        </div>
      </div>

      {currentStep === 0 ? (
        <FormField id="serviceId" label="Welke dienst heb je nodig?" error={errors.serviceId}>
          <Select id="serviceId" value={draft.serviceId} onChange={(event) => updateDraft("serviceId", event.target.value)}>
            <option value="">Selecteer een dienst</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
        </FormField>
      ) : null}

      {currentStep === 1 ? (
        selectedQuestions.length ? (
          <div className="space-y-6">
            {selectedQuestions.map((question) => (
              <div key={question.id} className="space-y-3 rounded-3xl border p-5">
                {question.type === "textarea" ? (
                  <FormField
                    id={question.id}
                    label={`${question.question}${question.required ? " *" : ""}`}
                    description={question.help_text ?? undefined}
                    error={errors[question.id]}
                  >
                    <Textarea
                      id={question.id}
                      value={getStringAnswer(dynamicAnswers[question.id])}
                      onChange={(event) => updateDynamicAnswer(question.id, event.target.value)}
                    />
                  </FormField>
                ) : question.type === "select" ? (
                  <FormField
                    id={question.id}
                    label={`${question.question}${question.required ? " *" : ""}`}
                    description={question.help_text ?? undefined}
                    error={errors[question.id]}
                  >
                    <Select
                      id={question.id}
                      value={getStringAnswer(dynamicAnswers[question.id])}
                      onChange={(event) => updateDynamicAnswer(question.id, event.target.value)}
                    >
                      <option value="">Selecteer een optie</option>
                      {question.options.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                ) : question.type === "radio" ? (
                  <FormField
                    id={question.id}
                    label={`${question.question}${question.required ? " *" : ""}`}
                    description={question.help_text ?? undefined}
                    error={errors[question.id]}
                  >
                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <label key={option.id} className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm">
                          <input
                            type="radio"
                            name={question.id}
                            checked={dynamicAnswers[question.id] === option.value}
                            onChange={() => updateDynamicAnswer(question.id, option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </FormField>
                ) : question.type === "multiselect" ? (
                  <FormField
                    id={question.id}
                    label={`${question.question}${question.required ? " *" : ""}`}
                    description={question.help_text ?? undefined}
                    error={errors[question.id]}
                  >
                    <div className="space-y-3">
                      {question.options.map((option) => {
                        const selectedValues = getArrayAnswer(dynamicAnswers[question.id]);
                        return (
                          <label key={option.id} className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm">
                            <Checkbox
                              checked={selectedValues.includes(option.value)}
                              onChange={(event) => toggleDynamicMultiSelect(question.id, option.value, event.target.checked)}
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                  </FormField>
                ) : question.type === "boolean" ? (
                  <FormField
                    id={question.id}
                    label={`${question.question}${question.required ? " *" : ""}`}
                    description={question.help_text ?? undefined}
                    error={errors[question.id]}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm">
                        <input
                          type="radio"
                          name={question.id}
                          checked={dynamicAnswers[question.id] === true}
                          onChange={() => updateDynamicAnswer(question.id, true)}
                        />
                        Ja
                      </label>
                      <label className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm">
                        <input
                          type="radio"
                          name={question.id}
                          checked={dynamicAnswers[question.id] === false}
                          onChange={() => updateDynamicAnswer(question.id, false)}
                        />
                        Nee
                      </label>
                    </div>
                  </FormField>
                ) : (
                  <FormField
                    id={question.id}
                    label={`${question.question}${question.required ? " *" : ""}`}
                    description={question.help_text ?? undefined}
                    error={errors[question.id]}
                  >
                    <Input
                      id={question.id}
                      type={question.type === "number" ? "number" : "text"}
                      value={getStringAnswer(dynamicAnswers[question.id])}
                      onChange={(event) => updateDynamicAnswer(question.id, event.target.value)}
                    />
                  </FormField>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-surface-muted p-5 text-sm text-muted-foreground">
            Voor deze dienst zijn nog geen extra intakevragen actief. Je kunt doorgaan naar de locatiegegevens.
          </div>
        )
      ) : null}

      {currentStep === 2 ? (
        <div className="grid gap-4 md:grid-cols-3">
          <FormField id="postalCode" label="Postcode" error={errors.postalCode}>
            <Input
              id="postalCode"
              value={draft.postalCode}
              onChange={(event) => updateDraft("postalCode", formatPostalCode(event.target.value))}
              placeholder="4811 AB"
            />
          </FormField>
          <FormField id="houseNumber" label="Huisnummer" error={errors.houseNumber}>
            <Input id="houseNumber" value={draft.houseNumber} onChange={(event) => updateDraft("houseNumber", event.target.value)} />
          </FormField>
          <FormField id="houseNumberAddition" label="Toevoeging" description="Optioneel" error={errors.houseNumberAddition}>
            <Input
              id="houseNumberAddition"
              value={draft.houseNumberAddition}
              onChange={(event) => updateDraft("houseNumberAddition", event.target.value)}
            />
          </FormField>
        </div>
      ) : null}

      {currentStep === 3 ? (
        <div className="space-y-4">
          <FormField id="description" label="Omschrijf de klus" error={errors.description}>
            <Textarea
              id="description"
              value={draft.description}
              onChange={(event) => updateDraft("description", event.target.value)}
              placeholder="Beschrijf wat er moet gebeuren, wat de huidige situatie is en wat je verwacht van de vakman."
            />
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField id="urgency" label="Urgentie" error={errors.urgency}>
              <Select id="urgency" value={draft.urgency} onChange={(event) => updateDraft("urgency", event.target.value as LeadDraft["urgency"])}>
                {leadUrgencyValues.map((value) => (
                  <option key={value} value={value}>
                    {value === "urgent" ? "Urgent" : "Normaal"}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="preferredTiming" label="Voorkeur planning" error={errors.preferredTiming}>
              <Select
                id="preferredTiming"
                value={draft.preferredTiming}
                onChange={(event) => updateDraft("preferredTiming", event.target.value as LeadDraft["preferredTiming"])}
              >
                <option value="asap">Zo snel mogelijk</option>
                <option value="few_weeks">Binnen enkele weken</option>
                <option value="one_to_three_months">Binnen 1 tot 3 maanden</option>
                <option value="later">Later</option>
                <option value="unknown">Nog niet zeker</option>
              </Select>
            </FormField>
          </div>
        </div>
      ) : null}

      {currentStep === 4 ? (
        <FormField
          id="images"
          label="Voeg foto's toe"
          description={`Optioneel. Maximaal ${maxLeadImageCount} bestanden, JPG/PNG/WebP en maximaal ${formatFileSize(maxLeadImageSizeBytes)} per bestand.`}
          error={errors.images}
        >
          <Input id="images" type="file" accept={allowedLeadImageTypes.join(",")} multiple onChange={handleImageChange} />
          {images.length ? (
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {images.map((image) => (
                <li key={`${image.name}-${image.lastModified}`} className="flex items-center justify-between rounded-2xl bg-surface-muted px-4 py-3">
                  <span>{image.name}</span>
                  <span>{formatFileSize(image.size)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </FormField>
      ) : null}

      {currentStep === 5 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <FormField id="firstName" label="Voornaam" error={errors.firstName}>
            <Input id="firstName" value={draft.firstName} onChange={(event) => updateDraft("firstName", event.target.value)} />
          </FormField>
          <FormField id="lastName" label="Achternaam" error={errors.lastName}>
            <Input id="lastName" value={draft.lastName} onChange={(event) => updateDraft("lastName", event.target.value)} />
          </FormField>
          <FormField id="phone" label="Telefoonnummer" error={errors.phone}>
            <Input id="phone" value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} />
          </FormField>
          <FormField id="email" label="E-mailadres" error={errors.email}>
            <Input id="email" type="email" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} />
          </FormField>
        </div>
      ) : null}

      {currentStep === 6 ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-surface-muted p-5">
              <p className="text-sm font-medium text-muted-foreground">Dienst</p>
              <p className="mt-2 text-lg font-semibold">{selectedService?.name ?? "Niet geselecteerd"}</p>
            </div>
            <div className="rounded-3xl bg-surface-muted p-5">
              <p className="text-sm font-medium text-muted-foreground">Locatie</p>
              <p className="mt-2 text-lg font-semibold">
                {formatPostalCode(draft.postalCode)} {draft.houseNumber}
                {draft.houseNumberAddition ? ` ${draft.houseNumberAddition}` : ""}
              </p>
            </div>
          </div>
          {selectedQuestions.length ? (
            <div className="space-y-3 rounded-3xl bg-surface-muted p-5">
              <p className="text-sm font-medium text-muted-foreground">Dienstvragen</p>
              <ul className="space-y-3 text-sm">
                {selectedQuestions.map((question) => (
                  <li key={question.id}>
                    <p className="font-medium text-foreground">{question.question}</p>
                    <p className="text-muted-foreground">{getQuestionDisplayValue(question, dynamicAnswers[question.id])}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="space-y-3 rounded-3xl bg-surface-muted p-5">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-muted-foreground">Urgentie</p>
              <StatusBadge value={draft.urgency} />
            </div>
            <p className="text-sm leading-7 text-foreground">{draft.description}</p>
            <p className="text-sm text-muted-foreground">
              Contact: {draft.firstName} {draft.lastName} · {draft.phone} · {draft.email}
            </p>
            <p className="text-sm text-muted-foreground">Foto’s toegevoegd: {images.length}</p>
          </div>
        </div>
      ) : null}

      {formError ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{formError}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="secondary" onClick={handleBack} disabled={currentStep === 0 || submitting}>
          Vorige stap
        </Button>
        {currentStep === stepTitles.length - 1 ? (
          <Button type="button" onClick={handleSubmit} disabled={submitting || !services.length}>
            {submitting ? "Aanvraag wordt verstuurd..." : "Aanvraag versturen"}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext} disabled={!services.length}>
            Volgende stap
          </Button>
        )}
      </div>
    </Card>
  );
}

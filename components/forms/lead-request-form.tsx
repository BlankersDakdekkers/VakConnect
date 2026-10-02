"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { funnelEventNames, leadFunnelSteps, type AnalyticsValidationErrorType } from "@/lib/analytics/events";
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
const stepDescriptions = [
  "Kies het vakgebied dat het beste bij je klus past.",
  "Beantwoord de vragen die helpen om je klus goed te begrijpen.",
  "Waar is het werk nodig? We gebruiken je postcode voor de regionale aansluiting.",
  "Beschrijf wat er aan de hand is en wanneer je hulp zoekt.",
  "Foto's zijn optioneel, maar kunnen extra context geven.",
  "Vul je gegevens in zodat een vakman contact met je kan opnemen.",
  "Controleer je aanvraag voordat je deze verstuurt.",
];

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

function durationBucket(startedAt: number) {
  const seconds = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  if (seconds < 15) return "under_15s";
  if (seconds < 60) return "15_59s";
  if (seconds < 180) return "1_3m";
  return "over_3m";
}

export function LeadRequestForm({
  services,
  prefill,
}: Readonly<{
  services: Array<Service & { questions: ServiceQuestionDefinition[] }>;
  prefill?: {
    serviceId?: string;
    postalCode?: string;
  };
}>) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<LeadDraft>(() => ({
    ...initialDraft,
    serviceId: prefill?.serviceId ?? "",
    postalCode: prefill?.postalCode ?? "",
  }));
  const [dynamicAnswers, setDynamicAnswers] = useState<DynamicAnswerDraft>({});
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attribution] = useState(() => getClientAttributionSnapshot());
  const startedRef = useRef(false);
  const viewedStepRef = useRef<number | null>(null);
  const stepStartedAtRef = useRef(0);
  const formRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStepRef = useRef(currentStep);
  const focusErrorRef = useRef(false);

  useEffect(() => {
    if (previousStepRef.current !== currentStep) {
      previousStepRef.current = currentStep;
      headingRef.current?.focus();
    }
  }, [currentStep]);

  useEffect(() => {
    if (!focusErrorRef.current) return;
    focusErrorRef.current = false;
    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    const control = invalid?.matches("fieldset") ? invalid.querySelector<HTMLElement>("input, select, textarea") : invalid;
    control?.focus();
  }, [errors]);

  useEffect(() => {
    if (viewedStepRef.current === currentStep) return;
    viewedStepRef.current = currentStep;
    stepStartedAtRef.current = Date.now();
    const stepKey = leadFunnelSteps[currentStep];

    if (!startedRef.current) {
      startedRef.current = true;
      void trackFunnelEvent(funnelEventNames.leadFunnelStarted, { step_key: stepKey });
    }
    void trackFunnelEvent(funnelEventNames.leadFunnelStepViewed, { step_key: stepKey });
  }, [currentStep]);

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
      if (Object.keys(nextErrors).length) {
        const errorType: AnalyticsValidationErrorType =
          invalidFile?.size && invalidFile.size > maxLeadImageSizeBytes
            ? "file_too_large"
            : invalidFile
              ? "upload_failed"
              : "other";
        void trackFunnelEvent(funnelEventNames.leadFunnelValidationError, {
          step_key: leadFunnelSteps[step],
          error_type: errorType,
        });
      }
      focusErrorRef.current = Object.keys(nextErrors).length > 0;
      setErrors((current) => ({ ...current, ...nextErrors }));
      return Object.keys(nextErrors).length === 0;
    } else {
      result = contactStepSchema.safeParse(draft);
    }

    if (!result?.success) {
      const fieldNames = new Set(result.error.issues.map((issue) => String(issue.path[0])));
      const errorTypes = new Set<AnalyticsValidationErrorType>();
      const hasRequiredMissing = result.error.issues.some((issue) => issue.code === "too_small" || issue.code === "invalid_type");
      if (step === 2 && fieldNames.has("postalCode")) {
        errorTypes.add(result.error.issues.some((issue) => issue.path[0] === "postalCode" && issue.code === "invalid_format") ? "invalid_postcode" : "required_missing");
      } else if (step === 5 && fieldNames.has("phone")) {
        errorTypes.add(result.error.issues.some((issue) => issue.path[0] === "phone" && issue.code === "too_small") ? "required_missing" : "invalid_phone_format");
      } else if (step === 5 && fieldNames.has("email")) {
        errorTypes.add(result.error.issues.some((issue) => issue.path[0] === "email" && issue.code === "too_small") ? "required_missing" : "invalid_email_format");
      } else if (result.error.issues.length) {
        errorTypes.add(hasRequiredMissing || result.error.issues.every((issue) => issue.code === "custom") ? "required_missing" : "other");
      }
      for (const errorType of errorTypes) {
        void trackFunnelEvent(funnelEventNames.leadFunnelValidationError, {
          step_key: leadFunnelSteps[step],
          error_type: errorType,
        });
      }
      const nextErrors = Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message]));
      focusErrorRef.current = true;
      setErrors((current) => ({ ...current, ...nextErrors }));
      return false;
    }

    return true;
  }

  function handleNext() {
    if (!validateStep()) return;
    const stepKey = leadFunnelSteps[currentStep];
    void trackFunnelEvent(funnelEventNames.leadFunnelStepCompleted, {
      step_key: stepKey,
      duration_bucket: durationBucket(stepStartedAtRef.current),
    });

    if (currentStep === 0) {
      void trackFunnelEvent(funnelEventNames.serviceSelected, {
        service_id: draft.serviceId,
        ...(selectedService ? { service_slug: selectedService.slug } : {}),
      });
    }
    if (currentStep === 1) {
      const answeredCount = selectedQuestions.filter((question) => isDynamicAnswerFilled(dynamicAnswers[question.id])).length;
      void trackFunnelEvent(funnelEventNames.dynamicQuestionsCompleted, {
        question_count: selectedQuestions.length,
        answered_count: answeredCount,
      });
    }
    if (currentStep === 2) {
      void trackFunnelEvent(funnelEventNames.locationCompleted, { step_key: stepKey });
    }
    if (currentStep === 4) {
      void trackFunnelEvent(funnelEventNames.mediaStepCompleted, { upload_count: images.length, step_key: stepKey });
    }
    if (currentStep === 5) {
      void trackFunnelEvent(funnelEventNames.contactCompleted, { step_key: stepKey });
    }

    setCurrentStep((step) => Math.min(step + 1, stepTitles.length - 1));
  }

  function handleBack() {
    setFormError(null);
    if (currentStep > 0) {
      void trackFunnelEvent(funnelEventNames.leadFunnelBack, { step_key: leadFunnelSteps[currentStep] });
    }
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
    if (submitting) return;

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

    try {
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

      void trackFunnelEvent(funnelEventNames.leadFunnelStepCompleted, {
        step_key: leadFunnelSteps[6],
        duration_bucket: durationBucket(stepStartedAtRef.current),
      });
      router.push(`/aanvraag/bedankt?ref=${payload.reference}`);
    } catch {
      setSubmitting(false);
      setFormError("De aanvraag kon niet worden verstuurd. Controleer je verbinding en probeer het opnieuw.");
    }
  }

  return (
    <Card ref={formRef} className="mx-auto max-w-3xl space-y-6" aria-busy={submitting}>
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <p aria-live="polite" className="font-medium text-foreground">Stap {currentStep + 1} van {stepTitles.length}</p>
            <p className="text-muted-foreground">{Math.round(((currentStep + 1) / stepTitles.length) * 100)}%</p>
          </div>
          <div
            role="progressbar"
            aria-label="Voortgang van je aanvraag"
            aria-valuemin={1}
            aria-valuemax={stepTitles.length}
            aria-valuenow={currentStep + 1}
            aria-valuetext={`Stap ${currentStep + 1} van ${stepTitles.length}: ${stepTitles[currentStep]}`}
            className="h-2 overflow-hidden rounded-full bg-surface-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
              style={{ width: `${((currentStep + 1) / stepTitles.length) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight">{stepTitles[currentStep]}</h2>
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">{stepDescriptions[currentStep]}</p>
        </div>
      </div>

      {currentStep === 0 ? (
        <div className="space-y-4">
          <FormField id="serviceId" label="Welke dienst heb je nodig?" error={errors.serviceId}>
            <Select id="serviceId" disabled={!services.length} value={draft.serviceId} onChange={(event) => updateDraft("serviceId", event.target.value)}>
              <option value="">Selecteer een dienst</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </FormField>
          {!services.length ? (
            <p role="status" className="rounded-sm bg-surface-muted p-4 text-sm leading-6 text-muted-foreground">
              We kunnen op dit moment geen diensten tonen. Probeer het later opnieuw of <Link href="/contact" className="underline underline-offset-4">neem contact op</Link>.
            </p>
          ) : null}
        </div>
      ) : null}

      {currentStep === 1 ? (
        selectedQuestions.length ? (
          <div className="space-y-6">
            {selectedQuestions.map((question) => (
              <div key={question.id} className="space-y-3 border-t pt-5 first:border-t-0 first:pt-0">
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
                    group
                    id={question.id}
                    label={`${question.question}${question.required ? " *" : ""}`}
                    description={question.help_text ?? undefined}
                    error={errors[question.id]}
                  >
                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <label key={option.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-base has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <input
                            type="radio"
                            name={question.id}
                            aria-describedby={errors[question.id] ? `${question.id}-error` : undefined}
                            className="size-5 shrink-0"
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
                    group
                    id={question.id}
                    label={`${question.question}${question.required ? " *" : ""}`}
                    description={question.help_text ?? undefined}
                    error={errors[question.id]}
                  >
                    <div className="space-y-3">
                      {question.options.map((option) => {
                        const selectedValues = getArrayAnswer(dynamicAnswers[question.id]);
                        return (
                          <label key={option.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-base has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <Checkbox
                              checked={selectedValues.includes(option.value)}
                              aria-describedby={errors[question.id] ? `${question.id}-error` : undefined}
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
                    group
                    id={question.id}
                    label={`${question.question}${question.required ? " *" : ""}`}
                    description={question.help_text ?? undefined}
                    error={errors[question.id]}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-base has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <input
                          type="radio"
                          name={question.id}
                          aria-describedby={errors[question.id] ? `${question.id}-error` : undefined}
                          className="size-5 shrink-0"
                          checked={dynamicAnswers[question.id] === true}
                          onChange={() => updateDynamicAnswer(question.id, true)}
                        />
                        Ja
                      </label>
                      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-base has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <input
                          type="radio"
                          name={question.id}
                          aria-describedby={errors[question.id] ? `${question.id}-error` : undefined}
                          className="size-5 shrink-0"
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
          <div className="rounded-lg bg-surface-muted p-5 text-sm leading-6 text-muted-foreground">
            Voor deze dienst hoef je geen extra vragen te beantwoorden. Ga verder met de locatie van je klus.
          </div>
        )
      ) : null}

      {currentStep === 2 ? (
        <div className="grid gap-4 md:grid-cols-3">
          <FormField id="postalCode" label="Postcode" error={errors.postalCode}>
            <Input
              id="postalCode"
              autoComplete="postal-code"
              autoCapitalize="characters"
              value={draft.postalCode}
              onChange={(event) => updateDraft("postalCode", formatPostalCode(event.target.value))}
              placeholder="4811 AB"
            />
          </FormField>
          <FormField id="houseNumber" label="Huisnummer" error={errors.houseNumber}>
            <Input id="houseNumber" inputMode="numeric" value={draft.houseNumber} onChange={(event) => updateDraft("houseNumber", event.target.value)} />
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
                <li key={`${image.name}-${image.lastModified}`} className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-surface-muted px-4 py-3">
                  <span className="min-w-0 break-all">{image.name}</span>
                  <span className="shrink-0">{formatFileSize(image.size)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </FormField>
      ) : null}

      {currentStep === 5 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <FormField id="firstName" label="Voornaam" error={errors.firstName}>
            <Input id="firstName" autoComplete="given-name" value={draft.firstName} onChange={(event) => updateDraft("firstName", event.target.value)} />
          </FormField>
          <FormField id="lastName" label="Achternaam" error={errors.lastName}>
            <Input id="lastName" autoComplete="family-name" value={draft.lastName} onChange={(event) => updateDraft("lastName", event.target.value)} />
          </FormField>
          <FormField id="phone" label="Telefoonnummer" error={errors.phone}>
            <Input id="phone" type="tel" autoComplete="tel" value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} />
          </FormField>
          <FormField id="email" label="E-mailadres" error={errors.email}>
            <Input id="email" type="email" autoComplete="email" autoCapitalize="none" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} />
          </FormField>
        </div>
      ) : null}

      {currentStep === 6 ? (
        <div className="space-y-4 break-words">
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

      {formError ? <p role="alert" className="rounded-2xl border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">{formError}</p> : null}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
        <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={handleBack} disabled={currentStep === 0 || submitting}>
          Vorige stap
        </Button>
        {currentStep === stepTitles.length - 1 ? (
          <Button type="button" className="w-full sm:w-auto" onClick={handleSubmit} aria-busy={submitting} disabled={submitting || !services.length}>
            {submitting ? "Aanvraag wordt verstuurd..." : "Aanvraag versturen"}
          </Button>
        ) : (
          <Button type="button" className="w-full sm:w-auto" onClick={handleNext} disabled={!services.length}>
            Verder naar {stepTitles[currentStep + 1].toLowerCase()}
          </Button>
        )}
      </div>
      <p role="status" className="text-sm leading-6 text-muted-foreground">
        {submitting ? "Je aanvraag wordt verstuurd. Wacht even en sluit deze pagina niet." : currentStep === 6 ? "Na verzending controleren we je aanvraag en zoeken we een passende vakman. Beschikbaarheid verschilt per klus en regio." : "Je aanvraag wordt pas verstuurd na je controle in de laatste stap."}
      </p>
    </Card>
  );
}

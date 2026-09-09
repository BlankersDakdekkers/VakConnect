import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import {
  toggleServiceQuestionOptionStatusAction,
  toggleServiceQuestionStatusAction,
  upsertServiceQuestionAction,
  upsertServiceQuestionOptionAction,
} from "@/lib/services/actions";
import { getAdminServiceDetail } from "@/lib/services/queries";
import { serviceQuestionTypeValues } from "@/lib/validation";

const optionTypes = new Set(["select", "multiselect", "radio"]);

export default async function AdminServiceDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const service = await getAdminServiceDetail(id);

  if (!service) {
    notFound();
  }

  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;
  const redirectTo = `/admin/diensten/${service.id}`;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={service.category}
        title={service.name}
        description="Beheer dynamische intakevragen, volgorde en antwoordopties per dienst."
      />
      <div className="flex items-center gap-3 text-sm">
        <Link href="/admin/diensten" className="text-primary hover:underline">
          ← Terug naar diensten
        </Link>
        <span className="text-muted-foreground">Slug: /{service.slug}</span>
      </div>
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-5">
        <h2 className="text-lg font-semibold tracking-tight">Nieuwe dienstvraag</h2>
        <form action={upsertServiceQuestionAction} className="space-y-4">
          <input type="hidden" name="service_id" value={service.id} />
          <input type="hidden" name="redirect_to" value={redirectTo} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField id="question" label="Vraag">
              <Input id="question" name="question" required />
            </FormField>
            <FormField id="slug" label="Slug">
              <Input id="slug" name="slug" required />
            </FormField>
            <FormField id="type" label="Type">
              <Select id="type" name="type" defaultValue="text">
                {serviceQuestionTypeValues.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="sort_order" label="Sorteervolgorde">
              <Input id="sort_order" name="sort_order" type="number" defaultValue="0" required />
            </FormField>
          </div>
          <FormField id="help_text" label="Helptekst" description="Optioneel">
            <Textarea id="help_text" name="help_text" />
          </FormField>
          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <label className="flex items-center gap-3">
              <Checkbox name="required" />
              Verplicht
            </label>
            <label className="flex items-center gap-3">
              <Checkbox name="active" defaultChecked />
              Actief
            </label>
          </div>
          <SubmitButton pendingLabel="Vraag wordt opgeslagen...">Vraag toevoegen</SubmitButton>
        </form>
      </Card>

      <div className="space-y-6">
        {service.questions.map((question) => (
          <Card key={question.id} className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{question.question}</h2>
                <p className="text-sm text-muted-foreground">
                  {question.type} · sort {question.sort_order} · {question.required ? "verplicht" : "optioneel"} · {question.active ? "actief" : "inactief"}
                </p>
              </div>
              <form action={toggleServiceQuestionStatusAction}>
                <input type="hidden" name="question_id" value={question.id} />
                <input type="hidden" name="active" value={String(!question.active)} />
                <input type="hidden" name="redirect_to" value={redirectTo} />
                <SubmitButton variant="secondary" pendingLabel="Status wordt bijgewerkt...">
                  {question.active ? "Deactiveren" : "Activeren"}
                </SubmitButton>
              </form>
            </div>

            <form action={upsertServiceQuestionAction} className="space-y-4">
              <input type="hidden" name="question_id" value={question.id} />
              <input type="hidden" name="service_id" value={service.id} />
              <input type="hidden" name="redirect_to" value={redirectTo} />
              <div className="grid gap-4 md:grid-cols-2">
                <FormField id={`question-${question.id}`} label="Vraag">
                  <Input id={`question-${question.id}`} name="question" defaultValue={question.question} required />
                </FormField>
                <FormField id={`slug-${question.id}`} label="Slug">
                  <Input id={`slug-${question.id}`} name="slug" defaultValue={question.slug} required />
                </FormField>
                <FormField id={`type-${question.id}`} label="Type">
                  <Select id={`type-${question.id}`} name="type" defaultValue={question.type}>
                    {serviceQuestionTypeValues.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField id={`sort-${question.id}`} label="Sorteervolgorde">
                  <Input id={`sort-${question.id}`} name="sort_order" type="number" defaultValue={String(question.sort_order)} required />
                </FormField>
              </div>
              <FormField id={`help-${question.id}`} label="Helptekst" description="Optioneel">
                <Textarea id={`help-${question.id}`} name="help_text" defaultValue={question.help_text ?? ""} />
              </FormField>
              <div className="flex flex-wrap gap-6 text-sm font-medium">
                <label className="flex items-center gap-3">
                  <Checkbox name="required" defaultChecked={question.required} />
                  Verplicht
                </label>
                <label className="flex items-center gap-3">
                  <Checkbox name="active" defaultChecked={question.active} />
                  Actief
                </label>
              </div>
              <SubmitButton pendingLabel="Vraag wordt opgeslagen...">Vraag opslaan</SubmitButton>
            </form>

            {optionTypes.has(question.type) ? (
              <div className="space-y-4 rounded-3xl bg-surface-muted p-5">
                <div>
                  <h3 className="font-semibold">Opties</h3>
                  <p className="text-sm text-muted-foreground">Beheer label, waarde, volgorde en activatie van antwoordopties.</p>
                </div>
                {question.options.map((option) => (
                  <div key={option.id} className="rounded-3xl border bg-background p-4">
                    <div className="flex justify-end">
                      <form action={toggleServiceQuestionOptionStatusAction}>
                        <input type="hidden" name="option_id" value={option.id} />
                        <input type="hidden" name="active" value={String(!option.active)} />
                        <input type="hidden" name="redirect_to" value={redirectTo} />
                        <SubmitButton variant="secondary" pendingLabel="Status wordt bijgewerkt...">
                          {option.active ? "Deactiveren" : "Activeren"}
                        </SubmitButton>
                      </form>
                    </div>
                    <form action={upsertServiceQuestionOptionAction} className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_10rem_auto]">
                      <input type="hidden" name="option_id" value={option.id} />
                      <input type="hidden" name="question_id" value={question.id} />
                      <input type="hidden" name="redirect_to" value={redirectTo} />
                      <FormField id={`label-${option.id}`} label="Label">
                        <Input id={`label-${option.id}`} name="label" defaultValue={option.label} required />
                      </FormField>
                      <FormField id={`value-${option.id}`} label="Waarde">
                        <Input id={`value-${option.id}`} name="value" defaultValue={option.value} required />
                      </FormField>
                      <FormField id={`sort-${option.id}`} label="Sorteervolgorde">
                        <Input id={`sort-${option.id}`} name="sort_order" type="number" defaultValue={String(option.sort_order)} required />
                      </FormField>
                      <div className="flex items-end gap-3">
                        <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                          <Checkbox name="active" defaultChecked={option.active} />
                          Actief
                        </label>
                        <SubmitButton pendingLabel="Optie wordt opgeslagen...">Opslaan</SubmitButton>
                      </div>
                    </form>
                  </div>
                ))}

                <form action={upsertServiceQuestionOptionAction} className="grid gap-4 md:grid-cols-[1fr_1fr_10rem_auto]">
                  <input type="hidden" name="question_id" value={question.id} />
                  <input type="hidden" name="redirect_to" value={redirectTo} />
                  <FormField id={`new-label-${question.id}`} label="Nieuw label">
                    <Input id={`new-label-${question.id}`} name="label" required />
                  </FormField>
                  <FormField id={`new-value-${question.id}`} label="Nieuwe waarde">
                    <Input id={`new-value-${question.id}`} name="value" required />
                  </FormField>
                  <FormField id={`new-sort-${question.id}`} label="Sorteervolgorde">
                    <Input id={`new-sort-${question.id}`} name="sort_order" type="number" defaultValue="0" required />
                  </FormField>
                  <div className="flex items-end gap-3">
                    <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                      <Checkbox name="active" defaultChecked />
                      Actief
                    </label>
                    <SubmitButton pendingLabel="Optie wordt opgeslagen...">Optie toevoegen</SubmitButton>
                  </div>
                </form>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Dit vraagtype gebruikt geen antwoordopties.</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

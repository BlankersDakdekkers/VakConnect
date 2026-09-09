import { signInAction } from "@/lib/auth/actions";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm({ next }: Readonly<{ next?: string }>) {
  return (
    <form action={signInAction} className="space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <FormField id="email" label="E-mailadres">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FormField>
      <FormField id="password" label="Wachtwoord">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FormField>
      <SubmitButton className="w-full" pendingLabel="Bezig met inloggen...">
        Inloggen
      </SubmitButton>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { submitApplication } from "@/app/actions";
import { Button } from "../Button";

type ApplicationFormProps = {
  roleSlug: string;
  roleTitle: string;
};

export function ApplicationForm({ roleSlug, roleTitle }: ApplicationFormProps) {
  const [state, formAction, pending] = useActionState(submitApplication, null);

  if (state?.ok) {
    return (
      <div
        className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg font-semibold text-foreground">{state.message}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Applied for: {roleTitle}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="roleSlug" value={roleSlug} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required error={state?.fieldErrors?.name} />
        <Field label="Email" name="email" type="email" required error={state?.fieldErrors?.email} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)" name="phone" type="tel" error={state?.fieldErrors?.phone} />
        <Field
          label="Portfolio / GitHub URL (optional)"
          name="portfolioUrl"
          type="url"
          error={state?.fieldErrors?.portfolioUrl}
        />
      </div>

      <div>
        <label htmlFor="coverLetter" className="mb-1.5 block text-sm font-medium text-foreground">
          Cover letter <span className="text-primary">*</span>
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          required
          rows={8}
          placeholder="Tell us why you're a fit for this role and what you've built recently."
          aria-invalid={!!state?.fieldErrors?.coverLetter}
          aria-describedby={state?.fieldErrors?.coverLetter ? "cover-error" : undefined}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
        />
        {state?.fieldErrors?.coverLetter && (
          <p id="cover-error" className="mt-1.5 text-sm text-red-500" role="alert">
            {state.fieldErrors.coverLetter}
          </p>
        )}
      </div>

      {state && !state.ok && !state.fieldErrors && (
        <p className="text-sm text-red-500" role="alert">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        size="lg"
        onClick={() =>
          window.prabhixTrack?.("careers_apply_clicked", { roleSlug, roleTitle })
        }
      >
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  const id = `app-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

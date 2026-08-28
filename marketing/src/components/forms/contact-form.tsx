"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitLead } from "@/app/actions";
import { LEAD_INTEREST_OPTIONS, type LeadInterest } from "@/lib/lead-interests";
import { getVisitorTracker } from "@/lib/visitor/tracker";
import { Button } from "../Button";

const employeeCounts = ["1–10", "11–50", "51–200", "201–1000", "1000+"];

type ContactFormProps = {
  defaultInterest?: LeadInterest;
  source?: string;
};

export function ContactForm({
  defaultInterest = "OTHER",
  source = "contact",
}: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitLead, null);
  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const lastPayloadRef = useRef<{
    name: string;
    email: string;
    interest: LeadInterest;
  }>({ name: "", email: "", interest: defaultInterest });

  useEffect(() => {
    if (!state?.ok || submittedRef.current) return;
    submittedRef.current = true;
    const { name, email, interest } = lastPayloadRef.current;
    if (name && email) {
      getVisitorTracker().identify(name, email);
    }
    if (source === "demo-request") {
      window.prabhixTrack?.("demo_requested", { interest });
    }
    window.prabhixTrack?.("contact_form_submitted", { interest, source });
  }, [state?.ok, source]);

  if (state?.ok) {
    return (
      <div
        className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg font-semibold text-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5"
      noValidate
      onFocus={() => {
        if (startedRef.current) return;
        startedRef.current = true;
        window.prabhixTrack?.("contact_form_started", { source });
      }}
      onSubmit={(event) => {
        const form = event.currentTarget;
        const data = new FormData(form);
        lastPayloadRef.current = {
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          interest: (String(data.get("interest") ?? defaultInterest) ||
            defaultInterest) as LeadInterest,
        };
      }}
    >
      <input type="hidden" name="source" value={source} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          name="name"
          required
          error={state?.fieldErrors?.name}
        />
        <Field
          label="Work email"
          name="email"
          type="email"
          required
          error={state?.fieldErrors?.email}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Company"
          name="company"
          required
          error={state?.fieldErrors?.company}
        />
        <Field
          label="Phone (optional)"
          name="phone"
          type="tel"
          error={state?.fieldErrors?.phone}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Employee count"
          name="employeeCount"
          options={employeeCounts.map((value) => ({ value, label: value }))}
          error={state?.fieldErrors?.employeeCount}
        />
        <SelectField
          label="I'm interested in"
          name="interest"
          options={LEAD_INTEREST_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          defaultValue={defaultInterest}
          required
          error={state?.fieldErrors?.interest}
        />
      </div>

      <TextareaField
        label="Message"
        name="message"
        required
        error={state?.fieldErrors?.message}
      />

      {state && !state.ok && !state.fieldErrors && (
        <p className="text-sm text-red-500" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Sending…" : "Send message"}
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
  const id = `field-${name}`;
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
        className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
  required,
  error,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  required?: boolean;
  error?: string;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none"
      >
        {!required && <option value="">Select…</option>}
        {options.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function TextareaField({
  label,
  name,
  required,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={5}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

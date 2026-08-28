"use server";

import { siteConfig } from "@/lib/utils";
import {
  applicationSchema,
  leadSchema,
  subscriberSchema,
  type ActionResult,
} from "@/lib/validations";

async function postToApi<T>(
  path: string,
  body: T,
): Promise<{ ok: true } | { ok: false; status?: number }> {
  try {
    const response = await fetch(`${siteConfig.apiUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      return { ok: false, status: response.status };
    }

    return { ok: true };
  } catch {
    return { ok: false };
  }
}

function zodFieldErrors(
  error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } },
): Record<string, string> {
  const flattened = error.flatten().fieldErrors;
  const fieldErrors: Record<string, string> = {};

  for (const [key, messages] of Object.entries(flattened)) {
    if (messages?.[0]) {
      fieldErrors[key] = messages[0];
    }
  }

  return fieldErrors;
}

export async function submitLead(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    phone: formData.get("phone") || undefined,
    employeeCount: formData.get("employeeCount") || undefined,
    interest: formData.get("interest"),
    message: formData.get("message"),
    source: formData.get("source") || "contact",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const result = await postToApi("/api/v1/site/leads", parsed.data);

  if (!result.ok) {
    return {
      ok: false,
      message:
        "We couldn't reach our servers right now. Please try again in a moment or email hello@prabhixtechnologies.com.",
    };
  }

  return {
    ok: true,
    message: "Thank you — we'll be in touch within one business day.",
  };
}

export async function subscribeNewsletter(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = subscriberSchema.safeParse({
    email: formData.get("email"),
    source: formData.get("source") || "newsletter",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please enter a valid email address.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const result = await postToApi("/api/v1/site/subscribers", parsed.data);

  if (!result.ok) {
    return {
      ok: false,
      message:
        "Subscription failed — our service may be temporarily unavailable. Try again shortly.",
    };
  }

  return {
    ok: true,
    message: "You're subscribed. We'll send product updates — no spam.",
  };
}

export async function submitApplication(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = applicationSchema.safeParse({
    roleSlug: formData.get("roleSlug"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    portfolioUrl: formData.get("portfolioUrl") || undefined,
    coverLetter: formData.get("coverLetter"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const payload = {
    ...parsed.data,
    portfolioUrl: parsed.data.portfolioUrl || undefined,
  };

  try {
    const formBody = new FormData();
    formBody.append(
      "application",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    const response = await fetch(`${siteConfig.apiUrl}/api/v1/site/applications`, {
      method: "POST",
      body: formBody,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        message:
          "We couldn't submit your application right now. Please try again or email careers@prabhixtechnologies.com.",
      };
    }
  } catch {
    return {
      ok: false,
      message:
        "We couldn't submit your application right now. Please try again or email careers@prabhixtechnologies.com.",
    };
  }

  return {
    ok: true,
    message: "Application received. Our team will review it and respond soon.",
  };
}

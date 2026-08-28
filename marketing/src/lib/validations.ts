import { z } from "zod";
import { LEAD_INTEREST_VALUES } from "./lead-interests";

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid work email"),
  company: z.string().min(1, "Company is required"),
  phone: z.string().optional(),
  employeeCount: z.string().optional(),
  interest: z.enum(LEAD_INTEREST_VALUES, {
    errorMap: () => ({ message: "Please select an interest" }),
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
  source: z.string().default("contact"),
});

export const subscriberSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  source: z.string().default("newsletter"),
});

export const applicationSchema = z.object({
  roleSlug: z.string().min(1),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  portfolioUrl: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters"),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type SubscriberInput = z.infer<typeof subscriberSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;

export type ActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  company: z.string().min(1, "Company is required").min(2, "Company must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine((val) => val === true, "You must agree to receive communications")
});

export type ContactFormData = z.infer<typeof contactSchema>;

export interface ContactRequest extends ContactFormData {}

import { z } from 'zod';
import { formatNaira } from './format';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters'),
});

const phone = z
  .string()
  .transform((s) => s.replace(/[\s-]/g, ''))
  .refine((s) => /^(\+234|234|0)\d{10}$/.test(s), 'Enter a valid Nigerian phone number');

export const signupSchema = loginSchema.extend({
  name: z.string().trim().min(2, 'Enter your full name'),
  phone,
});

/** Edit-profile form. Phone and city are optional; phone is validated only when filled in. */
export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email'),
  phone: phone.or(z.literal('')),
  city: z.string().trim().max(60, 'City is too long'),
});

export const makeBidSchema = (minBid: number) =>
  z.object({
    amount: z
      .number({ invalid_type_error: 'Enter a bid amount' })
      .min(minBid, `Bid must be at least ${formatNaira(minBid)}`),
  });

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  phone,
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email'),
  address: z.string().trim().min(5, 'Enter your address'),
});

export const termsSchema = z.object({
  accepted: z.boolean().refine((v) => v === true, 'Please accept the terms to continue'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Collapse zod issues into `{ field: firstMessage }` for simple form state. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

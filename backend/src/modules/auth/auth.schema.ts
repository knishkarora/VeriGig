import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['student', 'employer']),
  fullName: z.string().min(2, 'Name must be at least 2 characters long'),
  
  // Student-specific fields
  collegeName: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.number().int().optional(),
  skills: z.array(z.string()).optional(),
  
  // Employer-specific fields
  companyName: z.string().optional(),
  businessType: z.string().optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  
  // DPDPA Consent
  dpdpaConsent: z.boolean().refine(val => val === true, {
    message: 'DPDPA data protection consent must be accepted',
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const googleOAuthSchema = z.object({
  accessToken: z.string().min(1, 'Google access token is required'),
  requestedRole: z.enum(['student', 'employer']),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleOAuthInput = z.infer<typeof googleOAuthSchema>;

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
  city: z.string().default('Ludhiana'),
  state: z.string().default('Punjab'),
  
  // DPDPA Consent
  dpdpaConsent: z.boolean().refine(val => val === true, {
    message: 'DPDPA data protection consent must be accepted',
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

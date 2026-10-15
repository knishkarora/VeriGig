import { z } from 'zod';

export const updateStudentProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  collegeName: z.string().optional(),
  rollNumber: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.number().int().min(2000).max(2035).optional(),
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  workModePreference: z.enum(['remote', 'on_site', 'both']).optional(),
  portfolioLinks: z.array(
    z.object({
      label: z.string().min(1),
      url: z.string().url('Invalid portfolio URL'),
    })
  ).optional(),
  availabilityStatus: z.enum(['available_now', 'busy', 'exam_break']).optional().or(z.literal('')),
});

export const updateBusinessProfileSchema = z.object({
  companyName: z.string().min(2).optional(),
  businessType: z.string().min(2).optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().max(2000).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
});

export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;
export type UpdateBusinessProfileInput = z.infer<typeof updateBusinessProfileSchema>;

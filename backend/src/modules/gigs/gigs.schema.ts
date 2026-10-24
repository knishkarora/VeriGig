import { z } from 'zod';

export const createMilestoneSchema = z.object({
  title: z.string().min(3, 'Milestone title is required'),
  description: z.string().min(5, 'Milestone description is required'),
  deliverableCriteria: z.string().optional(),
  amount: z.number().int().min(500, 'Milestone amount must be at least ₹500'),
  durationDays: z.number().int().min(1).default(7),
});

export const createGigSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.enum([
    'Web Dev',
    'UI/UX',
    'Graphic Design',
    'Content & Copy',
    'Social Media',
    'Data & Research',
  ]),
  description: z.string().min(20, 'Description must be detailed (min 20 chars)'),
  gigLevel: z.enum(['beginner_ready', 'intermediate', 'advanced']).default('beginner_ready'),
  workMode: z.enum(['Hyper-local (On-Campus)', 'City-wide', 'Remote']),
  city: z.string().default('Ludhiana'),
  state: z.string().default('Punjab'),
  campusProximity: z.string().optional(),
  estimatedHours: z.number().int().min(1).default(15),
  totalBudget: z.number().int().min(1500, 'Minimum budget floor is ₹1,500 to protect student contractors'),
  paymentType: z.enum(['milestone', 'fixed']).default('milestone'),
  targetDuration: z.enum(['Under 48 hrs', '1 week', '2 weeks', '1 month']),
  maxRevisions: z.number().int().min(1).max(5).default(2),
  
  expectedDeliverables: z.array(z.string()).min(1, 'At least one measurable deliverable is mandatory'),
  requiredSkills: z.array(z.string()).min(1, 'At least one required skill is mandatory'),
  preferredColleges: z.array(z.string()).default([]),

  milestones: z.array(createMilestoneSchema).min(1, 'At least one milestone is mandatory'),
});

export const filterGigsSchema = z.object({
  category: z.string().optional(),
  workMode: z.string().optional(),
  city: z.string().optional(),
  gigLevel: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  minBudget: z.coerce.number().optional(),
  maxBudget: z.coerce.number().optional(),
  limit: z.coerce.number().default(20),
  offset: z.coerce.number().default(0),
});

export const moderateGigSchema = z.object({
  action: z.enum(['approve', 'reject', 'flag']),
  reason: z.string().optional(),
});

export type CreateGigInput = z.infer<typeof createGigSchema>;
export type FilterGigsInput = z.infer<typeof filterGigsSchema>;
export type ModerateGigInput = z.infer<typeof moderateGigSchema>;

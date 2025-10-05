import { z } from 'zod';

export const settingsSchema = z.object({
    horizonYears: z.number().int().min(1).max(30).default(5),
    riskTolerance: z.enum(['low', 'medium', 'high']).default('medium'),
    maxMonthlyOutflowDeltaVsRent: z.number().min(0).default(0),
    minEquityPctAtHorizon: z.number().min(0).max(100).default(10),
    taxRate: z.number().min(0).max(100).default(0),
    maintenancePct: z.number().min(0).max(100).default(1),
    appreciationPct: z.number().min(0).max(100).default(0),
    inflationPct: z.number().min(0).max(100).default(0),
    pmiThresholdPct: z.number().min(50).max(97).default(80),
    pmiRemovalAuto: z.boolean().default(true)
});

export type UserPreferences = z.infer<typeof settingsSchema>;

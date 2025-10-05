import { z } from 'zod';

export const scenarioSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1),
    homePrice: z.number().positive(),
    downPayment: z.number().min(0),
    interestRateAPR: z.number().min(0).max(100),
    termYears: z.number().int().min(1).max(50),
    propertyTaxAnnual: z.number().min(0).default(0),
    insuranceAnnual: z.number().min(0).default(0),
    hoaMonthly: z.number().min(0).default(0),
    maintenancePctOverride: z.number().min(0).max(100).optional(),
    pmi: z.object({ enabled: z.boolean(), annualRatePct: z.number().min(0).max(5).default(0.5) }).optional(),
    closingCosts: z.number().min(0).default(0),
    rentAlternativeMonthly: z.number().min(0).default(0),
    rentInflationPct: z.number().min(0).max(100).default(0),
    startDate: z.string().optional()
});

export type ScenarioInput = z.infer<typeof scenarioSchema>;

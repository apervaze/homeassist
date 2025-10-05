import type { AmortizationRow } from './amortization';

export interface HorizonSummary {
    months: number;
    equityAtHorizon: number;
    totalInterestPaid: number;
}

export const summarizeAtHorizon = (schedule: AmortizationRow[], months: number): HorizonSummary => {
    const slice = schedule.slice(0, months);
    const equityAtHorizon = slice.length ? slice[slice.length - 1].cumulativeEquity : 0;
    const totalInterestPaid = slice.reduce((sum, r) => sum + r.interest, 0);
    return { months, equityAtHorizon, totalInterestPaid };
};

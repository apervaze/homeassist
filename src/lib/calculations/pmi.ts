export interface PmiInput {
    homePrice: number;
    downPayment: number;
    pmiAnnualRatePct: number; // annual PMI as percent of outstanding balance or original loan depending on lender; we use outstanding balance approximation
    thresholdLtvPct?: number; // default 80
}

export const computePmiMonthly = (outstandingBalance: number, input: PmiInput): number => {
    const rate = input.pmiAnnualRatePct / 100;
    return (outstandingBalance * rate) / 12;
};

export const shouldApplyPmi = (outstandingBalance: number, input: PmiInput): boolean => {
    const threshold = (input.thresholdLtvPct ?? 80) / 100;
    const loanAmount = input.homePrice - input.downPayment;
    const ltv = outstandingBalance / input.homePrice;
    return loanAmount > 0 && ltv > threshold;
};

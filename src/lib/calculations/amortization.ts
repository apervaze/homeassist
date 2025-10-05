export interface AmortizationInput {
    principal: number; // loan amount after down payment
    annualRatePct: number; // APR in percent
    termYears: number; // loan term in years
    startDate?: Date;
}

export interface AmortizationRow {
    monthIndex: number;
    date: Date;
    payment: number;
    principal: number;
    interest: number;
    remainingPrincipal: number;
    cumulativeEquity: number;
}

export const calculateMonthlyPayment = (principal: number, annualRatePct: number, termYears: number): number => {
    const monthlyRate = annualRatePct / 100 / 12;
    const n = termYears * 12;
    if (monthlyRate === 0) return principal / n;
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, n);
    const denominator = Math.pow(1 + monthlyRate, n) - 1;
    return principal * (numerator / denominator);
};

export const buildAmortizationSchedule = (input: AmortizationInput): AmortizationRow[] => {
    const { principal, annualRatePct, termYears, startDate } = input;
    const schedule: AmortizationRow[] = [];
    const payment = calculateMonthlyPayment(principal, annualRatePct, termYears);
    let balance = principal;
    let cumulativeEquity = 0;
    const start = startDate ? new Date(startDate) : new Date();

    const totalMonths = termYears * 12;
    for (let m = 1; m <= totalMonths; m++) {
        const interest = balance * (annualRatePct / 100 / 12);
        const principalPaid = Math.min(payment - interest, balance);
        balance = Math.max(0, balance - principalPaid);
        cumulativeEquity += principalPaid;
        const date = new Date(start);
        date.setMonth(start.getMonth() + m - 1);
        schedule.push({
            monthIndex: m,
            date,
            payment,
            principal: principalPaid,
            interest,
            remainingPrincipal: balance,
            cumulativeEquity
        });
        if (balance <= 0) break;
    }
    return schedule;
};

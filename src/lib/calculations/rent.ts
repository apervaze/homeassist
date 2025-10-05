export const projectRent = (baseMonthlyRent: number, months: number, annualInflationPct = 0): number[] => {
    const monthlyInflation = annualInflationPct / 100 / 12;
    const series: number[] = [];
    let value = baseMonthlyRent;
    for (let i = 0; i < months; i++) {
        series.push(value);
        value *= 1 + monthlyInflation;
    }
    return series;
};

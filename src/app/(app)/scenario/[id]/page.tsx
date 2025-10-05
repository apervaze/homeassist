import AmortizationTable from '@/components/amortization-table';
import { buildAmortizationSchedule, calculateMonthlyPayment } from '@/lib/calculations/amortization';
import { ScenarioRepository } from '@/lib/persistence/repository';

interface PageProps {
    params: { id: string };
}

const Page = async ({ params }: PageProps) => {
    const scenario = await ScenarioRepository.getById(params.id);
    if (!scenario) {
        return (
            <main className='mx-auto max-w-screen-md px-4 py-6'>
                <h1 className='mb-2 text-2xl font-semibold'>Scenario not found</h1>
                <p className='text-muted-foreground text-sm'>The scenario ID is invalid or was removed.</p>
            </main>
        );
    }

    const loanAmount = scenario.homePrice - scenario.downPayment;
    const schedule = buildAmortizationSchedule({
        principal: loanAmount,
        annualRatePct: scenario.interestRateAPR,
        termYears: scenario.termYears
    });
    const monthlyPayment = calculateMonthlyPayment(loanAmount, scenario.interestRateAPR, scenario.termYears);

    return (
        <main className='mx-auto max-w-screen-lg px-4 py-6'>
            <h1 className='mb-2 text-2xl font-semibold'>{scenario.name}</h1>
            <p className='text-muted-foreground text-sm'>Monthly payment (P&I): ${monthlyPayment.toFixed(2)}</p>
            <div className='mt-6'>
                <AmortizationTable rows={schedule} />
            </div>
        </main>
    );
};

export default Page;

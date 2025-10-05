'use client';

import { useRouter } from 'next/navigation';

import { type ScenarioEntity, ScenarioRepository } from '@/lib/persistence/repository';
import { type ScenarioInput, scenarioSchema } from '@/lib/validation/scenario';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const number = { valueAsNumber: true } as const;

export const ScenarioForm = () => {
    const router = useRouter();
    const form = useForm<ScenarioInput>({
        resolver: zodResolver(scenarioSchema),
        defaultValues: {
            name: '',
            homePrice: 500000,
            downPayment: 100000,
            interestRateAPR: 6.5,
            termYears: 30,
            propertyTaxAnnual: 6000,
            insuranceAnnual: 1800,
            hoaMonthly: 0,
            closingCosts: 0,
            rentAlternativeMonthly: 2200,
            rentInflationPct: 3
        }
    });

    const onSubmit = async (data: ScenarioInput) => {
        const id = crypto.randomUUID();
        const entity: ScenarioEntity = { id, ...data };
        await ScenarioRepository.upsert(entity);
        toast.success('Scenario saved');
        router.push(`/scenario/${id}`);
    };

    return (
        <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-2'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' {...form.register('name')} placeholder='My First Scenario' />
                <p className='text-muted-foreground text-xs'>{form.formState.errors.name?.message}</p>
            </div>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                <div className='grid gap-2'>
                    <Label htmlFor='homePrice'>Home price ($)</Label>
                    <Input id='homePrice' type='number' step='1000' {...form.register('homePrice', number)} />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='downPayment'>Down payment ($)</Label>
                    <Input id='downPayment' type='number' step='1000' {...form.register('downPayment', number)} />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='interestRateAPR'>Interest APR (%)</Label>
                    <Input
                        id='interestRateAPR'
                        type='number'
                        step='0.01'
                        {...form.register('interestRateAPR', number)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='termYears'>Term (years)</Label>
                    <Input id='termYears' type='number' step='1' {...form.register('termYears', number)} />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='propertyTaxAnnual'>Property tax (annual $)</Label>
                    <Input
                        id='propertyTaxAnnual'
                        type='number'
                        step='100'
                        {...form.register('propertyTaxAnnual', number)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='insuranceAnnual'>Insurance (annual $)</Label>
                    <Input
                        id='insuranceAnnual'
                        type='number'
                        step='100'
                        {...form.register('insuranceAnnual', number)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='hoaMonthly'>HOA (monthly $)</Label>
                    <Input id='hoaMonthly' type='number' step='10' {...form.register('hoaMonthly', number)} />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='closingCosts'>Closing costs ($)</Label>
                    <Input id='closingCosts' type='number' step='100' {...form.register('closingCosts', number)} />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='rentAlternativeMonthly'>Rent alternative (monthly $)</Label>
                    <Input
                        id='rentAlternativeMonthly'
                        type='number'
                        step='10'
                        {...form.register('rentAlternativeMonthly', number)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='rentInflationPct'>Rent inflation (%)</Label>
                    <Input
                        id='rentInflationPct'
                        type='number'
                        step='0.1'
                        {...form.register('rentInflationPct', number)}
                    />
                </div>
            </div>
            <div className='flex gap-3'>
                <Button
                    type='submit'
                    disabled={form.formState.isSubmitting}
                    className={`transition-all duration-200 active:scale-95 disabled:opacity-80 disabled:active:scale-100 ${
                        form.formState.isSubmitting
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'cursor-pointer'
                    }`}>
                    {form.formState.isSubmitting ? (
                        <span className='inline-flex items-center gap-2'>
                            <Loader2 className='h-4 w-4 animate-spin' /> Saving...
                        </span>
                    ) : (
                        <span className='inline-flex items-center gap-2'>
                            <Save className='h-4 w-4' /> Save Scenario
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ScenarioForm;

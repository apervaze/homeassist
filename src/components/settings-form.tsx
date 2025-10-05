'use client';

import { useEffect } from 'react';

import { PreferencesRepository } from '@/lib/persistence/repository';
import { type UserPreferences, settingsSchema } from '@/lib/validation/settings';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const number = { valueAsNumber: true } as const;

const SettingsForm = () => {
    const form = useForm<UserPreferences>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            horizonYears: 5,
            riskTolerance: 'medium',
            maxMonthlyOutflowDeltaVsRent: 0,
            minEquityPctAtHorizon: 10,
            taxRate: 0,
            maintenancePct: 1,
            appreciationPct: 0,
            inflationPct: 0,
            pmiThresholdPct: 80,
            pmiRemovalAuto: true
        }
    });

    useEffect(() => {
        (async () => {
            const prefs = await PreferencesRepository.get();
            if (prefs) form.reset(prefs);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data: UserPreferences) => {
        await PreferencesRepository.set(data);
        toast.success('Preferences saved');
    };

    return (
        <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                <div className='grid gap-2'>
                    <Label htmlFor='horizonYears'>Horizon (years)</Label>
                    <Input id='horizonYears' type='number' step='1' {...form.register('horizonYears', number)} />
                </div>
                <div className='grid gap-2'>
                    <Label>Risk tolerance</Label>
                    <Select
                        value={form.watch('riskTolerance')}
                        onValueChange={(v) => form.setValue('riskTolerance', v as UserPreferences['riskTolerance'])}>
                        <SelectTrigger>
                            <SelectValue placeholder='Select' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='low'>Low</SelectItem>
                            <SelectItem value='medium'>Medium</SelectItem>
                            <SelectItem value='high'>High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='maxMonthlyOutflowDeltaVsRent'>Max $ over rent (monthly)</Label>
                    <Input
                        id='maxMonthlyOutflowDeltaVsRent'
                        type='number'
                        step='10'
                        {...form.register('maxMonthlyOutflowDeltaVsRent', number)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='minEquityPctAtHorizon'>Min equity at horizon (%)</Label>
                    <Input
                        id='minEquityPctAtHorizon'
                        type='number'
                        step='0.1'
                        {...form.register('minEquityPctAtHorizon', number)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='taxRate'>Tax rate (%)</Label>
                    <Input id='taxRate' type='number' step='0.1' {...form.register('taxRate', number)} />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='maintenancePct'>Maintenance (% of price yearly)</Label>
                    <Input id='maintenancePct' type='number' step='0.1' {...form.register('maintenancePct', number)} />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='appreciationPct'>Appreciation (%)</Label>
                    <Input
                        id='appreciationPct'
                        type='number'
                        step='0.1'
                        {...form.register('appreciationPct', number)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='inflationPct'>Inflation (%)</Label>
                    <Input id='inflationPct' type='number' step='0.1' {...form.register('inflationPct', number)} />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='pmiThresholdPct'>PMI threshold LTV (%)</Label>
                    <Input
                        id='pmiThresholdPct'
                        type='number'
                        step='0.1'
                        {...form.register('pmiThresholdPct', number)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label>PMI auto removal</Label>
                    <Select
                        value={String(form.watch('pmiRemovalAuto'))}
                        onValueChange={(v) => form.setValue('pmiRemovalAuto', v === 'true')}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='true'>Enabled</SelectItem>
                            <SelectItem value='false'>Disabled</SelectItem>
                        </SelectContent>
                    </Select>
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
                            <Save className='h-4 w-4' /> Save
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default SettingsForm;

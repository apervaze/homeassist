'use client';

import type { AmortizationRow } from '@/lib/calculations/amortization';
import { formatCurrency } from '@/lib/calculations/currency';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';

import { format } from 'date-fns';

interface Props {
    rows: AmortizationRow[];
}

const AmortizationTable = ({ rows }: Props) => {
    return (
        <div className='overflow-x-auto'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className='text-right'>Payment</TableHead>
                        <TableHead className='text-right'>Principal</TableHead>
                        <TableHead className='text-right'>Interest</TableHead>
                        <TableHead className='text-right'>Remaining</TableHead>
                        <TableHead className='text-right'>Cumulative Equity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.slice(0, 120).map((r) => (
                        <TableRow key={r.monthIndex}>
                            <TableCell>{r.monthIndex}</TableCell>
                            <TableCell>{format(r.date, 'LLL yyyy')}</TableCell>
                            <TableCell className='text-right'>{formatCurrency(r.payment)}</TableCell>
                            <TableCell className='text-right'>{formatCurrency(r.principal)}</TableCell>
                            <TableCell className='text-right'>{formatCurrency(r.interest)}</TableCell>
                            <TableCell className='text-right'>{formatCurrency(r.remainingPrincipal)}</TableCell>
                            <TableCell className='text-right'>{formatCurrency(r.cumulativeEquity)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <p className='text-muted-foreground mt-2 text-xs'>Showing first 120 months.</p>
        </div>
    );
};

export default AmortizationTable;

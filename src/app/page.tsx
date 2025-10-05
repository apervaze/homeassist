import Link from 'next/link';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';

/**
 * The main page component that renders the HomePage component.
 *
 * @returns {JSX.Element} The rendered HomePage component.
 */
const Page = () => {
    return (
        <main className='mx-auto max-w-screen-md px-4 py-6'>
            <div className='mb-6'>
                <h1 className='text-2xl font-semibold'>Your Scenarios</h1>
                <p className='text-muted-foreground text-sm'>Create scenarios and compare outcomes over time.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Get started</CardTitle>
                    <CardDescription>Create your first scenario to see amortization and equity.</CardDescription>
                </CardHeader>
                <CardContent className='flex items-center gap-3'>
                    <Button asChild>
                        <Link href='/scenario/new'>New Scenario</Link>
                    </Button>
                    <Button variant='outline' asChild>
                        <Link href='/compare'>Compare</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
};

export default Page;

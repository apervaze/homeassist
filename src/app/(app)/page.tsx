import Link from 'next/link';

import { Button } from '@/registry/new-york-v4/ui/button';

const Page = () => {
    return (
        <main className='mx-auto max-w-screen-md px-4 py-6'>
            <div className='mb-4'>
                <h1 className='text-2xl font-semibold'>Dashboard</h1>
                <p className='text-muted-foreground text-sm'>Manage scenarios and compare outcomes.</p>
            </div>
            <div className='flex items-center gap-3'>
                <Button asChild>
                    <Link href='/scenario/new'>New Scenario</Link>
                </Button>
                <Button variant='outline' asChild>
                    <Link href='/compare'>Compare</Link>
                </Button>
            </div>
        </main>
    );
};

export default Page;

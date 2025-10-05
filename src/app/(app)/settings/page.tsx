import SettingsForm from '@/components/settings-form';

const Page = () => {
    return (
        <main className='mx-auto max-w-screen-md px-4 py-6'>
            <h1 className='mb-2 text-2xl font-semibold'>Settings</h1>
            <p className='text-muted-foreground text-sm'>Your preferences influence recommendations.</p>
            <div className='mt-4'>
                <SettingsForm />
            </div>
        </main>
    );
};

export default Page;

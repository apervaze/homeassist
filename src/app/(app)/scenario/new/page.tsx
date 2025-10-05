import ScenarioForm from '@/components/scenario-form';

const Page = () => {
    return (
        <main className='mx-auto max-w-screen-md px-4 py-6'>
            <h1 className='mb-4 text-2xl font-semibold'>New Scenario</h1>
            <ScenarioForm />
        </main>
    );
};

export default Page;

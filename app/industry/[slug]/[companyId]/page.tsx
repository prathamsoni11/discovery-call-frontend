import { Companies } from '@/components/shared/companies';
import { getCallsByCompanyId } from '@/lib/actions/companies';
import React from 'react'

const page = async ({
    params,
}: {
    params: Promise<{ slug: string; companyId: string }>;
}) => {

    const { companyId, slug } = await params;

    const calls = await getCallsByCompanyId({ companyId });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <h2 className="text-3xl font-bold mb-8">Discovery Call</h2>
            <Companies initCalls={calls} />
        </div>
    )
}

export default page
import { CallDetails } from '@/components/shared/call_details';
import { getCallById } from '@/lib/actions/calls';
import React from 'react'

const page = async ({
    params,
}: {
    params: Promise<{ callId: string }>;
}) => {
    const { callId } = await params;

    const call = await getCallById({ callId });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <h2 className="text-3xl font-bold mb-8">Call Details</h2>
            <CallDetails initCall={call} />
        </div>
    )
}

export default page
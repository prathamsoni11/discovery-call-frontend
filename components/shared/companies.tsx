'use client';

import { Calls } from '@/types/calls'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

import { Badge } from '../ui/badge';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';


export const Companies = ({ initCalls }: { initCalls: Calls[] }) => {
    const [calls, setCalls] = useState<Calls[]>(initCalls);

    return (
        <>
            {calls.map((call, i) => (
                <Link key={i} href={`${call.companyId}/calls/${call.id}`}>
                    <Card key={i} className='hover:shadow-lg transition-shadow cursor-pointer mb-4'>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-2 items-center'>
                                    <CardTitle>
                                        {call.companyName}
                                    </CardTitle>
                                    <Badge variant={'destructive'}>{call.stage}</Badge>
                                </div>
                                <ArrowUpRight className='text-muted-foreground' />
                            </div>
                            <CardDescription>{new Date(call.createdAt).toLocaleDateString("en-US")}</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <span className='font-bold'>Client Rep:</span> {call.clientRepresentative.name} - {call.clientRepresentative.title}
                                </div>
                                <div>
                                    <span className='font-bold'>Consultadd Rep:</span> {call.consultAddRepresentative}
                                </div>
                                <div>
                                    <span className='font-bold'>Department:</span> {call.clientRepresentative.department}
                                </div>
                            </div>
                            <p className='text-muted-foreground'>{call.callSummary}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </>
    )
}

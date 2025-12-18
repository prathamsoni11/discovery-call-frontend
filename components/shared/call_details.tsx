'use client';

import { CallDetailsInterface } from '@/types/calls'
import { use, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '../ui/badge';


export const CallDetails = ({ initCall }: { initCall: CallDetailsInterface }) => {
    const [call, setCall] = useState<CallDetailsInterface>(initCall);

    const router = useRouter();

    console.log(call);

    return (
        <div className='space-y-4 '>
            <Card>
                <CardHeader >
                    <div className='flex justify-between'>
                        <CardTitle className='text-2xl'>
                            {call.companyName}
                        </CardTitle>
                        <div className='flex flex-col gap-2'>
                            <Badge variant={'outline'}>{new Date(call.createdAt).toLocaleDateString("en-US")}</Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(call.notesLink, "_blank", "noopener,noreferrer")}
                            >
                                View Recording
                            </Button>
                        </div>
                    </div>
                    <CardDescription>
                        <span className='font-bold'>Client:</span> {call.clientRepresentative.name} - {call.clientRepresentative.title} <br />
                        <span className='font-bold'>Consultadd Rep:</span> {call.consultAddRepresentative} <br />
                        <span className='font-bold'>Stage:</span> {call.stage} <br />
                    </CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue='overview' className="w-full ">
                <TabsList className="w-full">
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='problems'>Problems</TabsTrigger>
                    <TabsTrigger value='solutions'>Solutions</TabsTrigger>
                    <TabsTrigger value='analysis'>Analysis</TabsTrigger>
                    <TabsTrigger value='takeaways'>Takeaways</TabsTrigger>
                </TabsList>

                <TabsContent value='overview' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Call Summary
                            </CardTitle>
                            <CardDescription>
                                {call.callSummary}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Competitors Mentioned
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-x-2'>
                            {call.competitorsMentioned.map((competitor, i) => (
                                <div key={i} className='bg-secondary/90 flex items-start gap-4 p-4 rounded-2xl'>
                                    <Badge variant={'outline'}>{competitor.sentiment}</Badge>
                                    <div> <h2 className="text-lg font-bold">{competitor.competitorName}</h2>
                                        <p className='text-sm text-muted-foreground'>{competitor.context}</p></div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='problems'>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Client Problems & Pain Points
                            </CardTitle>
                            <CardDescription>
                                All challenges and pain points mentioned by the client during the call.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            {call.clientProblems.map((problem, i) => (
                                <div key={i} className='border border-secondary/90 flex flex-wrap items-start gap-4 p-4 rounded-2xl'>
                                    <Badge variant={'destructive'}>{problem.tag}</Badge>
                                    <Badge variant={'secondary'}>{problem.category}</Badge>
                                    <Badge variant={'outline'}>{problem.industryContext}</Badge>
                                    <p className='text-sm'>{problem.problemStatement}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

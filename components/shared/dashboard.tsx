'use client'
import React, { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

interface Industry {
    code: string;
    name: string;
    description: string;
    icon: any;
}

export const Dashboard = ({ initIndustries }: { initIndustries: Industry[] }) => {

    const [industries, setIndustries] = useState<Industry[]>(initIndustries);
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <h2 className="text-3xl font-bold mb-8">Select an Industry</h2>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industries.map((industry, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="w-16 h-16 rounded-full mb-2" />
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : industries && industries.length === 0 ? (
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        No industries found. Please check your API connection.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industries.map((industry) => {
                        return (
                            <Link
                                key={industry.code}
                                href={`/`}
                            >
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader>
                                        {/* <div
                                            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2`}
                                        >
                                            {industry.icon}
                                        </div> */}
                                        
                                        <CardTitle className="text-xl">{industry.name}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

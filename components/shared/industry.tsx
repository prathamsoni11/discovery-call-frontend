"use client";

import React, { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Company {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  subIndustry: string;
  createdAt: string;
}

export const Industry = ({ initCompanies }: { initCompanies: Company[] }) => {
  const [companies, setCompanies] = useState<Company[]>(initCompanies);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h2 className="text-3xl font-bold mb-8">Select an Industry</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((industry, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="w-16 h-16 rounded-full mb-2" />
                <Skeleton className="h-6 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : companies && companies.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No industries found. Please check your API connection.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Insights</TabsTrigger>
            <TabsTrigger value="password">Companies</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Insights</TabsContent>
          <TabsContent value="password" className="mt-8 grid gap-8">
            {companies.map((company) => {
              return (
                <Link key={company.id} href={`/`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      {company.companyName}
                      <CardTitle className="text-xl">
                        {company.domain}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </TabsContent>
        </Tabs>
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //   {companies.map((company) => {
        //     return (
        //       <Link key={company.id} href={`/`}>
        //         <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        //           <CardHeader>

        //             {company.companyName}
        //             <CardTitle className="text-xl">{company.domain}</CardTitle>
        //           </CardHeader>
        //         </Card>
        //       </Link>
        //     );
        //   })}
        // </div>
      )}
    </div>
  );
};

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/badge";


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

  return (
    <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h2 className="text-3xl font-bold mb-8">Company</h2>

      {companies && companies.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No industries found. Please check your API connection.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="account">Insights</TabsTrigger>
            <TabsTrigger value="password">Companies</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Insights</TabsContent>

          <TabsContent value="password" className="w-full grid grid-cols-1 gap-4 mt-2">
            {companies.map((company) => {
              return (
                <Link key={company.id} href={`/industry/${company.industry}/${company.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader >
                      <div className="flex justify-between">
                        <CardTitle>
                          {company.companyName}
                        </CardTitle>
                        <ArrowUpRight className="text-muted-foreground" />
                      </div>
                      <CardDescription>
                        {company.domain}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-x-2">
                      <Badge>{company.industry}</Badge>
                      <Badge variant={'secondary'}>{company.subIndustry}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </TabsContent>
        </Tabs>

      )
      }
    </div >
  );
};

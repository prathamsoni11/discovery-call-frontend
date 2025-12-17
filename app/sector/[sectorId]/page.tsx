"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Company } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/navbar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell } from "recharts";

function generateAnalytics(companies: Company[]) {
  const subcategories = companies.reduce((acc, company) => {
    const subIndustry = company.subIndustry || company.companyClassification?.subIndustry || "Unknown";
    acc[subIndustry] = (acc[subIndustry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    subcategories: Object.entries(subcategories).map(([name, count]) => ({
      name,
      value: Math.round((count / companies.length) * 100),
      companies: count
    })),
    commonProblems: [] // No problem data available in new API structure
  };
}

export default function SectorPage() {
  const router = useRouter();
  const params = useParams();
  const sectorId = params.sectorId as string;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      router.push("/login");
      return;
    }

    const loadCompanies = async () => {
      const { fetchCompaniesAction } = await import("@/lib/actions");
      const result = await fetchCompaniesAction(sectorId);
      
      if (result.success) {
        setCompanies(result.data);
      } else {
        console.error("Failed to fetch companies:", result.error);
        setCompanies([]);
      }
      
      setLoading(false);
    };

    loadCompanies();
  }, [router, sectorId]);

  const analytics = generateAnalytics(companies);
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar title={`${sectorId.charAt(0).toUpperCase() + sectorId.slice(1)} Sector`} showBack />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4">
              {Array.from({ length: 3 }, (_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar title={`${sectorId.charAt(0).toUpperCase() + sectorId.slice(1)} Sector`} showBack />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{sectorId.replace(/_/g, " ")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold capitalize">{sectorId}</h2>
          <Badge variant="secondary">{companies.length} Companies</Badge>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="companies">Companies ({companies.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {companies.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Subcategory Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ChartContainer config={{ value: { label: "Companies" } }}>
                      <PieChart>
                        <Pie
                          data={analytics.subcategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${entry.value}%`}
                        >
                          {analytics.subcategories.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No Analytics Available</EmptyTitle>
                  <EmptyDescription>No companies found in this sector to generate analytics.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="companies">
            {companies.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No Companies Found</EmptyTitle>
                  <EmptyDescription>No companies found in this sector.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid gap-4">
                {companies.map((company) => (
                  <Link key={company.id} href={`/company/${company.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-3">{company.companyName}</CardTitle>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                              <div><span className="font-medium">Domain:</span> {company.domain}</div>
                              <div><span className="font-medium">Industry:</span> {company.industry}</div>
                              <div><span className="font-medium">Sub-Industry:</span> {company.subIndustry}</div>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              Created: {new Date(company.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span className="text-2xl text-muted-foreground">→</span>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
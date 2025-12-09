"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

interface SectorAnalytics {
  subcategories: Array<{ name: string; value: number; companies: number }>;
  commonProblems: Array<{ problem: string; count: number; severity: string }>;
  uniqueProblems: Array<{ company: string; problem: string }>;
}

// TODO: Replace with actual API call - Mock analytics data for demonstration
const sectorAnalytics: Record<string, SectorAnalytics> = {
  healthcare: {
    subcategories: [
      { name: "Hospital Management", value: 35, companies: 3 },
      { name: "Telemedicine", value: 25, companies: 2 },
      { name: "Medical Devices", value: 20, companies: 2 },
      { name: "Health Insurance", value: 20, companies: 2 },
    ],
    commonProblems: [
      {
        problem: "Patient data management across systems",
        count: 8,
        severity: "High",
      },
      {
        problem: "Appointment scheduling conflicts",
        count: 6,
        severity: "High",
      },
      {
        problem: "Compliance with HIPAA regulations",
        count: 5,
        severity: "Medium",
      },
      {
        problem: "Integration with legacy EHR systems",
        count: 4,
        severity: "High",
      },
    ],
    uniqueProblems: [
      {
        company: "MediCare Solutions",
        problem: "Real-time bed availability tracking",
      },
      {
        company: "HealthTech Inc",
        problem: "Remote patient monitoring alerts",
      },
      {
        company: "WellnessHub",
        problem: "Wellness program engagement tracking",
      },
    ],
  },
  finance: {
    subcategories: [
      { name: "Payment Processing", value: 40, companies: 4 },
      { name: "Investment Management", value: 30, companies: 3 },
      { name: "Banking Software", value: 20, companies: 2 },
      { name: "Financial Analytics", value: 10, companies: 1 },
    ],
    commonProblems: [
      { problem: "Fraud detection and prevention", count: 7, severity: "High" },
      {
        problem: "Real-time transaction processing",
        count: 6,
        severity: "High",
      },
      {
        problem: "Regulatory compliance reporting",
        count: 5,
        severity: "Medium",
      },
      { problem: "Data security and encryption", count: 8, severity: "High" },
    ],
    uniqueProblems: [
      { company: "FinanceFlow", problem: "Multi-currency settlement delays" },
      { company: "PaymentPro", problem: "Chargeback management automation" },
      { company: "InvestSmart", problem: "Portfolio rebalancing algorithms" },
    ],
  },
  technology: {
    subcategories: [
      { name: "Cloud Infrastructure", value: 45, companies: 5 },
      { name: "Data Analytics", value: 30, companies: 3 },
      { name: "Cybersecurity", value: 15, companies: 2 },
      { name: "DevOps Tools", value: 10, companies: 1 },
    ],
    commonProblems: [
      { problem: "Scalability during peak loads", count: 9, severity: "High" },
      {
        problem: "API rate limiting and throttling",
        count: 6,
        severity: "Medium",
      },
      {
        problem: "Multi-cloud deployment complexity",
        count: 5,
        severity: "High",
      },
      {
        problem: "Cost optimization for cloud resources",
        count: 7,
        severity: "Medium",
      },
    ],
    uniqueProblems: [
      { company: "CloudSystems", problem: "Kubernetes cluster auto-scaling" },
      {
        company: "DataDrive",
        problem: "Real-time data pipeline orchestration",
      },
    ],
  },
  retail: {
    subcategories: [
      { name: "E-commerce Platforms", value: 50, companies: 5 },
      { name: "Inventory Management", value: 30, companies: 3 },
      { name: "POS Systems", value: 15, companies: 2 },
      { name: "Customer Analytics", value: 5, companies: 1 },
    ],
    commonProblems: [
      {
        problem: "Inventory synchronization across channels",
        count: 8,
        severity: "High",
      },
      { problem: "Cart abandonment rates", count: 6, severity: "Medium" },
      {
        problem: "Returns and refunds processing",
        count: 5,
        severity: "Medium",
      },
      {
        problem: "Personalized product recommendations",
        count: 4,
        severity: "Low",
      },
    ],
    uniqueProblems: [
      { company: "ShopEasy", problem: "Dynamic pricing optimization" },
      { company: "RetailHub", problem: "Store pickup coordination" },
    ],
  },
  manufacturing: {
    subcategories: [
      { name: "Supply Chain", value: 40, companies: 4 },
      { name: "Quality Control", value: 30, companies: 3 },
      { name: "Production Planning", value: 20, companies: 2 },
      { name: "Equipment Maintenance", value: 10, companies: 1 },
    ],
    commonProblems: [
      {
        problem: "Supply chain visibility and tracking",
        count: 9,
        severity: "High",
      },
      {
        problem: "Predictive maintenance scheduling",
        count: 7,
        severity: "High",
      },
      { problem: "Quality assurance automation", count: 6, severity: "Medium" },
      { problem: "Production line optimization", count: 5, severity: "Medium" },
    ],
    uniqueProblems: [
      { company: "AutoParts Co", problem: "Just-in-time inventory management" },
      { company: "BuildTech", problem: "3D printing workflow integration" },
    ],
  },
  education: {
    subcategories: [
      { name: "Learning Management", value: 45, companies: 5 },
      { name: "Student Information Systems", value: 30, companies: 3 },
      { name: "Online Assessment", value: 15, companies: 2 },
      { name: "Virtual Classrooms", value: 10, companies: 1 },
    ],
    commonProblems: [
      { problem: "Student engagement tracking", count: 7, severity: "Medium" },
      { problem: "Content delivery at scale", count: 6, severity: "High" },
      {
        problem: "Assessment plagiarism detection",
        count: 5,
        severity: "Medium",
      },
      {
        problem: "Integration with existing systems",
        count: 8,
        severity: "High",
      },
    ],
    uniqueProblems: [
      { company: "LearnOnline", problem: "Adaptive learning path generation" },
      { company: "EduTech Platform", problem: "Peer collaboration tools" },
    ],
  },
};

export default function SectorPage() {
  const router = useRouter();
  const params = useParams();
  const sectorId = params.sectorId as string;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const analytics = sectorAnalytics[sectorId];
  const [activeView, setActiveView] = useState<"companies" | "analytics">(
    "analytics"
  );

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/");
      return;
    }

    // Fetch companies from API
    async function loadCompanies() {
      setLoading(true);
      const { fetchCompanies } = await import("@/lib/api");
      const data = await fetchCompanies(sectorId);
      setCompanies(data);
      setLoading(false);
    }

    loadCompanies();
  }, [router, sectorId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      <Navbar
        title={`${sectorId.charAt(0).toUpperCase() + sectorId.slice(1)} Sector`}
        showBack
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {sectorId.replace(/_/g, " ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold capitalize">{sectorId}</h2>
          <Badge variant="secondary" className="text-sm">
            {companies.length}{" "}
            {companies.length === 1 ? "Company" : "Companies"}
          </Badge>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeView === "analytics" ? "default" : "outline"}
            onClick={() => setActiveView("analytics")}
            size="sm"
          >
            Analytics & Insights
          </Button>
          <Button
            variant={activeView === "companies" ? "default" : "outline"}
            onClick={() => setActiveView("companies")}
            size="sm"
          >
            Companies List
          </Button>
        </div>

        {activeView === "analytics" && analytics && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subcategory Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Companies",
                        },
                      }}
                    >
                      <PieChart>
                        <Pie
                          data={analytics.subcategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) =>
                            `${entry.name}: ${(
                              (entry.percent || 0) * 100
                            ).toFixed(0)}%`
                          }
                          outerRadius={80}
                          dataKey="value"
                        >
                          {analytics.subcategories.map(
                            (entry, index: number) => {
                              const colors = [
                                "#3b82f6",
                                "#8b5cf6",
                                "#ec4899",
                                "#f59e0b",
                                "#10b981",
                              ];
                              return (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={colors[index % colors.length]}
                                />
                              );
                            }
                          )}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {analytics.subcategories.map((sub, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: [
                                "#3b82f6",
                                "#8b5cf6",
                                "#ec4899",
                                "#f59e0b",
                                "#10b981",
                              ][idx % 5],
                            }}
                          />
                          <span>{sub.name}</span>
                        </div>
                        <Badge variant="outline">
                          {sub.companies} companies
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Problem Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ChartContainer
                      config={{
                        count: {
                          label: "Problems",
                        },
                      }}
                    >
                      <PieChart>
                        <Pie
                          data={analytics.commonProblems}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.value}`}
                          outerRadius={80}
                          dataKey="count"
                        >
                          {analytics.commonProblems.map(
                            (entry, index: number) => {
                              const colors = [
                                "#3b82f6",
                                "#8b5cf6",
                                "#ec4899",
                                "#f59e0b",
                                "#10b981",
                              ];
                              return (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={colors[index % colors.length]}
                                />
                              );
                            }
                          )}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Common Problems Across Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.commonProblems.map((problem, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{problem.problem}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Reported by {problem.count} companies
                        </p>
                      </div>
                      <Badge
                        variant={
                          problem.severity === "High"
                            ? "destructive"
                            : problem.severity === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {problem.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unique Problems by Company</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.uniqueProblems.map((item, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Badge variant="outline">{item.company}</Badge>
                        <p className="text-sm flex-1">{item.problem}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "companies" && (
          <div>
            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="space-y-3">
                        <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : companies.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No companies found in this sector.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {companies.map((company) => (
                  <Link
                    key={company.id}
                    href={`/company/${encodeURIComponent(company.companyName)}`}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-3">
                              {company.companyName}
                            </CardTitle>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Domain:</span>{" "}
                                {company.companyClassification.domain}
                              </div>
                              <div>
                                <span className="font-medium">Stage:</span>{" "}
                                {company.stage}
                              </div>
                              <div>
                                <span className="font-medium">Industry:</span>{" "}
                                {company.companyClassification.subIndustry}
                              </div>
                            </div>
                          </div>
                          <span className="text-2xl text-muted-foreground">
                            →
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

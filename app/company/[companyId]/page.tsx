"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Company } from "@/types";
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

export default function CompanyPage() {
  const router = useRouter();
  const params = useParams();
  const companyName = decodeURIComponent(params.companyId as string);
  const [calls, setCalls] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [industryCode, setIndustryCode] = useState<string>("");

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/");
      return;
    }

    // Fetch all calls and filter by company name
    async function loadCalls() {
      setLoading(true);
      const { fetchAllCalls } = await import("@/lib/api");
      const allCalls = await fetchAllCalls();

      // Filter calls by company name (case-insensitive)
      const companyCalls = allCalls.filter(
        (call: Company) =>
          call.companyName.toLowerCase() === companyName.toLowerCase()
      );

      // Get industry code from first call for breadcrumb
      if (companyCalls.length > 0) {
        setIndustryCode(
          companyCalls[0].companyClassification.industry.toLowerCase()
        );
      }

      setCalls(companyCalls);
      setLoading(false);
    }

    loadCalls();
  }, [router, companyName]);

  const getStatusVariant = (
    stage: string
  ): "default" | "secondary" | "destructive" => {
    if (stage.includes("Qualified")) return "default";
    if (stage.includes("Demo")) return "secondary";
    return "default";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      <Navbar title={companyName} showBack />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {industryCode && (
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/sector/${industryCode}`}
                  className="capitalize"
                >
                  {industryCode.replace(/_/g, " ")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{companyName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Call History</h2>
          <Badge variant="secondary" className="text-sm">
            {calls.length} {calls.length === 1 ? "Call" : "Calls"}
          </Badge>
        </div>

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
        ) : calls.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No calls found for this company.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {calls.map((call) => (
              <Link key={call.id} href={`/call/${call.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">
                            Discovery Call
                          </CardTitle>
                          <Badge variant={getStatusVariant(call.stage)}>
                            {call.stage}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(call.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-2xl text-muted-foreground">→</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Client Rep:
                          </span>{" "}
                          {call.clientRepresentative.name}
                          {call.clientRepresentative.title &&
                            ` - ${call.clientRepresentative.title}`}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Industry:
                          </span>{" "}
                          {call.companyClassification.subIndustry}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            ConsultAdd Rep:
                          </span>{" "}
                          {call.consultAddRepresentative}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Problems:
                          </span>{" "}
                          {call.clientProblems.length}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {call.callSummary}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

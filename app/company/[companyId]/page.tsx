"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Call } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/navbar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCompanyCallsAction } from "@/lib/actions";

export default function CompanyPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.companyId as string;
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      router.push("/login");
      return;
    }

    const loadCalls = async () => {
      try {
        console.log("Loading calls for company:", companyId);
        const result = await fetchCompanyCallsAction(companyId);
        
        console.log("Company calls API result:", result);
        
        if (result.success && result.data) {
          const callsData = Array.isArray(result.data) ? result.data : [];
          console.log("Setting calls data:", callsData.length, "calls");
          setCalls(callsData);
          
          // Set company name from first call if available
          if (callsData.length > 0) {
            setCompanyName(callsData[0].companyName);
          }
        } else {
          console.error("Failed to fetch calls:", result.error);
          setCalls([]);
        }
      } catch (error) {
        console.error("Error in loadCalls:", error);
        setCalls([]);
      }
      
      setLoading(false);
    };

    loadCalls();
  }, [router, companyId]);

  const getStatusVariant = (stage: string): "default" | "secondary" | "destructive" => {
    if (stage.includes("Qualified")) return "default";
    if (stage.includes("Demo")) return "secondary";
    if (stage.includes("Closed")) return "destructive";
    return "default";
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar title="Loading..." showBack />
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
      <Navbar title={companyName || "Company Details"} showBack />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{companyName || "Company"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Call History</h2>
          <Badge variant="secondary" className="text-sm">
            {calls.length} {calls.length === 1 ? "Call" : "Calls"}
          </Badge>
        </div>

        {calls.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No Calls Found</EmptyTitle>
              <EmptyDescription>No calls found for this company.</EmptyDescription>
            </EmptyHeader>
          </Empty>
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
                            Department:
                          </span>{" "}
                          {call.clientRepresentative.department || "N/A"}
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
                          {call.clientProblems?.length || 0}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {call.callSummary}
                      </p>
                    </div>
                    {call.notesLink && (
                      <div className="mt-3">
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer p-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(call.notesLink, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          View Call Recording
                        </button>
                      </div>
                    )}
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
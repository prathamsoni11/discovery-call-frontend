"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CallTranscriptPage() {
  const router = useRouter();
  const params = useParams();
  const callId = params.callId as string;
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "problems" | "solutions" | "analysis" | "takeaways"
  >("overview");

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/");
      return;
    }

    // Fetch call transcript from API
    async function loadTranscript() {
      setLoading(true);
      const { fetchCallTranscript } = await import("@/lib/api");
      const data = await fetchCallTranscript(callId);
      setTranscript(data);
      setLoading(false);
    }

    loadTranscript();
  }, [router, callId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
        <Navbar title="Loading..." showBack />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="space-y-4">
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
        </main>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden flex items-center justify-center">
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground">Call transcript not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      <Navbar title="Call Transcript Analysis" showBack />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/sector/${transcript.companyClassification.industry.toLowerCase()}`}
                className="capitalize"
              >
                {transcript.companyClassification.industry
                  .toLowerCase()
                  .replace(/_/g, " ")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/company/${encodeURIComponent(transcript.companyName)}`}
              >
                {transcript.companyName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Call Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {transcript.companyName}
                </CardTitle>
                <CardDescription className="text-base space-y-1">
                  <div>
                    <span className="font-medium">Client:</span>{" "}
                    {transcript.clientRepresentative.name}
                    {transcript.clientRepresentative.title &&
                      ` (${transcript.clientRepresentative.title})`}
                  </div>
                  <div>
                    <span className="font-medium">Consultadd Rep:</span>{" "}
                    {transcript.consultAddRepresentative}
                  </div>
                  <div>
                    <span className="font-medium">Stage:</span>{" "}
                    {transcript.stage}
                  </div>
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="text-sm">
                  {new Date(transcript.createdAt).toLocaleDateString()}
                </Badge>
                {transcript.notesLink && (
                  <a
                    href={transcript.notesLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      View Recording
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            size="sm"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "problems" ? "default" : "outline"}
            onClick={() => setActiveTab("problems")}
            size="sm"
          >
            Problems ({transcript.clientProblems?.length || 0})
          </Button>
          <Button
            variant={activeTab === "solutions" ? "default" : "outline"}
            onClick={() => setActiveTab("solutions")}
            size="sm"
          >
            Solutions ({transcript.solutionsPitched?.length || 0})
          </Button>
          <Button
            variant={activeTab === "analysis" ? "default" : "outline"}
            onClick={() => setActiveTab("analysis")}
            size="sm"
          >
            Summary Table
          </Button>
          <Button
            variant={activeTab === "takeaways" ? "default" : "outline"}
            onClick={() => setActiveTab("takeaways")}
            size="sm"
          >
            Takeaways
          </Button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {transcript.callSummary}
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Top Problems ({transcript.clientProblems?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transcript.clientProblems
                      ?.slice(0, 3)
                      .map((problem: any, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <Badge
                            variant={
                              problem.tag === "Immediate Problem"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {problem.tag}
                          </Badge>
                          <p className="text-sm flex-1">
                            {problem.problemStatement.substring(0, 100)}...
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {transcript.solutionsPitched && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Solutions Proposed ({transcript.solutionsPitched.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transcript.solutionsPitched
                        .slice(0, 3)
                        .map((solution: any, idx: number) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex gap-2">
                              <Badge>{solution.fitLabel}</Badge>
                            </div>
                            <p className="text-sm">
                              {solution.solutionDescription}
                            </p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {transcript.competitorsMentioned &&
              transcript.competitorsMentioned.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Competitors Mentioned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transcript.competitorsMentioned.map(
                        (competitor: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                          >
                            <Badge variant="outline">
                              {competitor.sentiment}
                            </Badge>
                            <div className="flex-1">
                              <p className="font-medium">
                                {competitor.competitorName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {competitor.context}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        )}

        {activeTab === "problems" && (
          <Card>
            <CardHeader>
              <CardTitle>Client Problems & Pain Points</CardTitle>
              <CardDescription>
                All challenges and issues raised during the call
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transcript.clientProblems?.map((problem: any, idx: number) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Badge
                        variant={
                          problem.tag === "Immediate Problem"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {problem.tag}
                      </Badge>
                      <Badge variant="secondary">{problem.category}</Badge>
                      <Badge variant="outline">{problem.industryContext}</Badge>
                    </div>
                    <p className="text-sm">{problem.problemStatement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "solutions" && transcript.solutionsPitched && (
          <Card>
            <CardHeader>
              <CardTitle>Solutions Pitched</CardTitle>
              <CardDescription>
                Proposed solutions mapped to client problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transcript.solutionsPitched.map(
                  (solution: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-3">
                      <div className="flex gap-2">
                        <Badge>{solution.fitLabel}</Badge>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Solution:</p>
                        <p className="text-sm text-muted-foreground">
                          {solution.solutionDescription}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Addresses Problem:</p>
                        <p className="text-sm text-muted-foreground">
                          {solution.addressedProblem}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "analysis" && transcript.summaryRows && (
          <div className="space-y-4">
            {transcript.summaryRows.map((row: any, idx: number) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">
                      Analysis #{idx + 1}
                    </CardTitle>
                    <Badge
                      variant={
                        row.clientReaction?.toLowerCase().includes("positive")
                          ? "default"
                          : row.clientReaction
                            ?.toLowerCase()
                            .includes("negative")
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {row.clientReaction?.split(" - ")[0] || "Neutral"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-muted-foreground">
                      Problem
                    </h4>
                    <p className="text-sm">{row.problem}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-muted-foreground">
                      Solution Pitched
                    </h4>
                    <p className="text-sm">{row.solutionPitched}</p>
                  </div>

                  {row.clientObjection && row.clientObjection !== "None" && (
                    <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">
                          Client Objection
                        </h4>
                        <p className="text-sm italic">
                          &ldquo;{row.clientObjection}&rdquo;
                        </p>
                      </div>
                      {row.objectionHandling && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">
                            Objection Handling
                          </h4>
                          <p className="text-sm">{row.objectionHandling}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <h4 className="font-semibold text-sm mb-2 text-muted-foreground">
                      Client Reaction Details
                    </h4>
                    <p className="text-sm">{row.clientReaction}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "takeaways" && (
          <div className="space-y-6">
            {transcript.keyTakeaways && transcript.keyTakeaways.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Takeaways</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {transcript.keyTakeaways.map(
                      (takeaway: string, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span className="text-sm text-muted-foreground flex-1">
                            {takeaway}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

            {transcript.followUpActions &&
              transcript.followUpActions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Follow-up Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {transcript.followUpActions.map(
                        (action: string, idx: number) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-primary font-bold">
                              {idx + 1}.
                            </span>
                            <span className="text-sm text-muted-foreground flex-1">
                              {action}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}

            {transcript.solutionDelivered && (
              <Card>
                <CardHeader>
                  <CardTitle>Solution Delivered</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {transcript.solutionDelivered}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

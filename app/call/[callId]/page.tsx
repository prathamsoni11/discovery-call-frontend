"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Call, ClientProblem, SolutionPitched, CompetitorMention, SummaryTableRow } from "@/types";

export default function CallTranscriptPage() {
  const router = useRouter();
  const params = useParams();
  const callId = params.callId as string;
  const [transcript, setTranscript] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      router.push("/login");
      return;
    }

    const loadTranscript = async () => {
      const { fetchCallTranscriptAction } = await import("@/lib/actions");
      const result = await fetchCallTranscriptAction(callId);
      
      if (result.success) {
        setTranscript(result.data);
      } else {
        console.error("Failed to fetch call transcript:", result.error);
        setTranscript(null);
      }
      
      setLoading(false);
    };

    loadTranscript();
  }, [router, callId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar title="Loading..." showBack />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
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
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Call transcript not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar title="Call Transcript Analysis" showBack />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/company/${transcript.companyId}`}
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(transcript.notesLink, '_blank', 'noopener,noreferrer')}
                  >
                    View Recording
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="problems">Problems ({transcript.clientProblems?.length || 0})</TabsTrigger>
            <TabsTrigger value="solutions">Solutions ({transcript.solutionsPitched?.length || 0})</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="takeaways">Takeaways</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                      .map((problem: ClientProblem, idx: number) => (
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
                        .map((solution: SolutionPitched, idx: number) => (
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
                        (competitor: CompetitorMention, idx: number) => (
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
          </TabsContent>

          <TabsContent value="problems">
          <Card>
            <CardHeader>
              <CardTitle>Client Problems & Pain Points</CardTitle>
              <CardDescription>
                All challenges and issues raised during the call
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transcript.clientProblems?.map((problem: ClientProblem, idx: number) => (
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
          </TabsContent>

          <TabsContent value="solutions">
            {transcript.solutionsPitched ? (
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
                  (solution: SolutionPitched, idx: number) => (
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
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No Solutions</EmptyTitle>
                  <EmptyDescription>No solutions were pitched during this call.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="analysis">
            {transcript.summaryRows && transcript.summaryRows.length > 0 ? (
              <div className="space-y-4">
                {transcript.summaryRows.map((row: SummaryTableRow, idx: number) => (
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
                              : row.clientReaction?.toLowerCase().includes("negative")
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {row.clientReaction || "Neutral"}
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

                      {row.clientObjection && row.clientObjection !== null && (
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
                          Client Reaction
                        </h4>
                        <p className="text-sm">{row.clientReaction}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No Analysis</EmptyTitle>
                  <EmptyDescription>No summary analysis available for this call.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>

          <TabsContent value="takeaways" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export interface Industry {
  id: string;
  industryCode: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Company {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  subIndustry: string;
  createdAt: string;
  // Legacy fields for backward compatibility
  stage?: string;
  notesLink?: string;
  companyClassification?: {
    domain: string;
    industry: string;
    subIndustry: string;
  };
  callSummary?: string;
  clientRepresentative?: {
    name: string;
    title: string | null;
    department: string | null;
  };
  consultAddRepresentative?: string;
  clientProblems?: ClientProblem[];
  solutionsPitched?: SolutionPitched[];
  competitorsMentioned?: CompetitorMention[];
}

export interface Call {
  id: string;
  companyName: string;
  stage: string;
  notesLink: string;
  createdAt: string;
  companyId: string;
  callSummary: string;
  clientRepresentative: {
    name: string;
    title: string | null;
    department: string | null;
  };
  consultAddRepresentative: string;
  clientProblems: ClientProblem[];
  solutionsPitched?: SolutionPitched[];
  competitorsMentioned?: CompetitorMention[];
  summaryRows?: SummaryTableRow[];
  solutionDelivered?: string | null;
  keyTakeaways?: string[];
  followUpActions?: string[];
  // Legacy field for backward compatibility
  companyClassification?: {
    domain: string;
    industry: string;
    subIndustry: string;
  };
}



export interface ClientProblem {
  problemStatement: string;
  tag: "Immediate Problem" | "Long-Term Problem";
  category: string;
  industryContext: string;
}

export interface SolutionPitched {
  solutionDescription: string;
  addressedProblem: string;
  fitLabel: "Immediate Fit" | "Future Fit";
}

export interface CompetitorMention {
  competitorName: string;
  context: string;
  sentiment: "Positive" | "Neutral" | "Negative";
}

export interface SummaryTableRow {
  problem: string;
  solutionPitched: string;
  clientObjection: string;
  objectionHandling: string;
  clientReaction: string;
}

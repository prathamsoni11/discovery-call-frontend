export interface Industry {
  id: string;
  industryCode: string;
  name: string;
}

export interface Company {
  id: string;
  companyName: string;
  stage: string;
  notesLink: string;
  createdAt: string;
  companyClassification: {
    domain: string;
    industry: string;
    subIndustry: string;
  };
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
}

export interface Call {
  id: string;
  companyName: string;
  stage: string;
  notesLink: string;
  createdAt: string;
  companyClassification: {
    domain: string;
    industry: string;
    subIndustry: string;
  };
  callSummary: string;
}

export interface CallTranscript {
  company_name: string;
  stage: string;
  notes_link?: string;
  processed_at: string;
  source: string;
  transcript_length: number;
  call_summary: string;
  client_representative: {
    name: string;
    title: string;
    department: string;
  };
  consultadd_representative: string;
  client_problems: ClientProblem[];
  solutions_pitched: SolutionPitched[];
  competitors_mentioned: CompetitorMention[];
  summary_table: SummaryTableRow[];
  solution_delivered?: string;
  key_takeaways: string[];
  follow_up_actions: string[];
  status: string;
}

export interface ClientProblem {
  problemStatement: string;
  tag: "Immediate Problem" | "Long-Term Problem";
  category: string;
  industryContext: string;
}

export interface SolutionPitched {
  solution_description: string;
  addresses_problem: string;
  fit_label: "Immediate Fit" | "Future Fit";
}

export interface CompetitorMention {
  name: string;
  context: string;
  sentiment: "Positive" | "Neutral" | "Negative";
}

export interface SummaryTableRow {
  problem_categorized: string;
  solution_pitched: string;
  client_objection: string;
  objection_handling: string;
  client_reaction: string;
}

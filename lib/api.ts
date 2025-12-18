const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://discovery-call-backend.onrender.com/api";

const FALLBACK_INDUSTRIES = [
  { id: "1", name: "Technology & Software", industryCode: "TECHNOLOGY_SOFTWARE" },
  { id: "2", name: "Healthcare", industryCode: "HEALTHCARE" },
  { id: "3", name: "Financial Services", industryCode: "FINANCIAL_SERVICES" },
  { id: "4", name: "Manufacturing", industryCode: "MANUFACTURING" },
  { id: "5", name: "Retail & E-commerce", industryCode: "RETAIL_ECOMMERCE" },
  { id: "6", name: "Education", industryCode: "EDUCATION" },
];

// Client-side API fetch (for non-authenticated calls or when token is passed)
async function apiFetch<T>(endpoint: string, token?: string, options?: RequestInit): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Authorization header if token is provided
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}





export async function fetchIndustries() {
  const data = await apiFetch<unknown[]>("/industries");
  return data?.length ? data : FALLBACK_INDUSTRIES;
}

export async function fetchCompanies(industryCode: string) {
  return await apiFetch<unknown[]>(`/calls/industry/${industryCode.toLowerCase()}`) || [];
}

export async function fetchAllCalls() {
  return await apiFetch<unknown[]>("/calls") || [];
}

export async function fetchCallTranscript(callId: string) {
  return await apiFetch<unknown>(`/calls/${callId}`);
}

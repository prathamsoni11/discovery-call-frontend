// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://discovery-call-backend-latest-1.onrender.com/api";

// Fallback data for industries when API is unavailable
const FALLBACK_INDUSTRIES = [
  {
    id: "1",
    name: "Technology & Software",
    industryCode: "TECHNOLOGY_SOFTWARE",
  },
  { id: "2", name: "Healthcare", industryCode: "HEALTHCARE" },
  { id: "3", name: "Financial Services", industryCode: "FINANCIAL_SERVICES" },
  { id: "4", name: "Manufacturing", industryCode: "MANUFACTURING" },
  { id: "5", name: "Retail & E-commerce", industryCode: "RETAIL_ECOMMERCE" },
  { id: "6", name: "Education", industryCode: "EDUCATION" },
];

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Success: ${endpoint}`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fetch all industries
 * @returns Array of industries or fallback data
 */
export async function fetchIndustries() {
  const data = await apiFetch<any[]>("/industries");

  if (!data || data.length === 0) {
    console.log("Using fallback industries data");
    return FALLBACK_INDUSTRIES;
  }

  return data;
}

/**
 * Fetch companies/calls by industry code
 * @param industryCode - Industry code (e.g., "technology_software")
 * @returns Array of calls for the specified industry
 */
export async function fetchCompanies(industryCode: string) {
  const data = await apiFetch<any[]>(
    `/calls/industry/${industryCode.toLowerCase()}`
  );
  return data || [];
}

/**
 * Fetch all calls across all industries
 * @returns Array of all calls
 */
export async function fetchAllCalls() {
  const data = await apiFetch<any[]>("/calls");
  return data || [];
}

/**
 * Fetch detailed call information by ID
 * @param callId - Unique call identifier
 * @returns Call details or null if not found
 */
export async function fetchCallTranscript(callId: string) {
  return await apiFetch<any>(`/calls/${callId}`);
}

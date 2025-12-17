"use server";
import { cookies } from "next/headers";

export const clearCookies = async () => {
  const cookieStore = cookies();
  (await cookieStore).delete("token");
  return { message: "Cookies cleared" };
};

export async function loginAction(email: string, password: string) {
  try {
    console.log("Server action: Making login request to backend...");
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Server-side can access Set-Cookie headers
    const setCookieHeader = response.headers.get("set-cookie");
    console.log("Server action: Set-Cookie header:", setCookieHeader);
    
    let token = "";
    if (setCookieHeader) {
      // Extract the actual JWT token
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
      if (tokenMatch) {
        token = tokenMatch[1];
        console.log("Server action: Extracted token:", token.substring(0, 20) + "...");
      }
    }

    if (!token) {
      throw new Error("No token received from server");
    }

    // Store the actual JWT token in our cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
      sameSite: "lax"
    });

    console.log("Server action: Token stored successfully");
    return { success: true, data };
  } catch (error) {
    console.error("Server action: Login error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function checkAuthCookie() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");
  return !!token?.value;
}

async function getAuthToken() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");
  return token?.value || null;
}

export async function fetchIndustriesAction() {
  try {
    const token = await getAuthToken();
    
    console.log("Server action: Token available:", !!token);
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Server action: Making request to:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/industries`);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/industries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("Server action: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server action: API error response:", errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const response_data = await response.json();
    console.log("Server action: Raw API response:", response_data);
    
    // Handle the backend response structure: { timestamp, data: [...], error }
    if (response_data.error) {
      throw new Error(response_data.error);
    }
    
    const industriesArray = response_data.data || [];
    
    if (!Array.isArray(industriesArray)) {
      console.warn("Server action: Industries data is not an array:", industriesArray);
      throw new Error("Invalid response format: industries data is not an array");
    }
    
    // Use the API data directly - transform to match our frontend interface
    const transformedIndustries = industriesArray.map((industry: {
      code: string;
      name: string;
      description: string;
      iconUrl: string;
    }) => ({
      id: industry.code,
      name: industry.name,
      industryCode: industry.code.toUpperCase(),
      description: industry.description,
      icon: industry.iconUrl
    }));
    
    console.log("Server action: Using API industries data:", transformedIndustries);
    
    return { success: true, data: transformedIndustries };
  } catch (error) {
    console.error("Server action: Error fetching industries:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      fallbackData: [
        { id: "technology_software", name: "Technology & Software", industryCode: "TECHNOLOGY_SOFTWARE", icon: "💻" },
        { id: "healthcare_medical", name: "Healthcare & Medical", industryCode: "HEALTHCARE_MEDICAL", icon: "🏥" },
        { id: "financial_services", name: "Financial Services", industryCode: "FINANCIAL_SERVICES", icon: "🏦" },
        { id: "manufacturing_industrial", name: "Manufacturing & Industrial", industryCode: "MANUFACTURING_INDUSTRIAL", icon: "🏭" },
        { id: "retail_ecommerce", name: "Retail & E-commerce", industryCode: "RETAIL_ECOMMERCE", icon: "🛒" },
        { id: "education_training", name: "Education & Training", industryCode: "EDUCATION_TRAINING", icon: "🎓" },
      ]
    };
  }
}

export async function fetchCompaniesAction(industryCode: string) {
  try {
    const token = await getAuthToken();
    
    console.log("Server action: Token available:", !!token);
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Server action: Making request to:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/industries/${industryCode.toLowerCase()}/companies`);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/industries/${industryCode.toLowerCase()}/companies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("Server action: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server action: API error response:", errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const response_data = await response.json();
    console.log("Server action: Raw API response:", response_data);
    
    // Handle the backend response structure: { timestamp, data: [...], error }
    if (response_data.error) {
      throw new Error(response_data.error);
    }
    
    const companiesArray = response_data.data || [];
    
    if (!Array.isArray(companiesArray)) {
      console.warn("Server action: Companies data is not an array:", companiesArray);
      throw new Error("Invalid response format: companies data is not an array");
    }
    
    // Transform API data to match our frontend interface
    const transformedCompanies = companiesArray.map((company: {
      id: string;
      companyName: string;
      domain: string;
      industry: string;
      subIndustry: string;
      createdAt: string;
    }) => ({
      id: company.id,
      companyName: company.companyName,
      domain: company.domain,
      industry: company.industry,
      subIndustry: company.subIndustry,
      createdAt: company.createdAt,
      // Add legacy fields for backward compatibility
      stage: "Active", // Default value
      companyClassification: {
        domain: company.domain,
        industry: company.industry,
        subIndustry: company.subIndustry,
      }
    }));
    
    console.log("Server action: Using API companies data:", transformedCompanies);
    
    return { success: true, data: transformedCompanies };
  } catch (error) {
    console.error("Server action: Error fetching companies:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      data: []
    };
  }
}

export async function fetchAllCallsAction() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/calls`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching calls:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      data: []
    };
  }
}

export async function fetchCompanyCallsAction(companyId: string) {
  try {
    const token = await getAuthToken();
    
    console.log("Server action: Token available:", !!token);
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Server action: Making request to:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${companyId}/calls`);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${companyId}/calls`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("Server action: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server action: API error response:", errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const response_data = await response.json();
    console.log("Server action: Raw API response:", response_data);
    
    // Handle the backend response structure: { timestamp, data: [...], error }
    if (response_data.error) {
      throw new Error(response_data.error);
    }
    
    const callsArray = response_data.data || [];
    
    if (!Array.isArray(callsArray)) {
      console.warn("Server action: Calls data is not an array:", callsArray);
      throw new Error("Invalid response format: calls data is not an array");
    }
    
    console.log("Server action: Using API calls data:", callsArray);
    
    return { success: true, data: callsArray };
  } catch (error) {
    console.error("Server action: Error fetching company calls:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      data: []
    };
  }
}

export async function fetchCallTranscriptAction(callId: string) {
  try {
    const token = await getAuthToken();
    
    console.log("Server action: Token available:", !!token);
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Server action: Making request to:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/calls/${callId}`);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/calls/${callId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("Server action: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server action: API error response:", errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const response_data = await response.json();
    console.log("Server action: Raw API response:", response_data);
    
    // Handle the backend response structure: { timestamp, data: {...}, error }
    if (response_data.error) {
      throw new Error(response_data.error);
    }
    
    const callData = response_data.data;
    
    if (!callData) {
      throw new Error("No call data found in response");
    }
    
    console.log("Server action: Using API call data:", callData);
    
    return { success: true, data: callData };
  } catch (error) {
    console.error("Server action: Error fetching call transcript:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      data: null
    };
  }
}

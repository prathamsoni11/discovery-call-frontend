"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { fetchIndustriesAction } from "@/lib/actions";
import { Industry } from "@/types";

export default function Dashboard() {
  const router = useRouter();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      router.push("/login");
      return;
    }

    const loadIndustries = async () => {
      try {
        console.log("Loading industries from API...");
        const result = await fetchIndustriesAction();
        
        console.log("Industries API result:", result);
        
        if (result.success && result.data) {
          const industriesData = Array.isArray(result.data) ? result.data : [];
          console.log("Setting industries data:", industriesData.length, "items");
          setIndustries(industriesData);
        } else {
          console.error("Failed to fetch industries:", result.error);
          const fallbackData = result.fallbackData || [];
          console.log("Using fallback data:", fallbackData.length, "items");
          setIndustries(fallbackData);
        }
      } catch (error) {
        console.error("Error in loadIndustries:", error);
        setIndustries([]);
      }
      
      setLoading(false);
    };

    loadIndustries();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar title="Organization Dashboard" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8">Select an Industry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="w-16 h-16 rounded-full mb-2" />
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar title="Organization Dashboard" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Select an Industry</h2>
        
        {!Array.isArray(industries) || industries.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No Industries Found</EmptyTitle>
              <EmptyDescription>Please check your API connection and try again.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Link
                key={industry.id}
                href={`/sector/${industry.industryCode.toLowerCase()}`}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center text-3xl mb-2">
                      {industry.icon}
                    </div>
                    <CardTitle className="text-xl">{industry.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
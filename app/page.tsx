import { Dashboard } from "@/components/shared/dashboard";

import { getIndustries } from "@/lib/actions/industry";
export const dynamic = "force-dynamic";


export default async function page() {

  const industries = await getIndustries();

  return (
    <div className="min-h-screen from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      <Dashboard initIndustries={industries} />
    </div>
  );
}

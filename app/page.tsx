import { Dashboard } from "@/components/shared/dashboard";
import { Navbar } from "@/components/shared/navbar";

import { getProfileAction } from "@/lib/actions/auth";
import { getIndustries } from "@/lib/actions/industry";


export default async function page() {

  const data = await getProfileAction()
  const industries = await getIndustries();

  

  return (
    <div className="min-h-screen from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      <Navbar title="Organization Dashboard" data={data} />

      <Dashboard initIndustries={industries} />
    </div>
  );
}

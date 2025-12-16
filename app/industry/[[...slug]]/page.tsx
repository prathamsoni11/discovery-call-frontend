import { Industry } from "@/components/shared/industry";
import { Navbar } from "@/components/shared/navbar";
import { getProfileAction } from "@/lib/actions/auth";
import { getCompanies } from "@/lib/actions/companies";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  const profile = await getProfileAction();

  const industryId = slug?.[0];

  const companies = await getCompanies({
    industryId,
  });

  console.log("Industry ID:", industryId);
  console.log("Companies:", companies);

  return (
    <div className="min-h-screen">
      <Navbar title="Organization Dashboard" data={profile} />

      <Industry initCompanies={companies} />
    </div>
  );
}

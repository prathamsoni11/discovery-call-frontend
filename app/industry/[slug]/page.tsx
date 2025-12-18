import { Industry } from "@/components/shared/industry";

import { getCompanies } from "@/lib/actions/companies";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const { slug } = await params;
  console.log("slug", slug);

  const companies = await getCompanies({ industryId: slug });

  return (
    <div className="min-h-screen">
      <Industry initCompanies={companies} />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubpageHero from "@/components/SubpageHero";
import FacilityDetail from "@/components/FacilityDetail";
import { fetchFacilities, getFacilityById } from "@/data/facilities";

type Params = { id: string };

export async function generateStaticParams(): Promise<Params[]> {
  const facilities = await fetchFacilities();
  return facilities.map((facility) => ({ id: facility.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const facilities = await fetchFacilities();
  const facility = getFacilityById(id, facilities);
  if (!facility) return {};

  return {
    title: facility.name,
    description: facility.description,
    alternates: { canonical: `/facility/${id}` },
  };
}

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const facilities = await fetchFacilities();
  const facility = getFacilityById(id, facilities);

  if (!facility) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: facility.name,
    description: facility.description,
    address: {
      "@type": "PostalAddress",
      addressRegion: facility.prefecture,
      addressLocality: facility.addressDetail,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubpageHero
        title={facility.name}
        path={`/facility/${facility.id}`}
        parent={{ name: "施設を探す", href: "/search" }}
      />
      <FacilityDetail initialFacility={facility} />
    </>
  );
}

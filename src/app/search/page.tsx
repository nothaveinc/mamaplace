import type { Metadata } from "next";
import FacilitySearch from "@/components/FacilitySearch";
import { fetchFacilities } from "@/data/facilities";

export const metadata: Metadata = {
  title: "施設を探す",
  description:
    "宿泊型・通所型・訪問型から、あなたに合った産後ケア施設を探せます。エリアや条件で絞り込み、口コミや料金を比較できます。",
  alternates: { canonical: "/search" },
};

export default async function SearchPage() {
  const facilities = await fetchFacilities();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: facilities.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://mama-place.com/facility/${f.id}`,
      name: f.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <FacilitySearch initialFacilities={facilities} />
    </>
  );
}

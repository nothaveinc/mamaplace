import type { Metadata } from "next";
import { Suspense } from "react";
import FacilitySearch, { type SearchInitialFilters } from "@/components/FacilitySearch";
import SearchFacilityResults from "@/components/SearchFacilityResults";
import { fetchFacilities } from "@/data/facilities";

export const metadata: Metadata = {
  title: "施設を探す",
  description:
    "宿泊型・通所型・訪問型から、あなたに合った産後ケア施設を探せます。エリアや条件で絞り込み、口コミや料金を比較できます。",
  alternates: { canonical: "/search" },
};

const DEFAULT_SEARCH_FILTERS: SearchInitialFilters = {
  residence: "",
  facilityFilter: "all",
  areas: [],
  types: [],
  ageMonth: null,
  showFavorites: false,
  page: 1,
  hasSearchConditions: false,
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
      <Suspense
        fallback={
          <FacilitySearch
            initialFacilities={facilities}
            initialFilters={DEFAULT_SEARCH_FILTERS}
          />
        }
      >
        <SearchFacilityResults initialFacilities={facilities} />
      </Suspense>
    </>
  );
}

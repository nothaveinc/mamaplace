import type { Metadata } from "next";
import { Suspense } from "react";
import FacilitySearch, { type SearchInitialFilters } from "@/components/FacilitySearch";
import SearchFacilityResults from "@/components/SearchFacilityResults";
import { fetchFacilities } from "@/data/facilities";

export const metadata: Metadata = {
  title: "福岡の産後ケア施設一覧",
  description:
    "福岡県内の産後ケア施設を一覧で掲載。福岡市の公費助成対象施設や自費の産後ケアホテルを、宿泊型・日帰り型・訪問型、エリア、対象月齢などから比較・検索できます。",
  alternates: { canonical: "/search/" },
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
    name: "福岡の産後ケア施設一覧",
    numberOfItems: facilities.length,
    itemListElement: facilities.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://mamaplace.jp/facility/${f.id}/`,
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

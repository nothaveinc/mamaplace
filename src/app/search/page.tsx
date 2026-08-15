import type { Metadata } from "next";
import FacilitySearch, {
  type FacilityFilter,
  type Residence,
  type SearchInitialFilters,
} from "@/components/FacilitySearch";
import { AREAS, CARE_TYPE_OPTIONS, HOTEL_RESORT_AREA, fetchFacilities } from "@/data/facilities";
import type { CareType } from "@/data/subsidy";

export const metadata: Metadata = {
  title: "施設を探す",
  description:
    "宿泊型・通所型・訪問型から、あなたに合った産後ケア施設を探せます。エリアや条件で絞り込み、口コミや料金を比較できます。",
  alternates: { canonical: "/search" },
};

type SearchParams = Record<string, string | string[] | undefined>;

function valuesOf(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function getInitialFilters(params: SearchParams): SearchInitialFilters {
  const requestedResidence = valuesOf(params.residence)[0];
  const residence: Residence =
    requestedResidence === "福岡市" || requestedResidence === "福岡市外"
      ? requestedResidence
      : "";

  const requestedFacilityFilter = valuesOf(params.facility)[0];
  const parsedFacilityFilter: FacilityFilter =
    requestedFacilityFilter === "subsidy" || requestedFacilityFilter === "non-subsidy"
      ? requestedFacilityFilter
      : "all";
  const facilityFilter: FacilityFilter =
    parsedFacilityFilter === "subsidy" && residence === ""
      ? "all"
      : parsedFacilityFilter;

  const allowedAreas = new Set<string>([...AREAS, HOTEL_RESORT_AREA]);
  const areas = valuesOf(params.area).filter((area) => allowedAreas.has(area));
  const types = valuesOf(params.type).filter(
    (type): type is CareType => CARE_TYPE_OPTIONS.includes(type as CareType),
  );
  const showFavorites = valuesOf(params.favorites)[0] === "1";
  const requestedPage = Number(valuesOf(params.page)[0]);
  const page = Number.isInteger(requestedPage) && requestedPage > 1 ? requestedPage : 1;

  return {
    residence,
    facilityFilter,
    areas,
    types,
    showFavorites,
    page,
    hasSearchConditions:
      residence !== "" ||
      facilityFilter !== "all" ||
      areas.length > 0 ||
      types.length > 0 ||
      showFavorites,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const initialFilters = getInitialFilters(await searchParams);
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
      <FacilitySearch initialFacilities={facilities} initialFilters={initialFilters} />
    </>
  );
}

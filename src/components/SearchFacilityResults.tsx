"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import FacilitySearch, {
  type FacilityFilter,
  type Residence,
  type SearchInitialFilters,
} from "@/components/FacilitySearch";
import {
  AREAS,
  CARE_TYPE_OPTIONS,
  HOTEL_RESORT_AREA,
  type Facility,
} from "@/data/facilities";
import type { CareType } from "@/data/subsidy";

function getInitialFilters(params: URLSearchParams): SearchInitialFilters {
  const requestedResidence = params.get("residence");
  const residence: Residence =
    requestedResidence === "福岡市" || requestedResidence === "福岡市外"
      ? requestedResidence
      : "";

  const requestedFacilityFilter = params.get("facility");
  const parsedFacilityFilter: FacilityFilter =
    requestedFacilityFilter === "subsidy" || requestedFacilityFilter === "non-subsidy"
      ? requestedFacilityFilter
      : "all";
  const facilityFilter: FacilityFilter =
    parsedFacilityFilter === "subsidy" && residence === ""
      ? "all"
      : parsedFacilityFilter;

  const allowedAreas = new Set<string>([...AREAS, HOTEL_RESORT_AREA]);
  const areas = params.getAll("area").filter((area) => allowedAreas.has(area));
  const types = params.getAll("type").filter(
    (type): type is CareType => CARE_TYPE_OPTIONS.includes(type as CareType),
  );
  const requestedAgeMonth = Number(params.get("age"));
  const ageMonth =
    params.has("age") &&
    Number.isInteger(requestedAgeMonth) &&
    requestedAgeMonth >= 0 &&
    requestedAgeMonth <= 11
      ? requestedAgeMonth
      : null;
  const showFavorites = params.get("favorites") === "1";
  const requestedPage = Number(params.get("page"));
  const page = Number.isInteger(requestedPage) && requestedPage > 1 ? requestedPage : 1;

  return {
    residence,
    facilityFilter,
    areas,
    types,
    ageMonth,
    showFavorites,
    page,
    hasSearchConditions:
      residence !== "" ||
      facilityFilter !== "all" ||
      areas.length > 0 ||
      types.length > 0 ||
      ageMonth !== null ||
      showFavorites,
  };
}

export default function SearchFacilityResults({
  initialFacilities,
}: {
  initialFacilities: Facility[];
}) {
  const searchParams = useSearchParams();
  const initialFilters = useMemo(
    () => getInitialFilters(searchParams),
    [searchParams],
  );

  return (
    <FacilitySearch
      initialFacilities={initialFacilities}
      initialFilters={initialFilters}
    />
  );
}

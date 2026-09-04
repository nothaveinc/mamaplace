"use client";

import Form from "next/form";
import { useState } from "react";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import { AGE_MONTH_OPTIONS, AREAS, CARE_TYPE_OPTIONS } from "@/data/facilities";
import type { CareType } from "@/data/subsidy";

type Residence = "" | "福岡市" | "福岡市外";
type FacilityFilter = "all" | "subsidy" | "non-subsidy";

const CARE_TYPE_LABEL: Record<CareType, string> = {
  宿泊型: "宿泊",
  通所型: "日帰り",
  訪問型: "訪問",
};

const AREA_OPTIONS = AREAS.map((area) => ({
  value: area,
  label: `福岡県 ${area}`,
}));

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function HomeFacilitySearch() {
  const [residence, setResidence] = useState<Residence>("");
  const [facilityFilter, setFacilityFilter] = useState<FacilityFilter>("all");
  const [subsidyFilterError, setSubsidyFilterError] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);
  const [types, setTypes] = useState<CareType[]>([]);
  const [ageMonth, setAgeMonth] = useState("");

  const handleFacilityFilterChange = (value: FacilityFilter) => {
    if (value === "subsidy" && residence === "") {
      setSubsidyFilterError(true);
      return;
    }
    setSubsidyFilterError(false);
    setFacilityFilter(value);
  };

  const clearFilters = () => {
    setAreas([]);
    setTypes([]);
    setAgeMonth("");
  };

  const activeFilterCount = areas.length + types.length + (ageMonth === "" ? 0 : 1);

  return (
    <section id="facility-search" className="home-facility-search" aria-labelledby="home-facility-search-title">
      <div className="container">
        <div className="home-facility-search__card">
          <div className="home-facility-search__heading">
            <div className="numbered-section-heading numbered-section-heading--red">
              <span className="numbered-section-heading__number" aria-hidden="true">01</span>
              <span className="numbered-section-heading__divider" aria-hidden="true" />
              <h2 id="home-facility-search-title">施設を探す</h2>
            </div>
          </div>

          <Form action="/search" className="home-facility-search__form">
            <div className="home-facility-search__top-row">
              <div className="home-facility-search__field">
                <label htmlFor="home-search-residence">居住地選択</label>
                <select
                  id="home-search-residence"
                  name="residence"
                  value={residence}
                  onChange={(event) => {
                    const nextResidence = event.target.value as Residence;
                    setResidence(nextResidence);
                    setSubsidyFilterError(false);
                    if (nextResidence === "" && facilityFilter === "subsidy") {
                      setFacilityFilter("all");
                    }
                  }}
                >
                  <option value="">選択してください</option>
                  <option value="福岡市">福岡市</option>
                  <option value="福岡市外">福岡市外</option>
                </select>
              </div>

              <fieldset className="home-facility-search__group">
                <legend>表示する施設</legend>
                <div className="home-facility-search__choices home-facility-search__choices--facility">
                  {([
                    ["all", "全施設"],
                    ["subsidy", "補助金対象施設"],
                    ["non-subsidy", "補助金対象外施設（ホテル・リゾート）"],
                  ] as const).map(([value, label]) => (
                    <label className="home-facility-search__choice" key={value}>
                      <input
                        type="radio"
                        name="facility"
                        value={value}
                        checked={facilityFilter === value}
                        onChange={() => handleFacilityFilterChange(value)}
                      />
                      <span className="home-facility-search__choice-box home-facility-search__choice-box--radio" aria-hidden="true" />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {subsidyFilterError && (
                  <p className="home-facility-search__error" role="alert">
                    ！居住地を選択してください
                  </p>
                )}
              </fieldset>
            </div>

            <MultiSelectDropdown
              id="home-search-areas"
              label="施設の場所"
              name="area"
              options={AREA_OPTIONS}
              values={areas}
              onToggle={(area) => setAreas((current) => toggleValue(current, area))}
            />

            <fieldset className="home-facility-search__group">
              <legend>ケア種別</legend>
              <div className="home-facility-search__choices home-facility-search__choices--types">
                {CARE_TYPE_OPTIONS.map((type) => (
                  <label className="home-facility-search__choice" key={type}>
                    <input
                      type="checkbox"
                      name="type"
                      value={type}
                      checked={types.includes(type)}
                      onChange={() => setTypes((current) => toggleValue(current, type))}
                    />
                    <span className="home-facility-search__choice-box" aria-hidden="true" />
                    <span>{CARE_TYPE_LABEL[type]}</span>
                    <span className={`home-facility-search__choice-dot home-facility-search__choice-dot--${type}`} aria-hidden="true" />
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="home-facility-search__field">
              <label htmlFor="home-search-age">月齢</label>
              <select
                id="home-search-age"
                name="age"
                value={ageMonth}
                onChange={(event) => setAgeMonth(event.target.value)}
              >
                <option value="">選択してください</option>
                {AGE_MONTH_OPTIONS.map((month) => (
                  <option value={month} key={month}>{month}ヶ月</option>
                ))}
              </select>
            </div>

            <div className="home-facility-search__actions">
              <button type="submit" className="btn btn--primary home-facility-search__submit">
                この条件で検索する
              </button>
              <button
                type="button"
                className="btn btn--outline home-facility-search__clear"
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
              >
                条件をクリア
              </button>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}

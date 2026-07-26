"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AREAS,
  CARE_TYPE_OPTIONS,
  FEATURE_OPTIONS,
  HOTEL_RESORT_AREA,
  type Facility,
} from "@/data/facilities";
import { getPriceDisplay } from "@/data/fukuokaSubsidy";
import type { CareType } from "@/data/subsidy";

type SortMode = "recommend" | "name";
type Residence = "福岡市" | "福岡市外";

const AVAILABILITY_LABEL: Record<Facility["availability"], string> = {
  ok: "空きあり",
  few: "残りわずか",
};

const CARE_TYPE_LABEL: Record<CareType, string> = {
  宿泊型: "宿泊型（ショートステイ）",
  通所型: "通所型（デイケア）",
  訪問型: "訪問型（アウトリーチ）",
};

const FEATURE_LABEL: Record<(typeof FEATURE_OPTIONS)[number], string> = {
  公費助成対象: "公費助成対象",
  自費プランあり: "自費プランあり",
};

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function linkedText(text: string): ReactNode {
  const url = text.match(/https?:\/\/[^\s）)]+/)?.[0];
  if (!url) return text;

  const [before, after = ""] = text.split(url);
  return (
    <>
      {before}
      <a href={url} target="_blank" rel="noreferrer">
        {url}
      </a>
      {after}
    </>
  );
}

function FacilityContact({ facility }: { facility: Facility }) {
  return (
    <div className="facility-card__contact">
      <span>連絡先</span>
      <div>
        {facility.contact.phone && (
          <a href={`tel:${facility.contact.phone}`}>{facility.contact.phone}</a>
        )}
        {facility.contact.phone && facility.contact.note && <br />}
        {facility.contact.note && linkedText(facility.contact.note)}
      </div>
    </div>
  );
}

export default function FacilitySearch({ facilities }: { facilities: Facility[] }) {
  const [residence, setResidence] = useState<Residence>("福岡市");
  const [subsidyOn, setSubsidyOn] = useState(true);
  const [freeMode, setFreeMode] = useState(false);
  const [area, setArea] = useState("");
  const [types, setTypes] = useState<CareType[]>([]);
  const [features, setFeatures] = useState<(typeof FEATURE_OPTIONS)[number][]>([]);
  const [sort, setSort] = useState<SortMode>("recommend");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  const residenceOutside = residence === "福岡市外";
  const effectiveFreeMode = residenceOutside || freeMode;

  useEffect(() => {
    if (!isDrawerOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isDrawerOpen]);

  const sorted = useMemo(() => {
    const list = facilities.filter((facility) => {
      if (!effectiveFreeMode && !facility.isInFukuokaCity) return false;
      if (
        area &&
        (area === HOTEL_RESORT_AREA
          ? !facility.isHotelResort
          : facility.ward !== area)
      ) {
        return false;
      }
      if (
        types.length > 0 &&
        !types.some((type) => facility.careTypes.includes(type))
      ) {
        return false;
      }
      return features.every((feature) => facility.features.includes(feature));
    });

    if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    }
    return list;
  }, [facilities, effectiveFreeMode, area, types, features, sort]);

  const clearFilters = () => {
    setArea("");
    setTypes([]);
    setFeatures([]);
  };

  const removeChip = (kind: "area" | "type" | "feature", value: string) => {
    if (kind === "area") setArea("");
    if (kind === "type") {
      setTypes((current) => current.filter((item) => item !== value));
    }
    if (kind === "feature") {
      setFeatures((current) => current.filter((item) => item !== value));
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeChips = [
    ...(area ? [{ kind: "area" as const, value: area }] : []),
    ...types.map((value) => ({ kind: "type" as const, value })),
    ...features.map((value) => ({ kind: "feature" as const, value })),
  ];

  return (
    <div className="search-page">
      <aside
        id="search-filter-sidebar"
        className={`search-sidebar${isDrawerOpen ? " is-open" : ""}`}
        aria-label="施設検索の絞り込み"
        aria-hidden={!isDrawerOpen ? undefined : false}
      >
        <button
          type="button"
          className="search-drawer-close"
          aria-label="絞り込みを閉じる"
          onClick={() => setIsDrawerOpen(false)}
        >
          ✕
        </button>

        <div className="search-filter-panel">
          <h2 className="search-filter-panel__title">条件をしぼって探す</h2>

          <div className="filter-group search-filter-group">
            <label className="filter-label" htmlFor="search-residence">
              居住地選択
            </label>
            <select
              id="search-residence"
              className="filter-select"
              value={residence}
              onChange={(event) => setResidence(event.target.value as Residence)}
            >
              <option value="福岡市">福岡市</option>
              <option value="福岡市外">福岡市外</option>
            </select>
          </div>

          <div className="search-filter-group search-check-list">
            <label className="search-check-item">
              <input
                type="checkbox"
                checked={subsidyOn}
                onChange={(event) => setSubsidyOn(event.target.checked)}
              />
              <span className="search-check-item__box" aria-hidden="true" />
              <span className="search-check-item__label">福岡市の補助金を利用する</span>
            </label>
            <label className="search-check-item">
              <input
                type="checkbox"
                checked={freeMode}
                onChange={(event) => setFreeMode(event.target.checked)}
              />
              <span className="search-check-item__box" aria-hidden="true" />
              <span className="search-check-item__label">
                自由に見る（完全自費・ホテルプラン含む）
              </span>
            </label>
          </div>

          <div className="filter-group search-filter-group">
            <label className="filter-label" htmlFor="search-area">
              エリア
            </label>
            <select
              id="search-area"
              className="filter-select"
              value={area}
              onChange={(event) => setArea(event.target.value)}
            >
              <option value="">すべてのエリア</option>
              {AREAS.map((item) => (
                <option key={item} value={item}>
                  福岡県 {item}
                </option>
              ))}
              <option value={HOTEL_RESORT_AREA}>{HOTEL_RESORT_AREA}</option>
            </select>
          </div>

          <fieldset className="search-filter-group">
            <legend className="filter-label">ケア種別</legend>
            <div className="search-check-list">
              {CARE_TYPE_OPTIONS.map((type) => (
                <label className="search-check-item search-check-item--type" key={type}>
                  <input
                    type="checkbox"
                    checked={types.includes(type)}
                    onChange={() => setTypes((current) => toggleValue(current, type))}
                  />
                  <span className="search-check-item__box" aria-hidden="true" />
                  <span className="search-check-item__label">{CARE_TYPE_LABEL[type]}</span>
                  <span className={`search-check-item__dot search-check-item__dot--${type}`} aria-hidden="true" />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="search-filter-group">
            <legend className="filter-label">こだわり条件</legend>
            <div className="search-check-list">
              {FEATURE_OPTIONS.map((feature) => (
                <label className="search-check-item" key={feature}>
                  <input
                    type="checkbox"
                    checked={features.includes(feature)}
                    onChange={() => setFeatures((current) => toggleValue(current, feature))}
                  />
                  <span className="search-check-item__box" aria-hidden="true" />
                  <span className="search-check-item__label">{FEATURE_LABEL[feature]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="search-filter-actions">
            <button type="button" className="btn btn--primary btn--full search-filter-apply" onClick={() => setIsDrawerOpen(false)}>
              この条件で検索する
            </button>
            <button type="button" className="btn btn--outline btn--full search-filter-clear" onClick={clearFilters} disabled={activeChips.length === 0}>
              条件をクリア
            </button>
          </div>
        </div>
      </aside>

      <button
        type="button"
        className={`search-overlay${isDrawerOpen ? " is-visible" : ""}`}
        aria-label="絞り込みを閉じる"
        tabIndex={isDrawerOpen ? 0 : -1}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="search-main">
        <header className="search-hero">
          <div>
            <h1>産後ケア施設を探す</h1>
            <p>福岡エリアの宿泊型・通所型施設から、あなたに合ったケアを探せます。</p>
          </div>
          <Link className="search-hero__cta" href="/#subsidy">
            💰 公費助成シミュレーターで自己負担額をチェック <span aria-hidden="true">→</span>
          </Link>
        </header>

        {residenceOutside && (
          <p className="search-results-notice" role="status">
            お住まいの自治体の助成制度は各自治体にご確認ください
          </p>
        )}

        <div className="search-results-header">
          <p className="facility-count" aria-live="polite">
            検索結果<strong>{sorted.length}</strong>件
          </p>
          <div className="search-sort">
            <label htmlFor="facility-sort">並び替え</label>
            <select id="facility-sort" className="filter-select" value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
              <option value="recommend">掲載順</option>
              <option value="name">施設名順</option>
            </select>
          </div>
        </div>

        <div className="search-active-chips" aria-live="polite" aria-label="選択中の絞り込み条件">
          {activeChips.map((chip) => (
            <span className="search-chip" key={`${chip.kind}-${chip.value}`}>
              {chip.value}
              <button type="button" aria-label={`${chip.value}の条件を外す`} onClick={() => removeChip(chip.kind, chip.value)}>✕</button>
            </span>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="facility-empty" role="status">
            <span aria-hidden="true">🔍</span>
            <p>条件に合う施設が見つかりませんでした。<br />条件を変更して、もう一度お試しください。</p>
          </div>
        ) : (
          <section className="facility-grid" aria-label="施設一覧">
            {sorted.map((facility) => {
              const isFavorite = favorites.has(facility.id);
              const price = getPriceDisplay(facility, {
                subsidyOn,
                freeMode,
                residenceOutside,
              });
              return (
                <article className="facility-card" key={facility.id}>
                  <div className={`facility-card__img search-photo--${facility.photoVariant}`}>
                    <span aria-hidden="true">{facility.icon}</span>
                    <span className={`availability-badge availability-badge--${facility.availability === "ok" ? "green" : "yellow"}`}>
                      {AVAILABILITY_LABEL[facility.availability]}
                    </span>
                    <button
                      type="button"
                      className={`search-favorite${isFavorite ? " is-favorite" : ""}`}
                      aria-label={isFavorite ? `${facility.name}をお気に入りから外す` : `${facility.name}をお気に入りに追加`}
                      aria-pressed={isFavorite}
                      onClick={() => toggleFavorite(facility.id)}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className="facility-card__body">
                    <div className="facility-card__types">
                      {facility.careTypes.map((careType) => (
                        <span className={`facility-card__type search-care-type--${careType}`} key={careType}>
                          {careType}
                        </span>
                      ))}
                    </div>
                    <h2 className="facility-card__name">{facility.name}</h2>
                    <p className="facility-card__location">📍 福岡県{facility.addressDetail}</p>
                    <p className="facility-card__age"><span>対象月齢</span> {facility.ageLimit}</p>
                    <FacilityContact facility={facility} />
                    <div className="tags">
                      {facility.features.map((feature) => (
                        <span className="tag" key={feature}>{feature}</span>
                      ))}
                      {effectiveFreeMode && !facility.isInFukuokaCity && (
                        <span className="tag tag--self-pay">公費対象外（自費）</span>
                      )}
                    </div>
                    <div className="facility-card__footer">
                      <p className={`facility-card__price${price.isInquiry ? " is-inquiry" : ""}`}>
                        {price.label}
                      </p>
                      <Link href={`/facility/${facility.id}`} className="btn btn--primary btn--sm facility-card__detail-btn">
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      <button type="button" className="search-drawer-toggle" aria-controls="search-filter-sidebar" aria-expanded={isDrawerOpen} onClick={() => setIsDrawerOpen(true)}>
        🔍 条件をしぼる
      </button>
    </div>
  );
}

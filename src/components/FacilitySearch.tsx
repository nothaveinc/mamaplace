"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AREAS,
  CARE_TYPE_OPTIONS,
  HOTEL_RESORT_AREA,
  fetchFacilities,
  type Facility,
} from "@/data/facilities";
import { getPriceDisplay } from "@/data/fukuokaSubsidy";
import type { CareType } from "@/data/subsidy";

type SortMode = "recommend" | "name";
type Residence = "" | "福岡市" | "福岡市外";
type FacilityFilter = "all" | "subsidy" | "non-subsidy";

const FAVORITES_STORAGE_KEY = "mamaplace:favorite-facility-ids";
const FACILITIES_PER_PAGE = 12;

const CARE_TYPE_LABEL: Record<CareType, string> = {
  宿泊型: "宿泊",
  通所型: "日帰り",
  訪問型: "訪問",
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

export default function FacilitySearch({ initialFacilities }: { initialFacilities: Facility[] }) {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [residence, setResidence] = useState<Residence>("");
  const [facilityFilter, setFacilityFilter] = useState<FacilityFilter>("all");
  const [subsidyFilterError, setSubsidyFilterError] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);
  const [types, setTypes] = useState<CareType[]>([]);
  const [sort, setSort] = useState<SortMode>("recommend");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [showFavorites, setShowFavorites] = useState(false);
  const [page, setPage] = useState(1);

  const handleFacilityFilterChange = (value: FacilityFilter) => {
    if (value === "subsidy" && residence === "") {
      setSubsidyFilterError(true);
      return;
    }
    setSubsidyFilterError(false);
    setPage(1);
    setFacilityFilter(value);
  };

  useEffect(() => {
    let cancelled = false;

    fetchFacilities()
      .then((fresh) => {
        if (!cancelled) setFacilities(fresh);
      })
      .catch(() => {
        // 取得に失敗した場合はビルド時点の初期データをそのまま表示する
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let favoriteIds: unknown = [];
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch {
      // 保存済みデータが壊れている場合は空のお気に入りとして扱う
    }

    queueMicrotask(() => {
      if (Array.isArray(favoriteIds)) {
        setFavorites(new Set(favoriteIds.filter((id): id is string => typeof id === "string")));
      }
      const params = new URLSearchParams(window.location.search);
      const requestedResidence = params.get("residence");
      const initialResidence: Residence =
        requestedResidence === "福岡市" || requestedResidence === "福岡市外"
          ? requestedResidence
          : "";
      const allowedAreas = new Set<string>([...AREAS, HOTEL_RESORT_AREA]);
      const initialAreas = params.getAll("area").filter((area) => allowedAreas.has(area));
      const initialTypes = params
        .getAll("type")
        .filter((type): type is CareType => CARE_TYPE_OPTIONS.includes(type as CareType));
      const isFavoritesFilter = params.get("favorites") === "1";
      const hasInitialSearchConditions =
        initialResidence !== "" ||
        initialAreas.length > 0 ||
        initialTypes.length > 0 ||
        isFavoritesFilter;

      setResidence(initialResidence);
      setAreas(initialAreas);
      setTypes(initialTypes);
      setShowFavorites(isFavoritesFilter);
      if (!hasInitialSearchConditions && window.matchMedia("(max-width: 640px)").matches) {
        setIsDrawerOpen(true);
      }
      const requestedPage = Number(params.get("page"));
      if (Number.isInteger(requestedPage) && requestedPage > 1) setPage(requestedPage);
    });
  }, []);

  useEffect(() => {
    if (residence === "") {
      setSubsidyFilterError(false);
      setFacilityFilter((current) => (current === "subsidy" ? "all" : current));
    }
  }, [residence]);

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
      if (showFavorites && !favorites.has(facility.id)) return false;
      if (residence === "福岡市" && !facility.subsidyApplicable) return false;
      if (residence === "福岡市外" && facility.subsidyApplicable) return false;
      if (facilityFilter === "subsidy" && !facility.subsidyApplicable) return false;
      if (facilityFilter === "non-subsidy" && facility.subsidyApplicable) return false;
      if (
        areas.length > 0 &&
        !areas.some((area) =>
          area === HOTEL_RESORT_AREA
            ? facility.isHotelResort
            : facility.ward === area,
        )
      ) {
        return false;
      }
      if (
        types.length > 0 &&
        !types.some((type) => facility.careTypes.includes(type))
      ) {
        return false;
      }
      return true;
    });

    if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    }
    return list;
  }, [facilities, favorites, showFavorites, residence, facilityFilter, areas, types, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / FACILITIES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedFacilities = sorted.slice(
    (currentPage - 1) * FACILITIES_PER_PAGE,
    currentPage * FACILITIES_PER_PAGE,
  );

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentPage]);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    const params = new URLSearchParams(window.location.search);
    if (nextPage === 1) params.delete("page");
    else params.set("page", String(nextPage));
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
    document.querySelector(".search-results-header")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setPage(1);
    setAreas([]);
    setTypes([]);
  };

  const removeChip = (kind: "area" | "type", value: string) => {
    setPage(1);
    if (kind === "area") {
      setAreas((current) => current.filter((item) => item !== value));
    }
    if (kind === "type") {
      setTypes((current) => current.filter((item) => item !== value));
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const activeChips = [
    ...areas.map((value) => ({ kind: "area" as const, value })),
    ...types.map((value) => ({ kind: "type" as const, value })),
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
              onChange={(event) => {
                setPage(1);
                setResidence(event.target.value as Residence);
              }}
            >
              <option value="">選択してください</option>
              <option value="福岡市">福岡市</option>
              <option value="福岡市外">福岡市外</option>
            </select>
          </div>

          <fieldset className="search-filter-group search-check-list">
            <legend className="filter-label">表示する施設</legend>
            <label className="search-check-item search-check-item--radio">
              <input
                type="radio"
                name="facility-filter"
                checked={facilityFilter === "all"}
                onChange={() => handleFacilityFilterChange("all")}
              />
              <span className="search-check-item__box search-check-item__box--radio" aria-hidden="true" />
              <span className="search-check-item__label">全施設</span>
            </label>
            <label className="search-check-item search-check-item--radio">
              <input
                type="radio"
                name="facility-filter"
                checked={facilityFilter === "subsidy"}
                onChange={() => handleFacilityFilterChange("subsidy")}
              />
              <span className="search-check-item__box search-check-item__box--radio" aria-hidden="true" />
              <span className="search-check-item__label">補助金対象施設</span>
            </label>
            {subsidyFilterError && (
              <p className="search-check-error" role="alert">
                ！居住地を選択してください
              </p>
            )}
            <label className="search-check-item search-check-item--radio">
              <input
                type="radio"
                name="facility-filter"
                checked={facilityFilter === "non-subsidy"}
                onChange={() => handleFacilityFilterChange("non-subsidy")}
              />
              <span className="search-check-item__box search-check-item__box--radio" aria-hidden="true" />
              <span className="search-check-item__label">
                補助金対象外施設（ホテル・リゾート）
              </span>
            </label>
          </fieldset>

          <fieldset className="search-filter-group">
            <legend className="filter-label">施設の場所</legend>
            <div className="search-check-list search-area-list">
              {[...AREAS, HOTEL_RESORT_AREA].map((area) => (
                <label className="search-check-item" key={area}>
                  <input
                    type="checkbox"
                    checked={areas.includes(area)}
                    onChange={() => {
                      setPage(1);
                      setAreas((current) => toggleValue(current, area));
                    }}
                  />
                  <span className="search-check-item__box" aria-hidden="true" />
                  <span className="search-check-item__label">
                    {area === HOTEL_RESORT_AREA ? area : `福岡県 ${area}`}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="search-filter-group">
            <legend className="filter-label">ケア種別</legend>
            <div className="search-check-list">
              {CARE_TYPE_OPTIONS.map((type) => (
                <label className="search-check-item search-check-item--type" key={type}>
                  <input
                    type="checkbox"
                    checked={types.includes(type)}
                    onChange={() => {
                      setPage(1);
                      setTypes((current) => toggleValue(current, type));
                    }}
                  />
                  <span className="search-check-item__box" aria-hidden="true" />
                  <span className="search-check-item__label">{CARE_TYPE_LABEL[type]}</span>
                  <span className={`search-check-item__dot search-check-item__dot--${type}`} aria-hidden="true" />
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

        {residence === "福岡市外" && (
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
            <select
              id="facility-sort"
              className="filter-select"
              value={sort}
              onChange={(event) => {
                setPage(1);
                setSort(event.target.value as SortMode);
              }}
            >
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
            {pagedFacilities.map((facility) => {
              const isFavorite = favorites.has(facility.id);
              const price = getPriceDisplay(facility, { residence });
              return (
                <article className="facility-card" id={`facility-${facility.id}`} key={facility.id}>
                  <div className={`facility-card__img search-photo--${facility.photoVariant}`}>
                    <span aria-hidden="true">{facility.icon}</span>
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
                          {CARE_TYPE_LABEL[careType]}
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
                      {!facility.subsidyApplicable && (
                        <span className="tag tag--self-pay">公費対象外（自費）</span>
                      )}
                    </div>
                    <div className="facility-card__footer">
                      <p className={`facility-card__price${price.isInquiry ? " is-inquiry" : ""}`}>
                        {price.label}
                      </p>
                      <Link
                        href={`/facility/${facility.id}?page=${currentPage}${showFavorites ? "&favorites=1" : ""}`}
                        className="btn btn--primary btn--sm facility-card__detail-btn"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {totalPages > 1 && (
          <nav className="search-pagination" aria-label="施設一覧のページ送り">
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              前へ
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                className={pageNumber === currentPage ? "is-current" : undefined}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                aria-label={`${pageNumber}ページ目`}
                onClick={() => changePage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              次へ
            </button>
          </nav>
        )}
      </div>

      <button type="button" className="search-drawer-toggle" aria-controls="search-filter-sidebar" aria-expanded={isDrawerOpen} onClick={() => setIsDrawerOpen(true)}>
        🔍 条件をしぼる
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import {
  AREAS,
  AGE_MONTH_OPTIONS,
  CARE_TYPE_OPTIONS,
  acceptsAgeMonth,
  fetchFacilities,
  type Facility,
} from "@/data/facilities";
import { getPriceDisplay } from "@/data/fukuokaSubsidy";
import type { CareType } from "@/data/subsidy";
import { announceDrawerOpen, subscribeToDrawerOpen } from "@/lib/drawerEvents";
import demo1 from "@/assets/facility-demo/demo-1.svg";

const DEMO_IMAGE = demo1;

type SortMode = "recommend" | "name";
export type Residence = "" | "福岡市" | "福岡市外";
export type FacilityFilter = "all" | "subsidy" | "non-subsidy";

export type SearchInitialFilters = {
  residence: Residence;
  facilityFilter: FacilityFilter;
  areas: string[];
  types: CareType[];
  ageMonth: number | null;
  showFavorites: boolean;
  page: number;
  hasSearchConditions: boolean;
};

const FAVORITES_STORAGE_KEY = "mamaplace:favorite-facility-ids";
const FACILITIES_PER_PAGE = 12;

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

export default function FacilitySearch({
  initialFacilities,
  initialFilters,
}: {
  initialFacilities: Facility[];
  initialFilters: SearchInitialFilters;
}) {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [residence, setResidence] = useState<Residence>(initialFilters.residence);
  const [facilityFilter, setFacilityFilter] = useState<FacilityFilter>(initialFilters.facilityFilter);
  const [subsidyFilterError, setSubsidyFilterError] = useState(false);
  const [areas, setAreas] = useState<string[]>(initialFilters.areas);
  const [types, setTypes] = useState<CareType[]>(initialFilters.types);
  const [ageMonth, setAgeMonth] = useState<number | null>(initialFilters.ageMonth);
  const [sort, setSort] = useState<SortMode>("recommend");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [showFavorites] = useState(initialFilters.showFavorites);
  const [page, setPage] = useState(initialFilters.page);
  const sidebarRef = useRef<HTMLElement>(null);

  const openFilterDrawer = () => {
    announceDrawerOpen("search-filter");
    setIsDrawerOpen(true);
  };

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
      if (!initialFilters.hasSearchConditions && window.matchMedia("(max-width: 640px)").matches) {
        announceDrawerOpen("search-filter");
        setIsDrawerOpen(true);
      }
    });
  }, [initialFilters.hasSearchConditions]);

  useEffect(() => {
    return subscribeToDrawerOpen((drawer) => {
      if (drawer !== "search-filter") setIsDrawerOpen(false);
    });
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isDrawerOpen]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const panel = sidebar?.querySelector<HTMLElement>(".search-filter-panel");
    const clearButton = panel?.querySelector<HTMLElement>(".search-filter-clear");
    const footer = document.querySelector<HTMLElement>(".footer");
    if (!sidebar || !panel || !clearButton || !footer) return;

    let animationFrame = 0;
    const updateFooterInset = () => {
      animationFrame = 0;
      const inset = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top);
      sidebar.style.setProperty("--search-footer-inset", `${inset}px`);

      const panelRect = panel.getBoundingClientRect();
      const clearButtonRect = clearButton.getBoundingClientRect();
      const panelPaddingBottom = Number.parseFloat(window.getComputedStyle(panel).paddingBottom);
      const contentBottom =
        clearButtonRect.bottom - panelRect.top + panel.scrollTop + panelPaddingBottom;
      const maxScrollTop = Math.max(0, contentBottom - panel.clientHeight);
      if (panel.scrollTop > maxScrollTop) panel.scrollTop = maxScrollTop;
    };
    const scheduleUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateFooterInset);
      }
    };

    updateFooterInset();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const panelResizeObserver = new ResizeObserver(scheduleUpdate);
    panelResizeObserver.observe(panel);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      panelResizeObserver.disconnect();
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
      sidebar.style.removeProperty("--search-footer-inset");
    };
  }, []);

  const sorted = useMemo(() => {
    const list = facilities.filter((facility) => {
      if (showFavorites && !favorites.has(facility.id)) return false;
      if (facilityFilter === "subsidy" && residence === "福岡市外") return false;
      if (facilityFilter === "subsidy" && !facility.subsidyApplicable) return false;
      if (facilityFilter === "non-subsidy" && facility.subsidyApplicable) return false;
      if (
        areas.length > 0 &&
        !areas.some((area) => facility.ward === area)
      ) {
        return false;
      }
      if (
        types.length > 0 &&
        !types.some((type) => facility.careTypes.includes(type))
      ) {
        return false;
      }
      if (ageMonth !== null && !acceptsAgeMonth(facility.ageLimit, ageMonth)) return false;
      return true;
    });

    if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    }
    return list;
  }, [facilities, favorites, showFavorites, residence, facilityFilter, areas, types, ageMonth, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / FACILITIES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const firstVisiblePage = Math.min(
    Math.max(currentPage - 2, 1),
    Math.max(totalPages - 4, 1),
  );
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstVisiblePage + index,
  );
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
    setAgeMonth(null);
  };

  const removeChip = (kind: "area" | "type" | "age", value: string) => {
    setPage(1);
    if (kind === "area") {
      setAreas((current) => current.filter((item) => item !== value));
    }
    if (kind === "type") {
      setTypes((current) => current.filter((item) => item !== value));
    }
    if (kind === "age") setAgeMonth(null);
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
    ...(ageMonth === null ? [] : [{ kind: "age" as const, value: `${ageMonth}ヶ月` }]),
  ];

  return (
    <div className="search-page">
      <aside
        ref={sidebarRef}
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
                const nextResidence = event.target.value as Residence;
                setResidence(nextResidence);
                if (nextResidence === "") {
                  setSubsidyFilterError(false);
                  setFacilityFilter((current) => (current === "subsidy" ? "all" : current));
                }
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

          <div className="search-filter-group">
            <MultiSelectDropdown
              id="facility-search-areas"
              label="施設の場所"
              options={AREA_OPTIONS}
              values={areas}
              onToggle={(area) => {
                setPage(1);
                setAreas((current) => toggleValue(current, area));
              }}
            />
          </div>

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

          <div className="filter-group search-filter-group">
            <label className="filter-label" htmlFor="search-age">
              月齢
            </label>
            <select
              id="search-age"
              className="filter-select"
              value={ageMonth ?? ""}
              onChange={(event) => {
                setPage(1);
                setAgeMonth(event.target.value === "" ? null : Number(event.target.value));
              }}
            >
              <option value="">選択してください</option>
              {AGE_MONTH_OPTIONS.map((month) => (
                <option value={month} key={month}>{month}ヶ月</option>
              ))}
            </select>
          </div>

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
          <h1>福岡の産後ケア施設一覧</h1>
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
              const detailHref = `/facility/${facility.id}?page=${currentPage}${showFavorites ? "&favorites=1" : ""}`;
              return (
                <article className="facility-card" id={`facility-${facility.id}`} key={facility.id}>
                  <Link
                    href={detailHref}
                    className="facility-card__card-link"
                    aria-label={`${facility.name}の詳細を見る`}
                  />
                  <div className={`facility-card__img search-photo--${facility.photoVariant}`}>
                    {facility.photos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={facility.photos[0]}
                        alt={`${facility.name}の写真`}
                        width={800}
                        height={600}
                      />
                    ) : (
                      <Image
                        src={DEMO_IMAGE}
                        alt={`${facility.name}のイメージ画像`}
                        width={800}
                        height={600}
                        unoptimized
                      />
                    )}
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
                        href={detailHref}
                        className="btn btn--sm facility-card__detail-btn"
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
            <div className="search-pagination__controls">
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                前へ
              </button>
              {visiblePages.map((pageNumber) => (
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
            </div>
            <p className="search-pagination__status" aria-live="polite">
              {currentPage} / {totalPages}ページ
            </p>
          </nav>
        )}
      </div>

      {!isDrawerOpen && (
        <button type="button" className="search-drawer-toggle" aria-controls="search-filter-sidebar" aria-expanded="false" onClick={openFilterDrawer}>
          条件をしぼる
        </button>
      )}
    </div>
  );
}

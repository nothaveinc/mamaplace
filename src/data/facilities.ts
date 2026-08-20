import type { CareType } from "./subsidy";
import { FACILITY_META, DEFAULT_FACILITY_META } from "./facilityMeta";

export type Availability = "ok" | "few";
export type PhotoVariant = "a" | "b" | "c";

export type SubsidyEntry = {
  municipality: string;
  applicable: boolean;
};

export type Facility = {
  id: string;
  name: string;
  careTypes: CareType[];
  ward: string;
  isInFukuokaCity: boolean;
  isHotelResort?: boolean;
  prefecture: string;
  addressDetail: string;
  ageLimit: string;
  contact: {
    phone?: string;
    note?: string;
    email?: string;
    website?: string;
    instagram?: string;
    line?: string;
  };
  photos: string[];
  features: string[];
  subsidies: SubsidyEntry[];
  subsidyApplicable: boolean;
  selfPayPriceLabel?: string;
  availability: Availability;
  icon: string;
  photoVariant: PhotoVariant;
  description: string;
};

export const AREAS = [
  "東区",
  "博多区",
  "中央区",
  "南区",
  "城南区",
  "早良区",
  "西区",
  "糟屋郡志免町",
  "春日市",
  "糸島市",
  "那珂川市",
  "糟屋郡久山町",
  "大野城市",
  "筑紫野市",
  "飯塚市",
  "小郡市",
  "古賀市",
  "福津市",
  "宗像市",
  "田川郡福智町",
  "田川市",
  "中間市",
  "北九州市小倉北区",
  "北九州市小倉南区",
  "北九州市八幡西区",
  "北九州市八幡東区",
  "北九州市若松区",
  "久留米市",
  "みやま市",
  "宮若市",
  "柳川市",
  "八女市",
  "大牟田市",
] as const;

export const CARE_TYPE_OPTIONS: CareType[] = ["宿泊型", "通所型", "訪問型"];

export const AGE_MONTH_OPTIONS = Array.from({ length: 12 }, (_, month) => month);

export const FEATURE_OPTIONS = ["公費助成対象", "自費プランあり"] as const;

const AGE_LIMIT_UNKNOWN = "施設へご確認ください";

export function acceptsAgeMonth(ageLimit: string, month: number): boolean {
  const normalizedAgeLimit = ageLimit.replace(/[ヶケカ]/g, "か");
  const minimumMonth = normalizedAgeLimit.match(/(\d+)か月以上/)?.[1];
  const maximumMonth = normalizedAgeLimit.match(/(\d+)か月未満/)?.[1];
  const maximumYear = normalizedAgeLimit.match(/(\d+)歳未満/)?.[1];

  if (!minimumMonth && !maximumMonth && !maximumYear) return false;

  const minimum = minimumMonth ? Number(minimumMonth) : 0;
  const maximum = maximumMonth
    ? Number(maximumMonth)
    : maximumYear
      ? Number(maximumYear) * 12
      : Number.POSITIVE_INFINITY;

  return month >= minimum && month < maximum;
}

const FUKUOKA_CITY_WARDS = ["東区", "博多区", "中央区", "南区", "城南区", "早良区", "西区"];

export const FACILITY_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzvrVwJNqxq5G668Y6cHb8ED11PaG3xh7HYe0td3GGLRtOYK2qZzQpCjUfb4IRu1gp3/exec";

const FACILITY_SHEET_REQUEST_URL =
  typeof window === "undefined"
    ? `${FACILITY_SHEET_URL}?build=${Date.now()}`
    : FACILITY_SHEET_URL;

type RawFacilityRow = {
  ID: number;
  施設名: string;
  画像: string;
  エリア: string;
  ケア種類: string;
  公費区分: string;
  "価格（補助金料金・ホテル通常料金）": string;
  受け入れ可能な月齢: string;
  電話番号: string;
  メール: string;
  HP: string;
  instagram: string;
  line: string;
  "対象自治体（公費）": string;
  "利用料金（補助金適応前）": string;
};

const CARE_TYPE_MAP: Record<string, CareType> = {
  宿泊: "宿泊型",
  日帰り: "通所型",
  訪問: "訪問型",
};

function parseCareTypes(raw: string): CareType[] {
  return raw
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => CARE_TYPE_MAP[part])
    .filter((careType): careType is CareType => Boolean(careType));
}

function resolveWard(rawArea: string): { ward: string; addressDetail: string } {
  const address = rawArea.startsWith("福岡市") ? rawArea.slice(3) : rawArea;
  const ward = AREAS.find((area) => address.startsWith(area)) ?? "";
  return { ward, addressDetail: address };
}

function parseContact(rawPhone: string): { phone?: string; note?: string } {
  const cleaned = (rawPhone ?? "").replace(/^TEL[:：]?\s*/i, "").trim();
  const isPhoneNumber = /^[0-9-]{9,}$/.test(cleaned);

  if (isPhoneNumber) {
    return { phone: cleaned };
  }

  return { note: cleaned || undefined };
}

function parsePhotos(rawPhotos: string): string[] {
  return (rawPhotos ?? "")
    .split(/[,\n]/)
    .map((photo) => photo.trim())
    .filter(Boolean);
}

function buildFeatures(subsidyApplicable: boolean, isHotelResort: boolean | undefined): string[] {
  const features: string[] = [];
  if (subsidyApplicable) features.push("公費助成対象");
  if (!subsidyApplicable || isHotelResort) features.push("自費プランあり");
  return features;
}

function parseFacilityRow(row: RawFacilityRow): Facility {
  const id = String(row.ID);
  const name = row.施設名.trim();
  const { ward, addressDetail } = resolveWard((row.エリア ?? "").trim());
  const isInFukuokaCity = FUKUOKA_CITY_WARDS.includes(ward);
  const careTypes = parseCareTypes(row.ケア種類 ?? "");
  const ageLimit = (row.受け入れ可能な月齢 ?? "").trim() || AGE_LIMIT_UNKNOWN;
  const contact = {
    ...parseContact(row.電話番号),
    email: (row.メール ?? "").trim() || undefined,
    website: (row.HP ?? "").trim() || undefined,
    instagram: (row.instagram ?? "").trim() || undefined,
    line: (row.line ?? "").trim() || undefined,
  };
  const photos = parsePhotos(row.画像);
  const subsidyApplicable = (row.公費区分 ?? "").trim() === "補助対象";
  const targetMunicipality = (row["対象自治体（公費）"] ?? "").trim();
  const subsidies: SubsidyEntry[] = targetMunicipality
    ? [{ municipality: targetMunicipality, applicable: subsidyApplicable }]
    : [];
  const selfPayPriceLabel =
    (row["価格（補助金料金・ホテル通常料金）"] ?? "").trim() || undefined;
  const meta = FACILITY_META[id] ?? DEFAULT_FACILITY_META;

  return {
    id,
    name,
    careTypes,
    ward,
    isInFukuokaCity,
    isHotelResort: meta.isHotelResort ?? false,
    prefecture: "福岡県",
    addressDetail,
    ageLimit,
    contact,
    photos,
    features: buildFeatures(subsidyApplicable, meta.isHotelResort),
    subsidies,
    subsidyApplicable,
    selfPayPriceLabel,
    availability: "ok",
    icon: meta.icon,
    photoVariant: meta.photoVariant,
    description: `${ward}にある産後ケア施設です。${careTypes.join("・")}に対応しています。`,
  };
}

export async function fetchFacilities(): Promise<Facility[]> {
  const res = await fetch(
    FACILITY_SHEET_REQUEST_URL,
    typeof window === "undefined" ? undefined : { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error(`施設データの取得に失敗しました (status: ${res.status})`);
  }
  const rows: RawFacilityRow[] = await res.json();
  return rows.map(parseFacilityRow);
}

export function getFacilityById(id: string, facilities: Facility[]): Facility | undefined {
  return facilities.find((facility) => facility.id === id);
}

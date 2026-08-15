import { FUKUOKA_CITY_COPAY } from "./fukuokaSubsidy";
import type { CareType } from "./subsidy";

export type SubsidyHousehold = "general" | "lowIncome" | "welfare";

export type MunicipalitySubsidy = {
  id: string;
  prefecture: string;
  municipality: string;
  label: string;
  eligibleBabyAgeMonths: number;
  maxCombinedUses: number;
  rates: Record<
    CareType,
    {
      copay: number;
      countUnit: "日" | "回";
      note?: string;
    }
  >;
  applicationSteps: string[];
  officialUrl: string;
  updatedAt: string;
  note: string;
};

const FUKUOKA_CITY: MunicipalitySubsidy = {
  id: "fukuoka-fukuoka",
  prefecture: "福岡県",
  municipality: "福岡市",
  label: "福岡県 福岡市",
  eligibleBabyAgeMonths: 12,
  maxCombinedUses: 7,
  rates: {
    宿泊型: {
      copay: FUKUOKA_CITY_COPAY.宿泊型.amount,
      countUnit: "日",
      note: "1泊2日の場合は2日分（6,000円）です",
    },
    通所型: {
      copay: FUKUOKA_CITY_COPAY.通所型.amount,
      countUnit: "日",
    },
    訪問型: {
      copay: FUKUOKA_CITY_COPAY.訪問型.amount,
      countUnit: "回",
      note: "1回2〜3時間です",
    },
  },
  applicationSteps: [
    "利用を希望する施設へ直接問い合わせる",
    "施設へ利用申請書を提出し、利用日を予約する",
    "施設から交付される福岡市産後ケア事業利用証を受け取る",
    "利用当日に利用証と母子健康手帳を提示し、自己負担額を支払う",
  ],
  officialUrl: "https://kodomo.city.fukuoka.lg.jp/info/1961/",
  updatedAt: "2026年6月24日",
  note:
    "利用できる赤ちゃんの月齢は施設によって異なります。予約前に利用施設へご確認ください。",
};

// 対応自治体を増やすときは、同じ形式の設定をこの配列へ追加します。
export const SUPPORTED_MUNICIPALITIES: MunicipalitySubsidy[] = [FUKUOKA_CITY];

export const MUNICIPALITY_SUBSIDIES = Object.fromEntries(
  SUPPORTED_MUNICIPALITIES.map((municipality) => [
    municipality.id,
    municipality,
  ]),
) as Record<string, MunicipalitySubsidy>;

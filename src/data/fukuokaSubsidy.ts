import type { Facility } from "./facilities";
import type { CareType } from "./subsidy";

export const FUKUOKA_CITY_COPAY: Record<
  CareType,
  { amount: number; unit: string; note?: string }
> = {
  宿泊型: { amount: 3000, unit: "1泊", note: "例：1泊2日で6,000円" },
  通所型: { amount: 2000, unit: "1日" },
  訪問型: { amount: 500, unit: "1回（2〜3時間）" },
};

export type PriceDisplayOptions = {
  residence: string; // "" = 未選択, "福岡市" = 福岡市在住, それ以外は他市町村在住
};

const CARE_TYPE_PRICE_LABEL: Record<CareType, string> = {
  宿泊型: "宿泊",
  通所型: "日帰り",
  訪問型: "訪問",
};

const CARE_TYPE_UNIT_LABEL: Record<CareType, string> = {
  宿泊型: "泊",
  通所型: "日",
  訪問型: "回",
};

export function getPriceDisplay(
  facility: Facility,
  { residence }: PriceDisplayOptions,
): { label: string; isInquiry: boolean } {
  if (!facility.subsidyApplicable && facility.selfPayPriceLabel) {
    return { label: facility.selfPayPriceLabel, isInquiry: false };
  }

  if (residence === "") {
    return {
      label: "※自己負担額を表示するには居住地を選択してください",
      isInquiry: true,
    };
  }

  if (residence !== "福岡市" || !facility.isInFukuokaCity) {
    return {
      label: "実費は施設へお問い合わせください",
      isInquiry: true,
    };
  }

  return {
    label: facility.careTypes
      .map((careType) => {
        const rate = FUKUOKA_CITY_COPAY[careType];
        return `${CARE_TYPE_PRICE_LABEL[careType]}: 自己負担${rate.amount.toLocaleString("ja-JP")}円/${CARE_TYPE_UNIT_LABEL[careType]}`;
      })
      .join("　"),
    isInquiry: false,
  };
}

import type { CareType } from "./subsidy";

export type Availability = "ok" | "few";
export type PhotoVariant = "a" | "b" | "c";

export type Review = {
  name: string;
  date: string;
  rating: number;
  text: string;
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
  };
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  features: string[];
  subsidyApplicable: boolean;
  availability: Availability;
  icon: string;
  photoVariant: PhotoVariant;
  description: string;
  access: string;
  hours: string;
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
] as const;

export const HOTEL_RESORT_AREA = "全国（ホテル・リゾート）";

export const CARE_TYPE_OPTIONS: CareType[] = ["宿泊型", "通所型", "訪問型"];

export const FEATURE_OPTIONS = ["公費助成対象", "自費プランあり"] as const;

type FacilitySource = Omit<Facility, "prefecture" | "isHotelResort" | "subsidyApplicable" | "availability" | "description" | "access" | "hours"> & {
  isHotelResort?: boolean;
};

const CONTACT_PLACEHOLDER = "詳細・ご予約は施設へ直接お問い合わせください。";

function createFacility(source: FacilitySource): Facility {
  return {
    ...source,
    prefecture: "福岡県",
    isHotelResort: source.isHotelResort ?? false,
    subsidyApplicable: true,
    availability: "ok",
    description: `${source.ward}にある産後ケア施設です。${source.careTypes.join("・")}に対応しています。`,
    access: CONTACT_PLACEHOLDER,
    hours: CONTACT_PLACEHOLDER,
  };
}

export const facilities: Facility[] = [
  createFacility({
    id: "seaside-mary-fukuoka",
    name: "シーサイドマリィFUKUOKA",
    careTypes: ["宿泊型"],
    ward: "東区",
    isInFukuokaCity: true,
    isHotelResort: true,
    addressDetail: "東区西戸崎18-25 ザ・ルイガンズ スパ&リゾート ホテル内",
    ageLimit: "4か月未満",
    contact: { note: "施設HPより予約・問合せ" },
    features: ["公費助成対象", "自費プランあり"],
    icon: "🏨",
    photoVariant: "a",
  }),
  createFacility({
    id: "sanada-clinic-higashi",
    name: "福岡市 真田産婦人科麻酔科クリニック (産後ケアセンターマリィのおうち)",
    careTypes: ["宿泊型", "通所型"],
    ward: "東区",
    isInFukuokaCity: true,
    addressDetail: "東区千早6-6-16",
    ageLimit: "4か月未満",
    contact: { phone: "092-681-0178" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "b",
  }),
  createFacility({
    id: "fukuoka-childrens-hospital",
    name: "福岡市立こども病院 産後ケア",
    careTypes: ["通所型"],
    ward: "東区",
    isInFukuokaCity: true,
    addressDetail: "東区香椎照葉5-1-1",
    ageLimit: "4か月未満",
    contact: { phone: "092-692-3654" },
    features: ["公費助成対象"],
    icon: "🏨",
    photoVariant: "c",
  }),
  createFacility({
    id: "arisu-no-ie",
    name: "ありすの家",
    careTypes: ["通所型"],
    ward: "東区",
    isInFukuokaCity: true,
    addressDetail: "東区箱崎2丁目12-20",
    ageLimit: "1歳未満",
    contact: { phone: "092-260-8622", note: "ご予約は施設HP（https://www.alicehoumon.com/sangocare）から" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "a",
  }),
  createFacility({
    id: "aoba-ladies-clinic",
    name: "青葉レディースクリニック",
    careTypes: ["宿泊型", "通所型"],
    ward: "東区",
    isInFukuokaCity: true,
    addressDetail: "東区若宮5-18-21",
    ageLimit: "4か月未満",
    contact: { phone: "092-663-8103" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "b",
  }),
  createFacility({
    id: "kii-midwife-house",
    name: "絆衣(きい) 助産院",
    careTypes: ["通所型"],
    ward: "博多区",
    isInFukuokaCity: true,
    addressDetail: "博多区昭南町1-2-3",
    ageLimit: "1歳未満",
    contact: { phone: "080-2757-2748" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "c",
  }),
  createFacility({
    id: "morishita-obstetrics",
    name: "森下産婦人科医院",
    careTypes: ["宿泊型", "通所型"],
    ward: "博多区",
    isInFukuokaCity: true,
    addressDetail: "博多区店屋町8-10",
    ageLimit: "3か月未満",
    contact: { phone: "092-291-0328" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "a",
  }),
  createFacility({
    id: "toono-obstetrics",
    name: "東野産婦人科医院",
    careTypes: ["宿泊型"],
    ward: "中央区",
    isInFukuokaCity: true,
    addressDetail: "中央区草香江2-2-17",
    ageLimit: "4か月未満",
    contact: { phone: "092-715-8373" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "b",
  }),
  createFacility({
    id: "oheso-midwife-house",
    name: "おへそ助産院",
    careTypes: ["通所型"],
    ward: "中央区",
    isInFukuokaCity: true,
    addressDetail: "中央区地行2-16-1",
    ageLimit: "1歳未満",
    contact: { phone: "080-9101-5262" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "c",
  }),
  createFacility({
    id: "daimyo-yonekura-pediatrics",
    name: "大名よねくら小児科クリニック",
    careTypes: ["通所型"],
    ward: "中央区",
    isInFukuokaCity: true,
    addressDetail: "中央区大名2-9-18",
    ageLimit: "1歳未満",
    contact: { phone: "092-753-6362" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "a",
  }),
  createFacility({
    id: "koga-fumitoshi-womens-clinic",
    name: "古賀文敏ウイメンズクリニック",
    careTypes: ["通所型"],
    ward: "中央区",
    isInFukuokaCity: true,
    addressDetail: "中央区天神2-3-24 5F",
    ageLimit: "2か月以上1歳未満",
    contact: { phone: "092-731-8550" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "b",
  }),
  createFacility({
    id: "maternite-midwife-house",
    name: "マテルニテ助産院",
    careTypes: ["通所型"],
    ward: "中央区",
    isInFukuokaCity: true,
    addressDetail: "中央区六本松4-2-1 2F",
    ageLimit: "6か月未満",
    contact: { phone: "092-734-5090" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "c",
  }),
  createFacility({
    id: "mamita-midwife-house",
    name: "助産院mamita(マミータ)",
    careTypes: ["宿泊型", "通所型"],
    ward: "南区",
    isInFukuokaCity: true,
    addressDetail: "南区大池2-12-3",
    ageLimit: "4か月未満 (※)",
    contact: { phone: "092-553-5503", note: "ご予約は予約サイト（https://www.chillnn.com/19cff82a47b306）から" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "a",
  }),
  createFacility({
    id: "hughug-midwife-house",
    name: "助産院HUGHUG(はぐはぐ)",
    careTypes: ["通所型"],
    ward: "城南区",
    isInFukuokaCity: true,
    addressDetail: "城南区長尾2-6-11-1F",
    ageLimit: "1歳未満",
    contact: { phone: "092-982-2046" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "b",
  }),
  createFacility({
    id: "cradle-house-jonan",
    name: "cradle house (クレイドルハウス)",
    careTypes: ["通所型"],
    ward: "城南区",
    isInFukuokaCity: true,
    addressDetail: "城南区松山2-40-8",
    ageLimit: "1歳未満",
    contact: { phone: "070-4324-5203" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "c",
  }),
  createFacility({
    id: "takeuchi-obstetrics",
    name: "竹内産婦人科クリニック",
    careTypes: ["宿泊型", "通所型"],
    ward: "早良区",
    isInFukuokaCity: true,
    addressDetail: "早良区野芥7-1-30",
    ageLimit: "4か月未満",
    contact: { phone: "092-864-8080" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "a",
  }),
  createFacility({
    id: "muromigawa-midwife-house",
    name: "助産院 室見川",
    careTypes: ["通所型"],
    ward: "早良区",
    isInFukuokaCity: true,
    addressDetail: "早良区南庄6-14-16",
    ageLimit: "1歳未満",
    contact: { phone: "080-5204-8846" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "b",
  }),
  createFacility({
    id: "yuragi-midwife-house",
    name: "ゆらぎ助産院",
    careTypes: ["通所型"],
    ward: "早良区",
    isInFukuokaCity: true,
    addressDetail: "早良区室見4-16-3",
    ageLimit: "1歳未満",
    contact: { phone: "090-9471-1216", note: "ご予約は施設HPから（https://yuragijosanin.com/）" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "c",
  }),
  createFacility({
    id: "ikeda-isao-obstetrics",
    name: "池田功産婦人科医院",
    careTypes: ["宿泊型", "通所型"],
    ward: "西区",
    isInFukuokaCity: true,
    addressDetail: "西区野方1-2-25",
    ageLimit: "4か月未満 (※)",
    contact: { phone: "092-811-7778" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "a",
  }),
  createFacility({
    id: "fukuoka-sanno-hospital",
    name: "福岡山王病院",
    careTypes: ["宿泊型", "通所型"],
    ward: "早良区",
    isInFukuokaCity: true,
    addressDetail: "早良区百道浜3-6-45",
    ageLimit: "4か月未満",
    contact: { phone: "092-832-1100" },
    features: ["公費助成対象"],
    icon: "🏨",
    photoVariant: "b",
  }),
  createFacility({
    id: "chikushi-clinic-shime",
    name: "産婦人科筑紫クリニック",
    careTypes: ["宿泊型", "通所型"],
    ward: "糟屋郡志免町",
    isInFukuokaCity: false,
    addressDetail: "糟屋郡志免町志免中央3-1-30",
    ageLimit: "4か月未満",
    contact: { phone: "092-936-3939" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "c",
  }),
  createFacility({
    id: "gonjo-obstetrics-shime",
    name: "権丈産婦人科医院",
    careTypes: ["宿泊型", "通所型"],
    ward: "糟屋郡志免町",
    isInFukuokaCity: false,
    addressDetail: "糟屋郡志免町志免3-2-14",
    ageLimit: "4か月未満",
    contact: { phone: "092-935-0505" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "a",
  }),
  createFacility({
    id: "jono-obstetrics-kasuga",
    name: "城野産婦人科クリニック",
    careTypes: ["宿泊型", "通所型"],
    ward: "春日市",
    isInFukuokaCity: false,
    addressDetail: "春日市一の谷2-8-1",
    ageLimit: "4か月未満",
    contact: { phone: "092-584-1103" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "b",
  }),
  createFacility({
    id: "mawatari-obstetrics-itoshima",
    name: "馬渡産婦人科医院",
    careTypes: ["宿泊型", "通所型"],
    ward: "糸島市",
    isInFukuokaCity: false,
    addressDetail: "糸島市前原西2-13-1",
    ageLimit: "4か月未満",
    contact: { phone: "092-322-2198" },
    features: ["公費助成対象"],
    icon: "🏥",
    photoVariant: "c",
  }),
  createFacility({
    id: "nene-midwife-house-itoshima",
    name: "ねね助産院",
    careTypes: ["通所型"],
    ward: "糸島市",
    isInFukuokaCity: false,
    addressDetail: "糸島市二丈深江8丁目28-1",
    ageLimit: "1歳未満",
    contact: { phone: "070-9028-6896" },
    features: ["公費助成対象"],
    icon: "🤱",
    photoVariant: "a",
  }),
];

export function getFacilityById(id: string): Facility | undefined {
  return facilities.find((facility) => facility.id === id);
}

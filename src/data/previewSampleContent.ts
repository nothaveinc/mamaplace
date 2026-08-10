export const PREVIEW_BELONGINGS = [
  "母子手帳",
  "健康保険証のコピー",
  "着替え（2〜3組）",
  "ミルク・哺乳瓶（必要な方）",
  "その他申請は施設へご確認ください",
] as const;

export const PREVIEW_SCHEDULE = [
  { time: "09:30", content: "受付・健康チェック" },
  { time: "10:00", content: "自由遊び・おやつ" },
  { time: "11:30", content: "昼食" },
  { time: "13:00", content: "お昼寝" },
  { time: "15:00", content: "おやつ" },
  { time: "15:30", content: "自由遊び" },
  { time: "16:30", content: "お迎え・帰宅" },
] as const;

export const PREVIEW_HIGHLIGHTS = [
  {
    category: "スタッフの声",
    name: "山田さん",
    body: "お子さま一人ひとりのペースを大切に、安心して過ごせる環境づくりを心がけています。育児不安も安心してご相談ください。",
  },
  {
    category: "利用者の声",
    name: "Aさん（2歳のお子さまのママ）",
    body: "急な用事で利用しましたが、丁寧に対応してくださり安心でした。子どもも楽しく過ごせて、また利用したいです。",
  },
] as const;

export const PREVIEW_PARKING = {
  value: "あり（15台）",
  note: "※満車の場合は近隣のコインパーキングをご利用ください。",
} as const;

export const PREVIEW_CANCELLATION_POLICY = {
  lines: [
    "ご利用日の前日17:00まで：無料",
    "ご利用日の前日17:00〜当日：料金の50%",
    "無断キャンセル：料金の100%",
  ],
  note: "※天災や体調不良などやむを得ない場合はご相談ください。",
} as const;

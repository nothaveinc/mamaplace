import type { Metadata } from "next";
import Link from "next/link";
import SubpageHero from "@/components/SubpageHero";
import FaqAccordion, { type FaqCategory } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "よくある質問",
  description:
    "MamaPlaceのよくある質問。サービスの使い方、公費助成、施設情報についてお答えします。",
  alternates: { canonical: "/faq" },
};

const categories: FaqCategory[] = [
  {
    id: "service",
    title: "サービスについて",
    items: [
      {
        question: "MamaPlaceはどんなサービスですか？",
        answer:
          "MamaPlaceは、福岡市の公費助成対象となる産後ケア施設と、助成対象外のホテル・リゾート型施設をまとめて検索できるサービスです。居住地、施設の種類、エリア、ケア種別などの条件から施設を探せます。",
      },
      {
        question: "福岡市外に住んでいても利用できますか？",
        answer:
          "施設検索は福岡市外にお住まいの方も利用できます。ただし、公費助成シミュレーターは現在、福岡市の制度のみ対応しています。福岡市外の助成制度については、お住まいの自治体へご確認ください。",
      },
      {
        question: "利用料金はかかりますか？",
        answer:
          "MamaPlaceの施設検索と公費助成シミュレーターは無料で利用できます。施設を実際に利用する際の料金は、施設の種類や助成の適用状況によって異なります。",
      },
      {
        question: "スマートフォンからも使えますか？",
        answer: "はい、スマートフォン・タブレット・PCに対応しています。",
      },
    ],
  },
  {
    id: "subsidy",
    title: "公費助成について",
    items: [
      {
        question: "産後ケアの公費助成とは何ですか？",
        answer:
          "自治体が実施する産後ケア事業により、宿泊型・通所型・訪問型の産後ケアを利用する際の費用負担を軽減する制度です。対象者、利用上限、自己負担額などは自治体ごとに異なります。",
      },
      {
        question: "公費助成シミュレーターはどの地域に対応していますか？",
        answer:
          "現在は、福岡市に住民票がある方を対象とした福岡市の産後ケア事業に対応しています。その他の自治体には順次対応する予定です。",
      },
      {
        question: "福岡市の公費助成を利用できるのはどのような方ですか？",
        answer:
          "福岡市に住民票があり、生後1年未満の赤ちゃんとそのお母さん、または流産・死産を経験して1年未満の女性で、母子ともに医療行為を必要としない方が対象です。施設によって受け入れ可能な月齢などが異なるため、利用前に施設へご確認ください。",
      },
      {
        question: "福岡市の自己負担額はいくらですか？",
        answer:
          "一般世帯の場合、宿泊型は1日3,000円、通所型は1日2,000円、訪問型は1回500円です。宿泊型の1泊2日は2日分の6,000円として計算します。住民税非課税世帯と生活保護受給世帯は自己負担がありません。",
      },
      {
        question: "利用できる日数に上限はありますか？",
        answer:
          "福岡市の産後ケア事業では、宿泊型・通所型・訪問型を合わせて7日まで利用できます。施設の空き状況や受け入れ条件については、利用を希望する施設へご確認ください。",
      },
      {
        question: "シミュレーターの結果は確定した料金ですか？",
        answer:
          "福岡市の制度内容に基づく自己負担額の目安です。実際に助成を利用できるかどうかや最終的な料金は、利用条件や施設の受け入れ状況によって異なる場合があります。予約前に施設または福岡市の公式案内をご確認ください。",
      },
      {
        question: "福岡市の産後ケアはどのように申し込みますか？",
        answer:
          "利用を希望する施設へ直接問い合わせ、利用申請書の提出と予約を行います。施設から交付される福岡市産後ケア事業利用証を受け取り、利用当日に利用証と母子健康手帳を提示して自己負担額を支払います。",
      },
      {
        question: "シミュレーターに入力した情報は保存されますか？",
        answer:
          "シミュレーターに入力した自治体、世帯状況、ケア種別、利用予定日数・回数、赤ちゃんの月齢は、お使いのブラウザ内で計算するためにのみ使用し、サーバーには送信・保存しません。",
      },
    ],
  },
  {
    id: "facility",
    title: "施設について",
    items: [
      {
        question: "助成対象施設とホテル・リゾート型施設の違いは何ですか？",
        answer:
          "助成対象施設は、福岡市の産後ケア事業による公費助成を利用できる施設です。ホテル・リゾート型施設は公費助成の対象外で、原則として施設が設定する通常料金で利用します。",
      },
      {
        question: "施設はどのような条件で検索できますか？",
        answer:
          "居住地、助成対象かどうか、施設の場所、ケア種別で絞り込めます。施設の場所とケア種別は複数選択できます。",
      },
      {
        question: "サイトに表示される料金は確定した金額ですか？",
        answer:
          "助成対象施設には、福岡市の公費助成が適用された場合の自己負担額を表示しています。ホテル・リゾート型施設の通常料金や各施設のプラン内容は変更される場合があるため、予約前に施設へ直接ご確認ください。",
      },
      {
        question: "施設情報はどのくらい最新ですか？",
        answer:
          "掲載情報は定期的に確認していますが、料金、受け入れ可能な月齢、空き状況、サービス内容などは変更される場合があります。利用前に必ず施設へ直接ご確認ください。",
      },
      {
        question: "施設の予約はサイト経由でできますか？",
        answer:
          "現在、MamaPlace上で予約を確定する機能はありません。施設詳細ページに連絡先が掲載されている場合は、電話や公式サイトなどから施設へ直接お問い合わせください。",
      },
      {
        question: "お気に入りに登録した施設はどこに保存されますか？",
        answer:
          "お気に入り情報は、お使いのブラウザ内に保存されます。会員登録やサーバーへの保存は行いません。ブラウザのデータを削除した場合や、別の端末・ブラウザを使用した場合は引き継がれません。",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: categories.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SubpageHero title="よくある質問" path="/faq" />
      <div className="subpage-main">
        <div className="container">
          <FaqAccordion categories={categories} />
          <div className="faq-contact-cta">
            <p>解決しない場合はお気軽にお問い合わせください。</p>
            <Link href="/contact" className="btn btn--primary">
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

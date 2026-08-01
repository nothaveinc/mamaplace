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
          "MamaPlaceは、産後のお母さんが最適なケアを受けられるよう、公費助成シミュレーターと施設マッチングを無料で提供するWebプラットフォームです。",
      },
      {
        question: "利用料金はかかりますか？",
        answer:
          "サービスの利用は完全無料です。掲載施設の利用料金は各施設が設定しています。",
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
          "産後ケア事業として、多くの自治体が産後の育児支援のために宿泊型・通所型・訪問型ケアに対して費用の一部を助成しています。",
      },
      {
        question: "シミュレーターの助成額は正確ですか？",
        answer:
          "参考値として提供しています。最新かつ正確な情報はお住まいの市区町村窓口にご確認ください。助成制度は変更される場合があります。",
      },
      {
        question: "個人情報は入力しますか？",
        answer:
          "公費シミュレーターで入力する情報は、お客様のブラウザ内のみで処理され、サーバーには送信・保存されません。",
      },
      {
        question: "申請はどこでできますか？",
        answer:
          "お住まいの市区町村の子育て支援担当窓口、またはオンライン申請（自治体によって異なります）にて申請できます。",
      },
    ],
  },
  {
    id: "facility",
    title: "施設について",
    items: [
      {
        question: "施設の情報はどのくらい最新ですか？",
        answer:
          "定期的に情報を更新していますが、空き状況や料金は変動する場合があります。ご利用前に施設へ直接ご確認ください。",
      },
      {
        question: "口コミは信頼できますか？",
        answer:
          "実際に施設を利用されたお母さんからの投稿です。個人の感想のため、施設選びの参考情報としてご活用ください。",
      },
      {
        question: "施設の予約はサイト経由でできますか？",
        answer:
          "現在は施設情報の提供のみで、予約機能はありません。各施設に直接お問い合わせください。",
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

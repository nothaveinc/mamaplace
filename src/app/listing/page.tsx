import type { Metadata } from "next";
import Link from "next/link";
import SubpageHero from "@/components/SubpageHero";

export const metadata: Metadata = {
  title: "施設掲載について",
  description:
    "MamaPlaceへの施設掲載をご希望の事業者さまへ。掲載対象、掲載情報、お申し込みから公開までの流れをご案内します。",
  alternates: { canonical: "/listing/" },
};

const listingDetails = [
  {
    title: "施設の基本情報",
    description: "施設名、所在地、施設の特徴など、施設選びに必要な情報を掲載します。",
  },
  {
    title: "利用条件",
    description: "宿泊・日帰り・訪問のケア種別や、受け入れ可能な赤ちゃんの月齢を掲載します。",
  },
  {
    title: "料金・公費情報",
    description: "利用料金の目安や、公費助成の対象状況を分かりやすくご案内します。",
  },
  {
    title: "お問い合わせ先",
    description: "電話、公式サイト、SNSなど、利用希望者が施設へ直接連絡できる窓口を掲載します。",
  },
];

const listingSteps = [
  {
    title: "お問い合わせ",
    description: "お問い合わせフォームで「施設掲載希望」を選択し、施設名やご担当者さまの情報をお送りください。",
  },
  {
    title: "掲載内容の確認",
    description: "MamaPlaceからご連絡し、施設情報、ケア内容、料金、公費助成の対象状況などを確認します。",
  },
  {
    title: "ページ公開",
    description: "掲載内容をご確認いただいた後、施設検索と施設詳細ページへ情報を公開します。",
  },
];

export default function ListingPage() {
  return (
    <>
      <SubpageHero title="施設掲載について" path="/listing" />
      <div className="subpage-main">
        <div className="container">
          <div className="listing-content">
            <section className="listing-intro" aria-labelledby="listing-intro-title">
              <p className="listing-eyebrow">産後ケア施設・事業者さまへ</p>
              <h2 id="listing-intro-title">
                必要な方に、施設の情報を届けませんか？
              </h2>
              <p>
                MamaPlaceは、産後ケアを探すお母さんとご家族が、ケア種別や場所、赤ちゃんの月齢などから自分に合う施設を探せるサービスです。施設の特徴や利用条件を分かりやすく掲載し、利用を検討する方と施設をつなぎます。
              </p>
            </section>

            <section className="listing-section" aria-labelledby="listing-target-title">
              <h2 id="listing-target-title">掲載対象</h2>
              <p>次のような施設・事業者さまからの掲載相談を受け付けています。</p>
              <ul className="listing-targets">
                <li>自治体の産後ケア事業に対応している施設</li>
                <li>宿泊型・通所型・訪問型の産後ケアを提供している事業者</li>
                <li>自費の産後ケアプランを提供しているホテル・リゾートなど</li>
              </ul>
              <p className="listing-note">
                ※サービス内容などを確認のうえ、掲載可否をご案内します。
              </p>
            </section>

            <section className="listing-section" aria-labelledby="listing-details-title">
              <h2 id="listing-details-title">掲載する情報</h2>
              <div className="listing-detail-grid">
                {listingDetails.map((detail) => (
                  <article className="listing-detail-card" key={detail.title}>
                    <h3>{detail.title}</h3>
                    <p>{detail.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="listing-section" aria-labelledby="listing-flow-title">
              <h2 id="listing-flow-title">掲載までの流れ</h2>
              <ol className="listing-flow">
                {listingSteps.map((step, index) => (
                  <li key={step.title}>
                    <span className="listing-flow__number" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="listing-section" aria-labelledby="listing-notes-title">
              <h2 id="listing-notes-title">掲載にあたって</h2>
              <ul className="listing-notes">
                <li>掲載条件や費用については、お問い合わせ後に個別にご案内します。</li>
                <li>掲載前に、施設・サービスの内容を確認させていただきます。</li>
                <li>掲載後に情報が変更された場合は、最新情報をご連絡ください。</li>
                <li>掲載は、予約数や利用者数を保証するものではありません。</li>
              </ul>
            </section>

            <section className="listing-cta" aria-labelledby="listing-cta-title">
              <h2 id="listing-cta-title">施設掲載をご希望の方へ</h2>
              <p>
                お問い合わせ種別で「施設掲載希望」を選択し、施設名と掲載を希望する内容をご記入ください。
              </p>
              <Link href="/contact" className="btn btn--primary">
                掲載について問い合わせる
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

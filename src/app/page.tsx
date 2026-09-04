import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import HomeFacilitySearch from "@/components/HomeFacilitySearch";
import SubsidySimulator from "@/components/SubsidySimulator";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "MamaPlace",
    locale: "ja_JP",
    title: "福岡の産後ケア施設を検索｜料金・公費助成も分かるMamaPlace",
    description:
      "福岡市の公費助成対象施設と福岡県内の自費ホテルをまとめて検索。公費助成利用時の自己負担額も手軽に分かります。",
    url: "/",
    images: [
      {
        url: "/assets/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MamaPlace｜福岡の産後ケア施設と公費助成がすぐわかる",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://mamaplace.jp/#website",
      url: "https://mamaplace.jp/",
      name: "MamaPlace",
      description:
        "産後のお母さんが最適なケアを受けられるよう、公費助成シミュレーターと施設マッチングを無料提供するWebプラットフォーム",
      inLanguage: "ja",
    },
    {
      "@type": "Organization",
      "@id": "https://mamaplace.jp/#organization",
      url: "https://mamaplace.jp/",
      name: "MamaPlace",
      description: "医療×美容の視点で、産後ケアの質を届けるWebプラットフォーム",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: "https://mamaplace.jp/contact/",
        availableLanguage: "Japanese",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://mamaplace.jp/#app",
      name: "MamaPlace",
      url: "https://mamaplace.jp/",
      applicationCategory: "HealthApplication",
      description: "公費助成シミュレーターと産後ケア施設マッチングを無料で提供",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
      operatingSystem: "Web",
      inLanguage: "ja",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="hero">
        <Image
          className="hero__image"
          src="/assets/images/home/mv.webp"
          alt="赤ちゃんを抱くお母さん"
          fill
          preload
          unoptimized
          sizes="(max-width: 767px) 100vw, 1200px"
        />
        <div className="hero__overlay" aria-hidden="true" />
        <div className="hero__inner">
          <div className="hero__main">
            <p className="hero__tag">助産師監修</p>
            <h1 className="hero__title">
              <span className="hero__title-lead">あなたの地域で利用できる</span>
              <span className="hero__title-accent">
                産後ケア<span>が見つかる。</span>
              </span>
            </h1>
            <p className="hero__subtitle">
              お住まいの地域や希望するケアに合わせて、
              <br className="hero__desktop-break" />
              <strong>利用できる助成制度</strong>と<strong>産後ケア施設</strong>をわかりやすくご案内します。
            </p>
          </div>

          <div className="hero__actions">
            <Link href="/search" className="hero__button hero__button--primary">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              施設を探す
            </Link>
          </div>

          <div className="hero__notices">
            <div className="hero__notice">
              <svg className="hero__notice-icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <div>
                <p className="hero__notice-title">福岡市にお住まいの方へ</p>
                <p className="hero__notice-text">
                  福岡市の助成対象施設と、福岡県内の産後ケアホテルを探せる検索サイトです。
                </p>
              </div>
            </div>
            <div className="hero__notice hero__notice--expansion">
              <svg className="hero__notice-icon" aria-hidden="true" viewBox="0 0 24 24">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M8 3v4M16 3v4M4 9h16" />
                <path d="M12 12v5M9.5 14.5h5" />
              </svg>
              <p className="hero__notice-title">順次対象エリア拡大予定！！</p>
            </div>
          </div>
        </div>
      </section>

      <HomeFacilitySearch />

      {/* Subsidy Section */}
      <section className="subsidy" id="subsidy">
        <div className="container">
          <div className="section-header section-header--numbered">
            <div className="numbered-section-heading">
              <span className="numbered-section-heading__number" aria-hidden="true">02</span>
              <span className="numbered-section-heading__divider" aria-hidden="true" />
              <h2 className="section-title">公費助成を調べる</h2>
            </div>
            <p className="section-desc">
              福岡市の産後ケア事業を利用した場合の自己負担額をシミュレーションできます。
            </p>
          </div>
          <SubsidySimulator />
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <div className="about__grid">
            <div className="about__content">
              <span className="section-tag">このサービスについて</span>
              <h2 className="section-title">
                助成対象施設も、
                <br />
                ホテルタイプもまとめて探せる
              </h2>
              <p className="about__text">
                MamaPlaceは、福岡市の公費助成を利用できる産後ケア施設と、助成対象外のホテルタイプの施設を、ひとつのサイトでまとめて探せるサービスです。
              </p>
              <p className="about__text">
                助成の対象かどうかに加えて、エリアやケアの種類などの条件を見比べながら、ご自身の希望に合う施設をわかりやすく探せます。
              </p>
              <div className="about__badges">
                <span className="badge">助産師監修</span>
                <span className="badge">医療法準拠</span>
                <span className="badge">個人情報保護</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

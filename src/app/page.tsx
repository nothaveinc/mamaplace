import Link from "next/link";
import QualityMetrics from "@/components/QualityMetrics";
import SubsidySimulator from "@/components/SubsidySimulator";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://mama-place.com/#website",
      url: "https://mama-place.com/",
      name: "MamaPlace",
      description:
        "産後のお母さんが最適なケアを受けられるよう、公費助成シミュレーターと施設マッチングを無料提供するWebプラットフォーム",
      inLanguage: "ja",
    },
    {
      "@type": "Organization",
      "@id": "https://mama-place.com/#organization",
      url: "https://mama-place.com/",
      name: "MamaPlace",
      description: "医療×美容の視点で、産後ケアの質を届けるWebプラットフォーム",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: "https://mama-place.com/contact",
        availableLanguage: "Japanese",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://mama-place.com/#app",
      name: "MamaPlace",
      url: "https://mama-place.com/",
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
        <div className="hero__content">
          <p className="hero__tag">助産師監修</p>
          <h1 className="hero__title">
            産後のあなたへ、
            <br />
            最適なケアを。
          </h1>
          <p className="hero__subtitle">
            住所・世帯状況・赤ちゃんの月齢を入力するだけで、あなたにぴったりの産後ケアと公費助成を即座にご提案します。
          </p>
          <div className="hero__actions">
            <Link href="/search" className="btn btn--primary">
              施設を探す
            </Link>
            <Link href="/#subsidy" className="btn btn--outline">
              助成額を調べる
            </Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">47</span>
              <span className="hero__stat-label">都道府県対応</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">
                500<small>+</small>
              </span>
              <span className="hero__stat-label">掲載施設</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">
                98<small>%</small>
              </span>
              <span className="hero__stat-label">ユーザー満足度</span>
            </div>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__illustration">
            <div className="hero__circle hero__circle--1"></div>
            <div className="hero__circle hero__circle--2"></div>
            <div className="hero__circle hero__circle--3"></div>
            <div className="hero__card">
              <div className="hero__card-icon">🌸</div>
              <p className="hero__card-text">公費助成の活用度</p>
              <div className="hero__card-meter">
                <div className="hero__card-fill" style={{ width: "65%" }} />
              </div>
              <p className="hero__card-result">自己負担を大きく軽減できます</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-card__icon">💰</div>
              <h3 className="feature-card__title">公費助成シミュレーター</h3>
              <p className="feature-card__desc">
                居住地に基づき、自己負担額と申請ステップ（窓口・オンライン等）を自動で提示します。
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🏥</div>
              <h3 className="feature-card__title">施設マッチング</h3>
              <p className="feature-card__desc">
                条件に合う施設の空き状況やリアルな口コミを掲載。あなたにぴったりの施設を見つけます。
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">⭐</div>
              <h3 className="feature-card__title">専門性の可視化</h3>
              <p className="feature-card__desc">
                各施設のケアの質やスタッフの専門性を独自の指標でわかりやすく図解します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subsidy Section */}
      <section className="subsidy" id="subsidy">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">STEP 1</span>
            <h2 className="section-title">公費助成シミュレーター</h2>
            <p className="section-desc">
              お住まいの地域の産後ケア助成制度を確認し、自己負担額をシミュレーションできます。
            </p>
          </div>
          <SubsidySimulator />
        </div>
      </section>

      {/* Facility Section */}
      <section className="facility">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">STEP 2</span>
            <h2 className="section-title">施設マッチング</h2>
            <p className="section-desc">
              あなたの条件に合った産後ケア施設を探しましょう。
            </p>
          </div>
          <div className="facility-teaser">
            <p className="facility-teaser__text">
              宿泊型・通所型・訪問型から、エリアやこだわり条件で絞り込んで施設を比較できます。空き状況や口コミ、料金もまとめてチェックできます。
            </p>
            <Link href="/search" className="btn btn--primary">
              施設を探す →
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <div className="about__grid">
            <div className="about__content">
              <span className="section-tag">このサービスについて</span>
              <h2 className="section-title">
                医療×美容の視点で、
                <br />
                産後ケアの質を届ける
              </h2>
              <p className="about__text">
                MamaPlaceは、美容皮膚科でのマネジメント経験を持つ専門家チームが運営しています。医療の専門性と、患者さんへの細やかな配慮を両立した視点で、各施設のケアの質を独自に評価しています。
              </p>
              <p className="about__text">
                産後のお母さんが、本当に必要なケアに出会えるよう、情報の透明性と使いやすさを追求し続けています。
              </p>
              <div className="about__badges">
                <span className="badge">助産師監修</span>
                <span className="badge">医療法準拠</span>
                <span className="badge">個人情報保護</span>
              </div>
            </div>
            <div className="about__visual">
              <QualityMetrics />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

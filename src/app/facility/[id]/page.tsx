import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubpageHero from "@/components/SubpageHero";
import { facilities, getFacilityById } from "@/data/facilities";
import { getPriceDisplay } from "@/data/fukuokaSubsidy";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return facilities.map((facility) => ({ id: facility.id }));
}

function ContactDetails({
  contact,
}: {
  contact: { phone?: string; note?: string };
}) {
  const url = contact.note?.match(/https?:\/\/[^\s）)]+/)?.[0];

  return (
    <span>
      {contact.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}
      {contact.phone && contact.note && <br />}
      {contact.note && url ? (
        <>
          {contact.note.split(url)[0]}
          <a href={url} target="_blank" rel="noreferrer">{url}</a>
          {contact.note.split(url)[1]}
        </>
      ) : (
        contact.note
      )}
    </span>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const facility = getFacilityById(id);
  if (!facility) return {};

  return {
    title: facility.name,
    description: facility.description,
    alternates: { canonical: `/facility/${id}` },
  };
}

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const facility = getFacilityById(id);

  if (!facility) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: facility.name,
    description: facility.description,
    address: {
      "@type": "PostalAddress",
      addressRegion: facility.prefecture,
      addressLocality: facility.addressDetail,
    },
  };
  const price = getPriceDisplay(facility, {
    subsidyOn: true,
    freeMode: false,
    residenceOutside: !facility.isInFukuokaCity,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubpageHero title={facility.name} path={`/facility/${facility.id}`} />
      <div className="subpage-main">
        <div className="container">
          <div className="facility-detail__top">
            <div className="facility-detail__photo">
              <span>{facility.icon}</span>
              <span
                className={`facility-detail__badge availability-badge availability-badge--${
                  facility.availability === "ok" ? "green" : "yellow"
                }`}
              >
                {facility.availability === "ok" ? "空きあり" : "残りわずか"}
              </span>
            </div>

            <div className="facility-detail__body">
              <div className="facility-detail__types">
                {facility.careTypes.map((careType) => (
                  <span className="facility-detail__type" key={careType}>
                    {careType}
                  </span>
                ))}
              </div>
              <p className="facility-detail__location">
                📍 {facility.prefecture}
                {facility.addressDetail}
              </p>
              <div className="tags">
                {facility.features.map((feat) => (
                  <span
                    key={feat}
                    className={`tag ${
                      feat === "公費助成対象" ? "tag--secondary" : "tag--primary"
                    }`}
                  >
                    {feat}
                  </span>
                ))}
              </div>
              <p className={`facility-detail__price${price.isInquiry ? " is-inquiry" : ""}`}>
                {price.label}
              </p>
              <div className="facility-detail__actions">
                <Link href="/search" className="btn btn--outline">
                  施設を探す一覧に戻る
                </Link>
                <Link href="/contact" className="btn btn--primary">
                  お問い合わせ
                </Link>
              </div>
            </div>
          </div>

          <section className="facility-detail__section">
            <h2>施設について</h2>
            <p className="facility-detail__description">{facility.description}</p>
          </section>

          <section className="facility-detail__section">
            <h2>基本情報</h2>
            <div className="facility-detail__meta-list">
              <div className="facility-detail__meta-row">
                <span className="facility-detail__meta-label">対象月齢</span>
                <span>{facility.ageLimit}</span>
              </div>
              <div className="facility-detail__meta-row">
                <span className="facility-detail__meta-label">連絡先</span>
                <ContactDetails contact={facility.contact} />
              </div>
            </div>
          </section>

          <section className="facility-detail__section">
            <h2>口コミ</h2>
            <div className="review-list">
              <p className="review-placeholder">レビュー準備中です。</p>
            </div>
          </section>

          <div className="facility-detail__footer-cta">
            <Link href="/search" className="btn btn--outline">
              施設を探す一覧に戻る
            </Link>
            <Link href="/contact" className="btn btn--primary">
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

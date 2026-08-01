"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchFacilities, getFacilityById, type Facility } from "@/data/facilities";
import { getPriceDisplay } from "@/data/fukuokaSubsidy";

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

export default function FacilityDetail({ initialFacility }: { initialFacility: Facility }) {
  const [facility, setFacility] = useState<Facility>(initialFacility);

  useEffect(() => {
    let cancelled = false;

    fetchFacilities()
      .then((facilities) => {
        const fresh = getFacilityById(initialFacility.id, facilities);
        if (!cancelled && fresh) {
          setFacility(fresh);
        }
      })
      .catch(() => {
        // 取得に失敗した場合はビルド時点のデータをそのまま表示する
      });

    return () => {
      cancelled = true;
    };
  }, [initialFacility.id]);

  const price = getPriceDisplay(facility, {
    residence: facility.subsidyApplicable ? "福岡市" : "施設所在地外",
  });

  return (
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
  );
}

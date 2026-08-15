"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { fetchFacilities, getFacilityById, type Facility } from "@/data/facilities";
import { getFacilityDetailPriceDisplay } from "@/data/fukuokaSubsidy";
import FacilityGallery, { type GalleryImageSource } from "@/components/FacilityGallery";
import FacilityHighlightCards from "@/components/FacilityHighlightCards";
import {
  PREVIEW_CANCELLATION_POLICY,
  PREVIEW_PARKING,
} from "@/data/previewSampleContent";
import demo1 from "@/assets/facility-demo/demo-1.svg";
import demo2 from "@/assets/facility-demo/demo-2.svg";
import demo3 from "@/assets/facility-demo/demo-3.svg";
import demo4 from "@/assets/facility-demo/demo-4.svg";

const DEMO_IMAGES = [demo1, demo2, demo3, demo4];

const CARE_TYPE_LABEL = {
  宿泊型: "宿泊",
  通所型: "日帰り",
  訪問型: "訪問",
} as const;

type ContactLink = {
  label: string;
  icon: string;
  href: string;
  external?: boolean;
};

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

function ContactCard({
  contactLinks,
  className,
}: {
  contactLinks: ContactLink[];
  className: string;
}) {
  return (
    <aside className={`facility-detail__contact-card ${className}`}>
      <h2>予約・お問い合わせ</h2>
      <p>ご希望の方法でご連絡ください。</p>
      <div className="facility-detail__contact-links">
        {contactLinks.map((link) => (
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            key={link.label}
          >
            <span aria-hidden="true">{link.icon}</span>
            <span>{link.label}</span>
            <span aria-hidden="true">›</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

export default function FacilityDetail({ initialFacility }: { initialFacility: Facility }) {
  const [facility, setFacility] = useState<Facility>(initialFacility);
  const [isPreview, setIsPreview] = useState(false);
  const [returnSearchQuery, setReturnSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    const previewRequested = new URLSearchParams(window.location.search).get("preview") === "1";

    queueMicrotask(() => {
      if (!cancelled) setIsPreview(previewRequested);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnParams = new URLSearchParams();
    const page = Number(params.get("page"));
    if (Number.isInteger(page) && page > 1) returnParams.set("page", String(page));
    if (params.get("favorites") === "1") returnParams.set("favorites", "1");

    queueMicrotask(() => {
      setReturnSearchQuery(returnParams.toString());
    });
  }, []);

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

  const price = getFacilityDetailPriceDisplay(facility);
  const galleryImages: GalleryImageSource[] =
    facility.photos.length > 0 ? facility.photos : DEMO_IMAGES;
  const contactLinks: ContactLink[] = [];
  if (facility.contact.phone) {
    contactLinks.push({ label: "電話", icon: "📞", href: `tel:${facility.contact.phone}` });
  }
  if (facility.contact.website) {
    contactLinks.push({ label: "公式サイト", icon: "🌐", href: facility.contact.website, external: true });
  }
  if (facility.contact.instagram) {
    contactLinks.push({ label: "Instagram", icon: "📷", href: facility.contact.instagram, external: true });
  }
  if (facility.contact.line) {
    contactLinks.push({ label: "LINE", icon: "💬", href: facility.contact.line, external: true });
  }
  if (facility.contact.email) {
    contactLinks.push({ label: "メール", icon: "✉️", href: `mailto:${facility.contact.email}` });
  }
  const basicInfoRows: { label: string; value: ReactNode; hasValue: boolean }[] = [
    {
      label: "連絡先",
      value: <ContactDetails contact={facility.contact} />,
      hasValue: Boolean(facility.contact.phone?.trim() || facility.contact.note?.trim()),
    },
    {
      label: "住所",
      value: `福岡県${facility.addressDetail}`,
      hasValue: Boolean(facility.addressDetail.trim()),
    },
    {
      label: "対象月齢",
      value: facility.ageLimit,
      hasValue: Boolean(facility.ageLimit.trim()),
    },
    {
      label: "提供しているケアのタイプ",
      value: (
        <div className="facility-detail__types">
          {facility.careTypes.map((careType) => (
            <span
              className={`facility-detail__type facility-detail__care-type--${careType}`}
              key={careType}
            >
              {CARE_TYPE_LABEL[careType]}
            </span>
          ))}
        </div>
      ),
      hasValue: facility.careTypes.length > 0,
    },
    {
      label: "価格の目安",
      value: (
        <div className="facility-detail__price">
          {price.lines.map((line) => <p key={line}>{line}</p>)}
          {price.note && <small>{price.note}</small>}
        </div>
      ),
      hasValue: price.lines.length > 0,
    },
    {
      label: "駐車場",
      value: isPreview ? (
        <>
          <p>{PREVIEW_PARKING.value}</p>
          <small>{PREVIEW_PARKING.note}</small>
        </>
      ) : null,
      hasValue: isPreview,
    },
    {
      label: "キャンセルポリシー",
      value: isPreview ? (
        <div className="facility-detail__multiline-info">
          {PREVIEW_CANCELLATION_POLICY.lines.map((line) => <p key={line}>{line}</p>)}
          <small>{PREVIEW_CANCELLATION_POLICY.note}</small>
        </div>
      ) : null,
      hasValue: isPreview,
    },
  ];

  return (
    <div className="subpage-main">
      <div className="container">
        <div
          className={`facility-detail__top${
            contactLinks.length === 0 ? " facility-detail__top--no-contact" : ""
          }`}
        >
          <FacilityGallery
            images={galleryImages}
            facilityName={facility.name}
            key={galleryImages
              .map((image) => (typeof image === "string" ? image : image.src))
              .join("|")}
          />

          <div className="facility-detail__body">
            {facility.subsidyApplicable && (
              <span className="facility-detail__subsidy-label">公費助成対象</span>
            )}
            <div className="facility-detail__info-group">
              <h3>対応ケア</h3>
              <div className="facility-detail__types">
                {facility.careTypes.map((careType) => (
                  <span
                    className={`facility-detail__type facility-detail__care-type--${careType}`}
                    key={careType}
                  >
                    {CARE_TYPE_LABEL[careType]}
                  </span>
                ))}
              </div>
            </div>
            <div className="facility-detail__info-group">
              <h3>対象月齢</h3>
              <p>{facility.ageLimit}</p>
            </div>
            <div className="facility-detail__info-group">
              <h3>価格の目安</h3>
              <div className="facility-detail__price">
                {price.lines.map((line) => <p key={line}>{line}</p>)}
                {price.note && <small>{price.note}</small>}
              </div>
            </div>
          </div>

          {contactLinks.length > 0 && (
            <ContactCard contactLinks={contactLinks} className="facility-detail__contact-card--desktop" />
          )}
        </div>

        <section className="facility-detail__section">
          <h2>施設について</h2>
          <p className="facility-detail__description">{facility.description}</p>
        </section>

        <section className="facility-detail__section">
          <h2>基本情報</h2>
          <div className="facility-detail__meta-list">
            {basicInfoRows.filter((row) => row.hasValue).map((row) => (
              <div className="facility-detail__meta-row" key={row.label}>
                <span className="facility-detail__meta-label">{row.label}</span>
                <div className="facility-detail__meta-value">{row.value}</div>
              </div>
            ))}
          </div>
        </section>

        {facility.subsidyApplicable && (
          <section className="facility-detail__section">
            <details className="facility-detail__subsidy-details">
              <summary>
                <span>ご利用について（公費助成の条件）</span>
                <span className="facility-detail__subsidy-icon" aria-hidden="true">▾</span>
              </summary>
              <div className="facility-detail__subsidy-content">
                <p className="facility-detail__subsidy-heading">
                  福岡市の産後ケア事業の対象となる方
                </p>
                <p>次のすべてに該当する方</p>
                <ul className="facility-detail__subsidy-list">
                  <li>福岡市内に住民票がある方</li>
                  <li>
                    生後1年未満の赤ちゃんとそのお母さん または 流産・死産を経験して1年未満の女性（妊婦を除く）
                    <p className="facility-detail__subsidy-note">
                      注）事業者によって受け入れ可能な月齢が異なります。
                    </p>
                  </li>
                  <li>
                    赤ちゃん、お母さん共に医療行為の必要がない方
                    <p className="facility-detail__subsidy-note">
                      注）発熱や喉の痛みがある場合などのご利用はお控えください。
                    </p>
                  </li>
                </ul>
                <p>
                  出典：<a href="https://kodomo.city.fukuoka.lg.jp/info/1961/" target="_blank" rel="noreferrer">福岡市 産後ケア事業</a>
                </p>
              </div>
            </details>
          </section>
        )}

        {isPreview && <FacilityHighlightCards />}

        {contactLinks.length > 0 && (
          <ContactCard contactLinks={contactLinks} className="facility-detail__contact-card--mobile" />
        )}

        <div className="facility-detail__footer-cta">
          <Link href={`/search${returnSearchQuery ? `?${returnSearchQuery}` : ""}#facility-${facility.id}`} className="btn btn--outline">
            施設一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

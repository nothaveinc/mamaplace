import type { Metadata } from "next";
import Link from "next/link";
import SubpageHero from "@/components/SubpageHero";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "MamaPlaceへのお問い合わせはこちらから。施設情報・公費助成・施設掲載についてのご質問を受け付けています。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SubpageHero title="お問い合わせ" path="/contact" />
      <div className="subpage-main">
        <div className="container">
          <div className="contact-grid">
            <aside className="contact-info">
              <h3>よくあるお問い合わせ</h3>
              <ul className="quick-links">
                <li>
                  <Link href="/faq#subsidy">助成額について</Link>
                </li>
                <li>
                  <Link href="/faq#facility">施設について</Link>
                </li>
                <li>
                  <Link href="/listing">掲載について</Link>
                </li>
              </ul>
              <p className="contact-info__note">
                お問い合わせ内容を送信いただいてから、<strong>3営業日以内</strong>
                にご返信いたします。
                <br />
                <br />
                内容によってはお時間をいただく場合がございますので、あらかじめご了承ください。
              </p>
            </aside>

            <div className="contact-form-wrap">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

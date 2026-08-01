import type { Metadata } from "next";
import Link from "next/link";
import SubpageHero from "@/components/SubpageHero";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  alternates: { canonical: "/tokutei" },
  robots: { index: false, follow: true },
};

const rows: [string, React.ReactNode][] = [
  ["事業者名", "MamaPlace運営事務局"],
  ["所在地", "お問い合わせいただいた方に開示いたします"],
  ["電話番号", "お問い合わせいただいた方に開示いたします"],
  ["メールアドレス", "nothave.inc@gmail.com"],
  ["代表者", "非公開"],
  ["販売価格", "施設掲載プランは各プランページに記載の通り"],
  [
    "支払方法",
    "クレジットカード（Visa / Mastercard / JCB / American Express）、銀行振込",
  ],
  [
    "支払時期",
    <>
      クレジットカード：月次自動引き落とし
      <br />
      銀行振込：請求書発行後14日以内
    </>,
  ],
  ["サービス提供時期", "お申し込み確認後、審査完了次第（通常1〜2週間）"],
  [
    "返金・キャンセル",
    "月途中のキャンセルは翌月末での解約となります。すでにお支払いいただいた料金の返金はいたしかねます。",
  ],
  ["動作環境", "Chrome / Safari / Firefox / Edge 最新版推奨"],
  ["その他", "本サービスは情報提供を目的とし、医療行為の提供ではありません。"],
];

export default function TokuteiPage() {
  return (
    <>
      <SubpageHero title="特定商取引法に基づく表記" path="/tokutei" />
      <div className="subpage-main">
        <div className="container">
          <div className="legal-content">
            <div className="tokutei-note">
              <p>
                MamaPlaceの一般ユーザー向けサービス（公費助成シミュレーター・施設検索）はすべて無料でご利用いただけます。本表記は、施設掲載プランに関する特定商取引法上の表記です。
              </p>
            </div>

            <table>
              <tbody>
                {rows.map(([th, td]) => (
                  <tr key={th}>
                    <th>{th}</th>
                    <td>{td}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2>施設掲載プランについて</h2>
            <p>
              MamaPlaceでは、産後ケア施設を対象とした有料の施設掲載プランを提供しています。掲載プランの詳細・料金については、施設掲載のご案内ページをご参照ください。
            </p>
            <p>
              掲載プランのお申し込みにあたっては、当サービスが定める審査基準を満たす必要があります。審査の結果によってはお申し込みをお断りする場合があります。
            </p>

            <h2>お問い合わせ</h2>
            <p>
              本表記に関するご質問・掲載プランのお申し込みに関するご相談は、以下よりお問い合わせください。
            </p>
            <p>
              <Link href="/contact" className="legal-link--strong">
                お問い合わせフォームはこちら
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

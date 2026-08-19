import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="footer__logo">MamaPlace</p>
            <p className="footer__tagline">産後のあなたへ、最適なケアを。</p>
            <p className="footer__note">
              ※本サービスは医療行為の提供ではありません。
              <br />
              施設選びの参考情報としてご活用ください。
            </p>
          </div>
          <div className="footer__links">
            <h4>サービス</h4>
            <ul>
              <li>
                <Link href="/#subsidy">公費シミュレーター</Link>
              </li>
              <li>
                <Link href="/search">施設を探す</Link>
              </li>
            </ul>
          </div>
          <div className="footer__links">
            <h4>サポート</h4>
            <ul>
              <li>
                <Link href="/faq">よくある質問</Link>
              </li>
              <li>
                <Link href="/contact">お問い合わせ</Link>
              </li>
              <li>
                <Link href="/listing">施設掲載について</Link>
              </li>
            </ul>
          </div>
          <div className="footer__links">
            <h4>法的情報</h4>
            <ul>
              <li>
                <Link href="/privacy">プライバシーポリシー</Link>
              </li>
              <li>
                <Link href="/terms">利用規約</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© 2026 MamaPlace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";
import "./style.css";
import "./subpage.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mama-place.com"),
  title: {
    default: "MamaPlace｜公費助成・施設マッチング",
    template: "%s｜MamaPlace",
  },
  description:
    "産後のお母さんへ。公費助成シミュレーターと産後ケア施設マッチングを無料提供。住所と月齢を入力するだけで、あなたに最適なケアと助成額を即座にご提案。全国47都道府県・500施設以上対応。",
  openGraph: {
    type: "website",
    siteName: "MamaPlace",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

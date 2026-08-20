import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GoogleAnalyticsConsent from "@/components/GoogleAnalyticsConsent";
import "./globals.css";
import "./style.css";
import "./subpage.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mamaplace.jp"),
  title: {
    default: "MamaPlace｜福岡の産後ケア施設検索・公費助成シミュレーター",
    template: "%s｜MamaPlace",
  },
  description:
    "福岡市の公費助成対象となる産後ケア施設と、福岡県内の自費ホテルをまとめて検索。公費助成を利用した場合の自己負担額も手軽にシミュレーションできます。",
  openGraph: {
    type: "website",
    siteName: "MamaPlace",
    locale: "ja_JP",
    title: "MamaPlace｜福岡の産後ケア施設検索・公費助成シミュレーター",
    description:
      "福岡市の公費助成対象施設と福岡県内の自費ホテルをまとめて検索。公費助成利用時の自己負担額も手軽に分かります。",
    images: [
      {
        url: "/assets/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MamaPlace｜産後ケア施設と公費助成がすぐわかる",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MamaPlace｜福岡の産後ケア施設検索・公費助成シミュレーター",
    description:
      "福岡市の公費助成対象施設と福岡県内の自費ホテルをまとめて検索できます。",
    images: ["/assets/images/og-image.png"],
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
        <GoogleAnalyticsConsent />
      </body>
    </html>
  );
}

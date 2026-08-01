import Link from "next/link";

type Props = {
  title: string;
  path: string;
};

export default function SubpageHero({ title, path }: Props) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: "https://mama-place.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: `https://mama-place.com${path}`,
      },
    ],
  };

  return (
    <section className="subpage-hero">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container">
        <nav className="breadcrumb" aria-label="パンくずリスト">
          <ol>
            <li>
              <Link href="/">ホーム</Link>
            </li>
            <li>{title}</li>
          </ol>
        </nav>
        <h1 className="subpage-hero__title">{title}</h1>
      </div>
    </section>
  );
}

import Link from "next/link";

type Props = {
  title: string;
  path: string;
  parent?: { name: string; href: string };
};

export default function SubpageHero({ title, path, parent }: Props) {
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
      ...(parent ? [{
        "@type": "ListItem",
        position: 2,
        name: parent.name,
        item: `https://mama-place.com${parent.href}`,
      }] : []),
      {
        "@type": "ListItem",
        position: parent ? 3 : 2,
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
            {parent && (
              <li>
                <Link href={parent.href}>{parent.name}</Link>
              </li>
            )}
            <li>{title}</li>
          </ol>
        </nav>
        <h1 className="subpage-hero__title">{title}</h1>
      </div>
    </section>
  );
}

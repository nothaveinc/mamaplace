import Link from "next/link";

type Props = {
  title: string;
  path: string;
  parent?: { name: string; href: string };
  className?: string;
  titleClassName?: string;
};

function getAbsolutePageUrl(path: string) {
  const normalizedPath = path === "/" ? "/" : `${path.replace(/\/$/, "")}/`;
  return `https://mamaplace.jp${normalizedPath}`;
}

export default function SubpageHero({ title, path, parent, className, titleClassName }: Props) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: "https://mamaplace.jp/",
      },
      ...(parent ? [{
        "@type": "ListItem",
        position: 2,
        name: parent.name,
        item: getAbsolutePageUrl(parent.href),
      }] : []),
      {
        "@type": "ListItem",
        position: parent ? 3 : 2,
        name: title,
        item: getAbsolutePageUrl(path),
      },
    ],
  };

  return (
    <section className={`subpage-hero${className ? ` ${className}` : ""}`}>
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
        <h1 className={`subpage-hero__title${titleClassName ? ` ${titleClassName}` : ""}`}>{title}</h1>
      </div>
    </section>
  );
}

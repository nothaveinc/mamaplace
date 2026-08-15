"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";

const links = [
  { href: "/#subsidy", label: "公費シミュレーター" },
  { href: "/search", label: "施設を探す" },
  { href: "/search?favorites=1", label: "お気に入り" },
  { href: "/#about", label: "このサービスについて" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const reloadFavoriteSearch = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.assign(event.currentTarget.href);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nav__mobile") && !target.closest(".nav__menu-btn")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [menuOpen]);

  return (
    <nav className={`nav${scrolled ? " nav--scrolled" : ""}`} id="nav">
      <div className="nav__inner">
        <Link href="/" className="nav__logo">
          MamaPlace
        </Link>
        <ul className="nav__links">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={link.href.includes("favorites=1") ? reloadFavoriteSearch : undefined}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className={`nav__menu-btn${menuOpen ? " is-active" : ""}`}
          aria-label="メニュー"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className={`nav__mobile${menuOpen ? " is-open" : ""}`}>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={(event) => {
                  setMenuOpen(false);
                  if (link.href.includes("favorites=1")) reloadFavoriteSearch(event);
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { announceDrawerOpen, subscribeToDrawerOpen } from "@/lib/drawerEvents";

const links = [
  { href: "/#subsidy", label: "公費シミュレーター", icon: "subsidy" },
  { href: "/search", label: "施設を探す", icon: "search" },
  { href: "/search.html?favorites=1", label: "お気に入り", icon: "favorite" },
  { href: "/#about", label: "このサービスについて", icon: "about" },
];

function MenuIcon({ name }: { name: string }) {
  if (name === "subsidy") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3l5 8 5-8M7 11h10M7 15h10M12 11v10" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.5 15.5L21 21" />
      </svg>
    );
  }

  if (name === "favorite") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.6a5.4 5.4 0 00-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 00-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 000-7.6z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
    return subscribeToDrawerOpen((drawer) => {
      if (drawer !== "navigation") setMenuOpen(false);
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
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
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => {
            if (menuOpen) {
              setMenuOpen(false);
              return;
            }
            announceDrawerOpen("navigation");
            setMenuOpen(true);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <button
        className={`nav__overlay${menuOpen ? " is-open" : ""}`}
        type="button"
        aria-label="メニューを閉じる"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`nav__mobile${menuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        role="dialog"
        aria-label="メニュー"
        aria-modal={menuOpen ? "true" : undefined}
        aria-hidden={!menuOpen}
      >
        <div className="nav__mobile-header">
          <Link
            href="/"
            className="nav__mobile-logo"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            MamaPlace
          </Link>
          <button
            ref={closeButtonRef}
            className="nav__mobile-close"
            type="button"
            aria-label="メニューを閉じる"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
        <div className="nav__mobile-body">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={(event) => {
                    setMenuOpen(false);
                    if (link.href.includes("favorites=1")) reloadFavoriteSearch(event);
                  }}
                >
                  <span className="nav__mobile-icon">
                    <MenuIcon name={link.icon} />
                  </span>
                  <span className="nav__mobile-label">{link.label}</span>
                  <svg className="nav__mobile-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="nav__mobile-copyright">© MamaPlace</p>
      </div>
    </nav>
  );
}

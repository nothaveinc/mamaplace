"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const MEASUREMENT_ID = "G-2939F0GZF5";
const CONSENT_STORAGE_KEY = "mamaplace-analytics-consent";
const OPEN_SETTINGS_EVENT = "mamaplace:open-cookie-settings";
const CONSENT_CHANGED_EVENT = "mamaplace:cookie-consent-changed";

type AnalyticsConsent = "granted" | "denied" | null;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

function prepareGtag() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: unknown[]) => {
    window.dataLayer?.push(args);
  });
}

function updateGoogleConsent(analyticsStorage: "granted" | "denied") {
  prepareGtag();
  window.gtag?.("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function clearGoogleAnalyticsCookies() {
  const rootDomain = window.location.hostname.replace(/^www\./, "");

  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("_ga")) return;

    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${rootDomain}; SameSite=Lax`;
  });
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
  };
}

function getStoredConsent(): AnalyticsConsent {
  const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return storedConsent === "granted" || storedConsent === "denied"
    ? storedConsent
    : null;
}

function getServerConsent(): AnalyticsConsent {
  return null;
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="footer__cookie-settings"
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
    >
      Cookie設定
    </button>
  );
}

export default function GoogleAnalyticsConsent() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getStoredConsent,
    getServerConsent,
  );
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const analyticsInitialized = useRef(false);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    prepareGtag();
    window.gtag?.("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }, []);

  useEffect(() => {
    if (consent !== "granted") {
      updateGoogleConsent("denied");
      return;
    }

    updateGoogleConsent("granted");
    if (!analyticsInitialized.current) {
      analyticsInitialized.current = true;
      window.gtag?.("js", new Date());
      window.gtag?.("config", MEASUREMENT_ID);
    }
  }, [consent]);

  useEffect(() => {
    const openSettings = () => setIsBannerOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    if (consent === "granted") {
      window.gtag?.("event", "page_view", {
        page_location: window.location.href,
        page_path: pathname,
      });
    }
  }, [consent, pathname]);

  const saveConsent = (nextConsent: Exclude<AnalyticsConsent, null>) => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, nextConsent);
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    setIsBannerOpen(false);

    if (nextConsent === "denied") clearGoogleAnalyticsCookies();
  };

  return (
    <>
      {consent === "granted" && (
        <Script
          id="google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      )}

      {(consent === null || isBannerOpen) && (
        <section
          className="cookie-consent"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          <div className="cookie-consent__inner">
            <div className="cookie-consent__content">
              <h2 id="cookie-consent-title">Cookieの利用について</h2>
              <p id="cookie-consent-description">
                サービス改善のため、Google Analyticsによるアクセス解析を利用します。同意するまで解析用Cookieは使用しません。
                <Link href="/privacy">プライバシーポリシー</Link>
              </p>
            </div>
            <div className="cookie-consent__actions">
              <button
                type="button"
                className="cookie-consent__button cookie-consent__button--decline"
                onClick={() => saveConsent("denied")}
              >
                拒否する
              </button>
              <button
                type="button"
                className="cookie-consent__button cookie-consent__button--accept"
                onClick={() => saveConsent("granted")}
              >
                同意する
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

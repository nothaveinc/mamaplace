"use client";

import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  GOOGLE_ANALYTICS_ID,
  GOOGLE_ANALYTICS_OPT_OUT_EVENT,
  GOOGLE_ANALYTICS_OPT_OUT_KEY,
  getGoogleAnalyticsDisableKey,
} from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function subscribeToOptOut(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(GOOGLE_ANALYTICS_OPT_OUT_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(GOOGLE_ANALYTICS_OPT_OUT_EVENT, onStoreChange);
  };
}

function getStoredOptOut() {
  try {
    return window.localStorage.getItem(GOOGLE_ANALYTICS_OPT_OUT_KEY) === "true";
  } catch {
    return false;
  }
}

function getServerOptOut() {
  return false;
}

function setGoogleAnalyticsDisabled(disabled: boolean) {
  const analyticsWindow = window as unknown as Record<string, unknown>;
  analyticsWindow[getGoogleAnalyticsDisableKey()] = disabled;
}

function getSanitizedReferrer() {
  if (!document.referrer) return "";

  try {
    const referrer = new URL(document.referrer);
    referrer.search = "";
    referrer.hash = "";
    return referrer.toString();
  } catch {
    return "";
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const isOptedOut = useSyncExternalStore(
    subscribeToOptOut,
    getStoredOptOut,
    getServerOptOut,
  );
  const initialized = useRef(false);
  const lastTrackedPathname = useRef<string | null>(null);

  useEffect(() => {
    const storedOptOut = getStoredOptOut();
    setGoogleAnalyticsDisabled(storedOptOut);
    if (storedOptOut || isOptedOut) {
      lastTrackedPathname.current = null;
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? function gtag() {
      // Google公式スニペットと同じArgumentsオブジェクトをキューへ渡す必要がある。
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

    if (!initialized.current) {
      initialized.current = true;
      window.gtag("js", new Date());
      window.gtag("config", GOOGLE_ANALYTICS_ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
    }

    if (lastTrackedPathname.current === pathname) return;
    lastTrackedPathname.current = pathname;
    window.gtag("event", "page_view", {
      page_location: `${window.location.origin}${pathname}`,
      page_path: pathname,
      page_title: document.title,
      page_referrer: getSanitizedReferrer(),
    });
  }, [isOptedOut, pathname]);

  return (
    <Script
      id="google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
      strategy="afterInteractive"
    />
  );
}

"use client";

import { useSyncExternalStore } from "react";
import {
  GOOGLE_ANALYTICS_OPT_OUT_EVENT,
  GOOGLE_ANALYTICS_OPT_OUT_KEY,
  getGoogleAnalyticsDisableKey,
} from "@/lib/analytics";

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

export default function AnalyticsOptOut() {
  const isOptedOut = useSyncExternalStore(
    subscribeToOptOut,
    getStoredOptOut,
    getServerOptOut,
  );

  const updateOptOut = () => {
    const nextValue = !isOptedOut;
    try {
      window.localStorage.setItem(GOOGLE_ANALYTICS_OPT_OUT_KEY, String(nextValue));
    } catch {
      return;
    }
    const analyticsWindow = window as unknown as Record<string, unknown>;
    analyticsWindow[getGoogleAnalyticsDisableKey()] = nextValue;
    window.dispatchEvent(new Event(GOOGLE_ANALYTICS_OPT_OUT_EVENT));
  };

  return (
    <div className="analytics-opt-out" aria-live="polite">
      <p>現在、アクセス解析は{isOptedOut ? "停止中" : "有効"}です。</p>
      <button type="button" onClick={updateOptOut}>
        アクセス解析を{isOptedOut ? "有効にする" : "停止する"}
      </button>
    </div>
  );
}

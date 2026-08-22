export const GOOGLE_ANALYTICS_ID = "G-2939F0GZF5";
export const GOOGLE_ANALYTICS_OPT_OUT_KEY = "mamaplace-analytics-opt-out";
export const GOOGLE_ANALYTICS_OPT_OUT_EVENT = "mamaplace:analytics-opt-out-changed";

export function getGoogleAnalyticsDisableKey() {
  return `ga-disable-${GOOGLE_ANALYTICS_ID}`;
}

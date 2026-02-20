// Default to false if set to anything other than "true" or unset
export const IS_RUNNING_ON_CLOUD =
  import.meta.env.VITE_IS_DEPLOYED === "true" || false;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function getRuntimeHttpBase(): string {
  // Empty string => use same-origin relative requests (e.g. `/api/...`).
  if (typeof window === "undefined") return "http://127.0.0.1:7001";
  return "";
}

function getRuntimeWsBase(): string {
  if (typeof window === "undefined") return "ws://127.0.0.1:7001";
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}`;
}

export const WS_BACKEND_URL = isNonEmptyString(import.meta.env.VITE_WS_BACKEND_URL)
  ? import.meta.env.VITE_WS_BACKEND_URL
  : getRuntimeWsBase();

export const HTTP_BACKEND_URL = isNonEmptyString(import.meta.env.VITE_HTTP_BACKEND_URL)
  ? import.meta.env.VITE_HTTP_BACKEND_URL
  : getRuntimeHttpBase();

export const PICO_BACKEND_FORM_SECRET =
  import.meta.env.VITE_PICO_BACKEND_FORM_SECRET || null;

export const API_KEY_DAILY_GENERATION_LIMIT =
  Number(import.meta.env.VITE_API_KEY_DAILY_GENERATION_LIMIT) || 10;

export const API_KEY_DAILY_GENERATION_COUNTER_STORAGE_KEY =
  "api-key-daily-generation-counter";

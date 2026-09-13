const VISITOR_KEY_FULL = "prabhix_vk";
const VISITOR_KEY_MINIMAL = "prabhix_vk_session";
const SESSION_ID_KEY = "prabhix_sid";
const FIRST_TOUCH_UTM_KEY = "prabhix_ft_utm";
const FIRST_TOUCH_REF_KEY = "prabhix_ft_ref";

function safeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    /* ignore quota errors */
  }
}

function safeRemove(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function readVisitorKey(fullConsent: boolean): string | null {
  if (fullConsent) {
    return safeGet(localStorage, VISITOR_KEY_FULL);
  }
  return safeGet(sessionStorage, VISITOR_KEY_MINIMAL);
}

export function writeVisitorKey(key: string, fullConsent: boolean): void {
  if (fullConsent) {
    safeSet(localStorage, VISITOR_KEY_FULL, key);
    safeRemove(sessionStorage, VISITOR_KEY_MINIMAL);
    return;
  }
  safeSet(sessionStorage, VISITOR_KEY_MINIMAL, key);
}

/** After the BFF cookie is set, drop keys that used to live in web storage. */
export function dropLegacyVisitorKeys(): void {
  safeRemove(localStorage, VISITOR_KEY_FULL);
  safeRemove(sessionStorage, VISITOR_KEY_MINIMAL);
}

export function readSessionId(): string | null {
  return safeGet(sessionStorage, SESSION_ID_KEY);
}

export function writeSessionId(id: string): void {
  safeSet(sessionStorage, SESSION_ID_KEY, id);
}

export function readFirstTouchUtm(): Record<string, string> | null {
  const raw = safeGet(localStorage, FIRST_TOUCH_UTM_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed;
  } catch {
    return null;
  }
}

export function writeFirstTouchUtm(utm: Record<string, string>): void {
  safeSet(localStorage, FIRST_TOUCH_UTM_KEY, JSON.stringify(utm));
}

export function readFirstTouchReferrer(): string | null {
  return safeGet(localStorage, FIRST_TOUCH_REF_KEY);
}

export function writeFirstTouchReferrer(referrer: string): void {
  safeSet(localStorage, FIRST_TOUCH_REF_KEY, referrer);
}

export function clearTrackingIdentifiers(): void {
  safeRemove(localStorage, VISITOR_KEY_FULL);
  safeRemove(localStorage, FIRST_TOUCH_UTM_KEY);
  safeRemove(localStorage, FIRST_TOUCH_REF_KEY);
  safeRemove(sessionStorage, VISITOR_KEY_MINIMAL);
  safeRemove(sessionStorage, SESSION_ID_KEY);
}

export function createEphemeralKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

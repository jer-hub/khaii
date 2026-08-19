"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "our-journey:redeemed-coupons";
const EVENT = "our-journey:coupons";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

function parseIds(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function useRedeemedCoupons() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const redeemed = useMemo(() => new Set(parseIds(raw)), [raw]);

  const redeem = useCallback(
    (id: string) => {
      if (redeemed.has(id)) return;
      const next = [...redeemed, id];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(EVENT));
    },
    [redeemed],
  );

  const isRedeemed = useCallback((id: string) => redeemed.has(id), [redeemed]);

  return { redeemed, redeem, isRedeemed, ready: true };
}

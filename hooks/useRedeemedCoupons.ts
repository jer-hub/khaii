"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "our-journey:redeemed-coupons";

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function useRedeemedCoupons() {
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRedeemed(new Set(readStored()));
    setReady(true);
  }, []);

  const redeem = useCallback((id: string) => {
    setRedeemed((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isRedeemed = useCallback((id: string) => redeemed.has(id), [redeemed]);

  return { redeemed, redeem, isRedeemed, ready };
}

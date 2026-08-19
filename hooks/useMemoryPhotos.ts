"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "our-journey:memory-photos";
const EVENT = "our-journey:memory-photos";

function parse(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(EVENT, onStoreChange);
  };
}

export function useMemoryPhotos() {
  const raw = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(STORAGE_KEY),
    () => null,
  );
  const photos = useMemo(() => parse(raw), [raw]);

  const setPhoto = useCallback((id: string, dataUrl: string) => {
    const next = { ...parse(window.localStorage.getItem(STORAGE_KEY)), [id]: dataUrl };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { photos, setPhoto };
}

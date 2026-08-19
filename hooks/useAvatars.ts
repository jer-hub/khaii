"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { CHARACTERS, type CharacterId } from "@/data/content";

const STORAGE_KEY = "our-journey:avatars";
const EVENT = "our-journey:avatars";

type AvatarMap = Record<CharacterId, string>;

function defaults(): AvatarMap {
  return {
    you: CHARACTERS.you.photo,
    partner: CHARACTERS.partner.photo,
  };
}

function parse(raw: string | null): AvatarMap {
  const base = defaults();
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<AvatarMap>;
    return {
      you: parsed.you || base.you,
      partner: parsed.partner || base.partner,
    };
  } catch {
    return base;
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

export function useAvatars() {
  const raw = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(STORAGE_KEY),
    () => null,
  );
  const photos = useMemo(() => parse(raw), [raw]);

  const setPhoto = useCallback((id: CharacterId, dataUrl: string) => {
    const next = { ...parse(window.localStorage.getItem(STORAGE_KEY)), [id]: dataUrl };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { photos, setPhoto };
}

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

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

  /** Returns false when the browser refuses to store the photo (e.g. storage is full). */
  const setPhoto = useCallback((id: CharacterId, dataUrl: string) => {
    const next = { ...parse(window.localStorage.getItem(STORAGE_KEY)), [id]: dataUrl };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      return false;
    }
    window.dispatchEvent(new Event(EVENT));
    return true;
  }, []);

  return { photos, setPhoto };
}

// localStorage holds only ~5 MB per site, so photos are shrunk before saving.
const AVATAR_MAX_SIDE = 512;

export async function readImageFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, AVATAR_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Canvas 2D context is unavailable");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/webp", 0.85);
}

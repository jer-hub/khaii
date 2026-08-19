"use client";

import { useSyncExternalStore } from "react";

const UNLOCK_KEY = "our-journey:unlocked";
const UNLOCK_EVENT = "our-journey:unlock";

function subscribeUnlock(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(UNLOCK_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(UNLOCK_EVENT, onStoreChange);
  };
}

export function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useUnlocked() {
  return useSyncExternalStore(
    subscribeUnlock,
    () => window.localStorage.getItem(UNLOCK_KEY) === "true",
    () => false,
  );
}

export function unlockSite() {
  window.localStorage.setItem(UNLOCK_KEY, "true");
  window.dispatchEvent(new Event(UNLOCK_EVENT));
}

let cachedSize = { width: 0, height: 0 };

export function useWindowSize() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("resize", onStoreChange);
      return () => window.removeEventListener("resize", onStoreChange);
    },
    () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (cachedSize.width !== width || cachedSize.height !== height) {
        cachedSize = { width, height };
      }
      return cachedSize;
    },
    () => cachedSize,
  );
}

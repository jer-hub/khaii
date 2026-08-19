"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, KeyRound } from "lucide-react";
import { SITE } from "@/data/content";
import { secretsMatch } from "@/lib/password";

export function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(""), 3200);
    return () => window.clearTimeout(timer);
  }, [error]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (secretsMatch(value, SITE.password)) {
      onUnlock();
      return;
    }
    setShake((n) => n + 1);
    setError("Not quite — try a date that means something to us.");
  }

  return (
    <motion.section
      key="gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-cream px-6"
    >
      <div className="pointer-events-none absolute -top-24 right-[-4rem] h-64 w-64 rounded-full bg-rose/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-[-5rem] h-56 w-56 rounded-full bg-sage/40 blur-3xl" />

      <FloatingHearts />

      <div className="relative w-full max-w-sm text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
          className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-white/70 shadow-[0_8px_30px_rgba(244,194,194,0.55)] ring-1 ring-white/80"
        >
          <Heart className="h-7 w-7 fill-rose text-rose-deep" />
        </motion.div>

        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="text-xs font-medium tracking-[0.28em] text-sage-deep uppercase"
        >
          {SITE.appName}
        </motion.p>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.26 }}
          className="mt-3 font-serif text-[2.15rem] leading-tight text-charcoal"
        >
          For your eyes only
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.34 }}
          className="mt-3 text-[0.95rem] leading-relaxed text-ink"
        >
          {SITE.tagline}
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.46 }}
          className="mt-10"
        >
          <label htmlFor="gate-password" className="sr-only">
            Password
          </label>
          <div className="glass flex items-center gap-3 rounded-2xl px-4 py-2 shadow-[0_10px_40px_rgba(44,44,44,0.06)]">
            <KeyRound className="h-4 w-4 shrink-0 text-sage-deep" />
            <input
              id="gate-password"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Enter the password"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="w-full bg-transparent py-3 text-charcoal outline-none placeholder:text-ink/50"
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.015 }}
            className="mt-4 w-full rounded-2xl bg-charcoal py-3.5 text-sm font-medium tracking-wide text-cream shadow-[0_12px_28px_rgba(44,44,44,0.18)]"
          >
            Come in
          </motion.button>
        </motion.form>

        <div className="mt-4 min-h-12">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-rose-deep"
              >
                {error}
              </motion.p>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-ink/70"
              >
                {SITE.passwordHint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

function FloatingHearts() {
  const hearts = [
    { left: "8%", delay: 0, size: 14 },
    { left: "78%", delay: 1.4, size: 10 },
    { left: "22%", delay: 2.2, size: 8 },
    { left: "88%", delay: 0.7, size: 12 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.span
          key={heart.left}
          className="absolute bottom-8 text-rose"
          style={{ left: heart.left }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: [-10, -220], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 7.5,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <Heart className="fill-rose/70" style={{ width: heart.size, height: heart.size }} />
        </motion.span>
      ))}
    </div>
  );
}

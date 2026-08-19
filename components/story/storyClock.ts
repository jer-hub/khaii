import { SEASON_SECONDS, SEASON_STORY, STORY_LOOP_SECONDS } from "@/data/content";

export function wrapStoryTime(elapsed: number) {
  return ((elapsed % STORY_LOOP_SECONDS) + STORY_LOOP_SECONDS) % STORY_LOOP_SECONDS;
}

export function seasonBlend(t: number) {
  const index = Math.min(3, Math.floor(t / SEASON_SECONDS));
  const local = t - index * SEASON_SECONDS;
  const fade = 1.1;
  const next = (index + 1) % 4;
  const blend = local > SEASON_SECONDS - fade ? (local - (SEASON_SECONDS - fade)) / fade : 0;
  const loopFade = t > STORY_LOOP_SECONDS - 0.45 ? (t - (STORY_LOOP_SECONDS - 0.45)) / 0.45 : 0;
  return {
    index,
    next,
    local,
    blend,
    loopFade,
    current: SEASON_STORY[index],
    upcoming: SEASON_STORY[next],
  };
}

export function actionForTime(t: number): "walk" | "wave" | "dance" | "hug" | "idle" {
  if (t < 3.2) return "walk";
  if (t < 5.6) return "wave";
  if (t < 7.5) return "walk";
  if (t < 15) return "dance";
  if (t < 22.5) return "walk";
  if (t < 28.2) return "hug";
  return "idle";
}

export function coupleOffset(t: number, side: "left" | "right") {
  const hugging = t >= 22.5 && t < 28.2;
  const baseX = side === "left" ? -0.34 : 0.34;
  const hugX = side === "left" ? -0.2 : 0.2;
  const sway = Math.sin(t * 0.42) * (hugging ? 0.02 : 0.14);
  const stagger = side === "left" ? 0 : 0.4;
  return {
    x: (hugging ? hugX : baseX) + sway,
    z: 0.1 + Math.sin(t * 0.31 + stagger) * (hugging ? 0.02 : 0.1),
  };
}

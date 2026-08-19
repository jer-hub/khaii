/**
 * ──────────────────────────────────────────────────────────────────────────
 * PERSONALIZE THIS FILE
 *
 * Everything the gift site displays lives here — name, password, dates,
 * memories, coupons, reasons, game pairs, quiz cards, story scenes,
 * and the 3D couple (names + placeholder photos).
 * Edit these values; you shouldn't need to touch the rest of the app.
 * ──────────────────────────────────────────────────────────────────────────
 */

export const SITE = {
  partnerName: "My Love",
  yourName: "Me",
  appName: "Our Journey",
  tagline: "A little corner of the internet, just for us.",
  /** Compared case-insensitively; punctuation is ignored. "02/14" matches "0214". */
  password: "0214",
  passwordHint: "Hint: a date we both remember.",
  /** ISO date used to calculate "Days Together". */
  startDate: "2024-02-14",
} as const;

export const CHARACTERS = {
  you: {
    id: "you" as const,
    name: SITE.yourName,
    photo: "/avatars/you.png",
    outfit: "#8fa38f",
    accent: "#d7e0d4",
  },
  partner: {
    id: "partner" as const,
    name: SITE.partnerName,
    photo: "/avatars/partner.png",
    outfit: "#e39a9a",
    accent: "#f7d6d6",
  },
};

export const STAGE_ACTIONS = [
  { id: "wave", label: "Wave", hint: "A little hello" },
  { id: "hug", label: "Hug", hint: "Come closer" },
  { id: "dance", label: "Dance", hint: "Sway with me" },
  { id: "kiss", label: "Kiss", hint: "Lean in" },
  { id: "jump", label: "Jump", hint: "Up we go" },
] as const;

export type CharacterId = keyof typeof CHARACTERS;
export type StageAction = (typeof STAGE_ACTIONS)[number]["id"];

export const STATS = {
  citiesVisited: 8,
  moviesWatched: 42,
  cupsOfCoffee: 167,
} as const;

export type MemoryMotif =
  | "coffee"
  | "rain"
  | "sunset"
  | "picnic"
  | "stars"
  | "home";

export type ArtMotif = MemoryMotif | "heart" | "ring";

export type Memory = {
  id: string;
  title: string;
  date: string;
  location: string;
  story: string;
  motif: MemoryMotif;
  tilt: number;
};

export const MEMORIES: Memory[] = [
  {
    id: "first-coffee",
    title: "First coffee",
    date: "February 14, 2024",
    location: "The little corner cafe",
    story:
      "The tables were too small and the music was a little too loud. I still remember how you wrapped both hands around the cup, and how the afternoon somehow lasted longer than it should have.",
    motif: "coffee",
    tilt: -3.5,
  },
  {
    id: "rainy-walk",
    title: "Rain we didn't plan for",
    date: "April 3, 2024",
    location: "Downtown side streets",
    story:
      "We didn't bring an umbrella. You laughed first, then I did, and we just kept walking. I think that's when I knew ordinary weather with you would never feel ordinary.",
    motif: "rain",
    tilt: 2.8,
  },
  {
    id: "sunset-picnic",
    title: "Sunset picnic",
    date: "June 21, 2024",
    location: "The hill above the river",
    story:
      "Cheese, fruit, a blanket that wouldn't stay put, and the sky showing off. You leaned against my shoulder without saying anything. I didn't need you to.",
    motif: "sunset",
    tilt: -1.6,
  },
  {
    id: "the-concert",
    title: "That concert",
    date: "August 9, 2024",
    location: "The packed little venue",
    story:
      "You knew every word. I spent half the night watching you instead of the stage. Still the better view.",
    motif: "stars",
    tilt: 4.2,
  },
  {
    id: "weekend-away",
    title: "Wrong turn, right place",
    date: "October 12, 2024",
    location: "A town we found by accident",
    story:
      "The map was useless and the reservation was in the next town over. We stayed anyway. Best wrong turn we've ever taken.",
    motif: "picnic",
    tilt: -2.4,
  },
  {
    id: "cooking-night",
    title: "The pasta incident",
    date: "January 18, 2025",
    location: "Our kitchen",
    story:
      "The sauce split, the timer lied, and we ate it anyway sitting on the floor. The pasta was a disaster. The evening wasn't.",
    motif: "home",
    tilt: 1.8,
  },
];

export type CouponIcon =
  | "sparkles"
  | "film"
  | "sunrise"
  | "heart"
  | "map"
  | "gift";

export type Coupon = {
  id: string;
  title: string;
  description: string;
  icon: CouponIcon;
};

export const COUPONS: Coupon[] = [
  {
    id: "massage",
    title: "One back massage",
    description: "No timers. No phones. Just quiet hands and whatever playlist you want.",
    icon: "sparkles",
  },
  {
    id: "movie-night",
    title: "You pick the movie",
    description: "Full veto power. I will not complain — even if it's the one I've already seen twice.",
    icon: "film",
  },
  {
    id: "breakfast",
    title: "Breakfast in bed",
    description: "Something warm, something sweet, and you don't have to get up for any of it.",
    icon: "sunrise",
  },
  {
    id: "your-day",
    title: "A day of your plans",
    description: "You set the itinerary. I handle the rest, including the snacks.",
    icon: "map",
  },
  {
    id: "sunset-walk",
    title: "Sunset walk of your choosing",
    description: "Wherever you want to wander. I'll bring a jacket in case you forget yours.",
    icon: "heart",
  },
  {
    id: "phone-free",
    title: "A phone-free evening",
    description: "Just us. Unlimited hugs included, redeemable more than once in spirit.",
    icon: "gift",
  },
];

export type Reason = {
  id: string;
  title: string;
  body: string;
};

export const REASONS: Reason[] = [
  {
    id: "r1",
    title: "The way you listen",
    body: "You don't just wait for your turn to talk. You actually hear me — even the parts I haven't figured out how to say yet.",
  },
  {
    id: "r2",
    title: "Your laugh",
    body: "The real one. The one that sneaks up and takes over the whole room. I would rearrange a day just to hear it.",
  },
  {
    id: "r3",
    title: "How you make a place feel like home",
    body: "A lamp, a playlist, a mug in the right spot. You turn rooms into somewhere I want to stay.",
  },
  {
    id: "r4",
    title: "Your kindness when no one is watching",
    body: "The small courtesies. The extra patience. The way you treat people who can't do anything for you.",
  },
  {
    id: "r5",
    title: "The way you look at me",
    body: "Like I am not a project to be finished. Like I am already enough, and still becoming.",
  },
  {
    id: "r6",
    title: "Your courage",
    body: "You feel things fully and still walk toward them. I admire that more than I say out loud.",
  },
  {
    id: "r7",
    title: "How you remember the tiny things",
    body: "The order I like my coffee. The story I told once. The song that was playing. You keep a quiet archive of me.",
  },
  {
    id: "r8",
    title: "Your mind",
    body: "Sharp, curious, a little mischievous. Conversations with you are my favorite way to spend an hour — or four.",
  },
  {
    id: "r9",
    title: "The calm you bring",
    body: "When everything is loud, you are a still point. I find my breathing again just by sitting next to you.",
  },
  {
    id: "r10",
    title: "How you love",
    body: "Not loudly for show — steadily, specifically, in a way that makes me feel chosen on ordinary Tuesdays.",
  },
  {
    id: "r11",
    title: "Your sense of wonder",
    body: "You still point at the moon. You still get excited about good bread. Please never stop.",
  },
  {
    id: "r12",
    title: "The future I can picture",
    body: "Not a perfect one. A real one. Groceries and inside jokes and growing older next to you, on purpose.",
  },
  {
    id: "r13",
    title: "This version of us",
    body: "Not the highlight reel — the in-between. The quiet mornings. The silly arguments. The way we find our way back.",
  },
];

export type GamePair = {
  id: string;
  motif: ArtMotif;
  label: string;
};

export const GAME_PAIRS: GamePair[] = [
  { id: "coffee", motif: "coffee", label: "Coffee" },
  { id: "rain", motif: "rain", label: "Rain" },
  { id: "sunset", motif: "sunset", label: "Sunset" },
  { id: "picnic", motif: "picnic", label: "Picnic" },
  { id: "stars", motif: "stars", label: "Stars" },
  { id: "home", motif: "home", label: "Home" },
  { id: "heart", motif: "heart", label: "Heart" },
  { id: "ring", motif: "ring", label: "Forever" },
];

export type QuizCard = {
  id: string;
  prompt: string;
  answer: string;
  choices: string[];
};

export const QUIZ_CARDS: QuizCard[] = [
  {
    id: "q1",
    prompt: "Where did we have our first coffee?",
    answer: "The little corner cafe",
    choices: ["The little corner cafe", "A train station kiosk", "Your kitchen", "The park bench"],
  },
  {
    id: "q2",
    prompt: "What did we forget on that rainy walk?",
    answer: "An umbrella",
    choices: ["The keys", "An umbrella", "A map", "Your jacket"],
  },
  {
    id: "q3",
    prompt: "How many cities have we visited together?",
    answer: "8",
    choices: ["3", "8", "12", "21"],
  },
  {
    id: "q4",
    prompt: "What kitchen disaster still made a perfect night?",
    answer: "The pasta",
    choices: ["The cake", "The pasta", "Burnt toast", "Soup that never thickened"],
  },
  {
    id: "q5",
    prompt: "Where was the picnic when the sky showed off?",
    answer: "The hill above the river",
    choices: ["The beach parking lot", "The hill above the river", "A rooftop", "Your backyard"],
  },
  {
    id: "q6",
    prompt: "At the concert, what were you doing?",
    answer: "Singing every word",
    choices: ["Checking the time", "Singing every word", "Buying merch", "Finding seats"],
  },
  {
    id: "q7",
    prompt: "How did we find that unexpected town?",
    answer: "A wrong turn",
    choices: ["A guidebook", "A wrong turn", "A friend's tip", "A train we missed"],
  },
  {
    id: "q8",
    prompt: "About how many cups of coffee is this whole story?",
    answer: "167",
    choices: ["42", "89", "167", "300"],
  },
];

export type StoryScene = {
  id: string;
  title: string;
  date?: string;
  body: string;
  motif: ArtMotif;
};

export const STORY_SCENES: StoryScene[] = [
  {
    id: "intro",
    title: "Once upon a us",
    date: "The beginning",
    body: "Not a fairytale — just the days we actually lived, lined up so you can watch them again.",
    motif: "heart",
  },
  ...MEMORIES.map((memory) => ({
    id: memory.id,
    title: memory.title,
    date: memory.date,
    body: memory.story,
    motif: memory.motif,
  })),
  {
    id: "always",
    title: "And still",
    date: "Today",
    body: "The best part is that the story is not finished. It just keeps choosing you.",
    motif: "ring",
  },
];

export const TABS = [
  { id: "home", label: "Home" },
  { id: "memories", label: "Scrapbook" },
  { id: "coupons", label: "Coupons" },
  { id: "reasons", label: "Reasons" },
] as const;

export type NavTabId = (typeof TABS)[number]["id"];
export type PlayViewId = "game" | "quiz" | "story";
export type TabId = NavTabId | PlayViewId;

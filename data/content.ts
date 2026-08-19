/**
 * ──────────────────────────────────────────────────────────────────────────
 * PERSONALIZE THIS FILE
 *
 * Everything the gift site displays lives here — name, password, dates,
 * memories (`MEMORIES` titles, captions, and optional `photo` paths under `public/memories/`),
 * and the 3D couple (names + placeholder photos).
 * Edit these values; you shouldn't need to touch the rest of the app.
 * ──────────────────────────────────────────────────────────────────────────
 */

export const SITE = {
  partnerName: "Khai",
  yourName: "Toto",
  appName: "Our Journey",
  tagline: "A little corner of the internet, just for us.",
  /** Compared case-insensitively; punctuation is ignored. "02/14" matches "0214". */
  password: "0214",
  passwordHint: "Hint: a date we both remember.",
  /** ISO date used to calculate "Days Together" (calendar days from this date to today). */
  startDate: "2026-05-19",
} as const;

export const CHARACTERS = {
  you: {
    id: "you" as const,
    name: SITE.yourName,
    photo: "/avatars/you.png",
    outfit: "#8fa38f",
    accent: "#d7e0d4",
    hair: "#3d322c",
  },
  partner: {
    id: "partner" as const,
    name: SITE.partnerName,
    photo: "/avatars/partner.png",
    outfit: "#e39a9a",
    accent: "#f7d6d6",
    hair: "#5c342f",
  },
};

export const STAGE_ACTIONS = [
  { id: "wave", label: "Wave", hint: "A little hello" },
  { id: "hug", label: "Hug", hint: "Squeeze in close" },
  { id: "dance", label: "Dance", hint: "Sway with me" },
  { id: "kiss", label: "Kiss", hint: "Lean in" },
  { id: "jump", label: "Jump", hint: "Up we go" },
] as const;

export type CharacterId = keyof typeof CHARACTERS;
export type StageAction = (typeof STAGE_ACTIONS)[number]["id"];

export const STATS = {
  citiesVisited: 1,
  moviesWatched: 2,
  cupsOfCoffee: 6,
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
  /** Path under `public/`, e.g. `/memories/thatch.jpg`. Leave empty and drop a photo onto the polaroid. */
  photo?: string;
};

export const MEMORIES: Memory[] = [
  {
    id: "thatch-selfie",
    title: "ain't we cool here",
    date: "",
    location: "at bhauz",
    story: "picture mi bago nag hawa balay",
    motif: "stars",
    tilt: -3.2,
    photo: "/memories/01.jpg",
  },
  {
    id: "couch-peace",
    title: "Happy GF day, my love",
    date: "",
    location: "at davao airport view",
    story: "first time giving her flowers",
    motif: "home",
    tilt: 2.4,
    photo: "/memories/02.jpg",
  },
  {
    id: "mirror-night",
    title: "kwikie sa JH Garden, Eme",
    date: "",
    location: "at brgy.magtuod",
    story: "detour date after mag judge sa linggo ng kabataan",
    motif: "rain",
    tilt: -1.8,
    photo: "/memories/03.jpg",
  },
  {
    id: "cafe-table",
    title: "Kadayawan Fest with you",
    date: "",
    location: "at magsaysay park",
    story: "tuyok tuyok mi ani sa magsaysay park",
    motif: "coffee",
    tilt: 3.1,
    photo: "/memories/04.jpg",
  },
  {
    id: "green-leaves",
    title: "Food namo sa balai samal",
    date: "",
    location: "at balai samal",
    story: "cravings satisfied",
    motif: "picnic",
    tilt: -2.6,
    photo: "/memories/05.jpg",
  },
  {
    id: "pink-flowers",
    title: "At Balai Samal",
    date: "",
    location: "at balai samal",
    story: "first date namo sa samal naulanan mi diri tas nakatulog sa ferry boat pauli haha",
    motif: "sunset",
    tilt: 1.7,
    photo: "/memories/06.jpg",
  },
  {
    id: "two-glasses",
    title: "Caption",
    date: "",
    location: "",
    story: "",
    motif: "coffee",
    tilt: -4.0,
    photo: "/memories/07.jpg",
  },
  {
    id: "caps-and-shades",
    title: "Caption",
    date: "",
    location: "",
    story: "",
    motif: "stars",
    tilt: 2.2,
    photo: "/memories/08.jpg",
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
    body: "A partner, creating playlist, your comfort, you turn home into somewhere I want to stay.",
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

export const STORY_LOOP_SECONDS = 30;
export const SEASON_SECONDS = 7.5;

export const SEASON_STORY = [
  {
    id: "spring",
    title: "Spring, we set out",
    line: "Petals on the path, a picnic packed, the year just opening.",
    sky: "#f3dce6",
    ground: "#8fbe8a",
    fog: "#f7e9ee",
    light: "#ffe6f0",
  },
  {
    id: "summer",
    title: "Summer, we linger",
    line: "Gold light, a shared umbrella, the afternoon that refused to end.",
    sky: "#f6e2b8",
    ground: "#c9b15a",
    fog: "#f8ecc8",
    light: "#ffe7a8",
  },
  {
    id: "autumn",
    title: "Autumn, we wander",
    line: "Leaves underfoot, a lantern for later, every wrong turn still ours.",
    sky: "#e8c09a",
    ground: "#b56a3a",
    fog: "#f0d3b0",
    light: "#ffc089",
  },
  {
    id: "winter",
    title: "Winter, we hold",
    line: "Snow hush, two coats, a long hug that does not let go.",
    sky: "#d5e3ee",
    ground: "#e8eef4",
    fog: "#e7eef5",
    light: "#dfefff",
  },
] as const;

export type SeasonId = (typeof SEASON_STORY)[number]["id"];

export const TABS = [
  { id: "home", label: "Home" },
  { id: "memories", label: "Scrapbook" },
  { id: "coupons", label: "Coupons" },
  { id: "reasons", label: "Reasons" },
] as const;

export type NavTabId = (typeof TABS)[number]["id"];
export type PlayViewId = "game" | "quiz" | "story";
export type TabId = NavTabId | PlayViewId;

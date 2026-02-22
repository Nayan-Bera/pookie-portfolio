"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ABOUT_TEXT,
  CONTACT,
  EXPERIENCE,
  HERO_CONTENT,
  PROJECTS,
  techs,
} from "../constant/data";

// ─── Types ───────────────────────────────────────────────────────────────────
type Theme = "dark" | "light";
type MoodKey = "normal" | "happy" | "surprised" | "heart" | "wink" | "sleeping";
type EyeType = "normal" | "sleeping" | "surprised" | "heart" | "wink";
type MouthType = "normal" | "happy" | "surprised" | "sleeping" | "wink";

interface MoodDef {
  eyes: EyeType;
  mouth: MouthType;
  glow: string;
  label: string;
  anim: string;
}

interface ClickSeqItem {
  mood: MoodKey;
  bubble: string;
  anim: string;
}

// ─── Global keyframes injected once ──────────────────────────────────────────

// ─── Mood Definitions ─────────────────────────────────────────────────────────
const moodDefs: Record<MoodKey, MoodDef> = {
  normal: {
    eyes: "normal",
    mouth: "normal",
    glow: "rgba(240,98,146,.3)",
    label: "",
    anim: "teddy-anim-float",
  },
  happy: {
    eyes: "normal",
    mouth: "happy",
    glow: "rgba(240,98,146,.55)",
    label: "✨ Happy!",
    anim: "teddy-anim-float",
  },
  surprised: {
    eyes: "surprised",
    mouth: "surprised",
    glow: "rgba(206,147,216,.6)",
    label: "😲 Whoa!!",
    anim: "teddy-anim-bounce",
  },
  heart: {
    eyes: "heart",
    mouth: "happy",
    glow: "rgba(255,85,140,.6)",
    label: "💕 In Love!",
    anim: "teddy-anim-float",
  },
  wink: {
    eyes: "wink",
    mouth: "wink",
    glow: "rgba(240,98,146,.4)",
    label: "😉 Teehee~",
    anim: "teddy-anim-float",
  },
  sleeping: {
    eyes: "sleeping",
    mouth: "sleeping",
    glow: "rgba(147,197,253,.3)",
    label: "😴 Zzz...",
    anim: "teddy-anim-float",
  },
};

const clickSeq: ClickSeqItem[] = [
  { mood: "surprised", bubble: "Whaaa?! 😲", anim: "teddy-anim-bounce" },
  { mood: "happy", bubble: "Heehee~ 🌸", anim: "teddy-anim-dance" },
  { mood: "heart", bubble: "I love you! 💕", anim: "teddy-anim-float" },
  { mood: "wink", bubble: "Psst~ 😉✨", anim: "teddy-anim-float" },
  { mood: "happy", bubble: "Yay!! 🎉", anim: "teddy-anim-spin" },
  { mood: "surprised", bubble: "Again?! 🙈", anim: "teddy-anim-bounce" },
  { mood: "heart", bubble: "Best friends! 🎀", anim: "teddy-anim-dance" },
];

const miniPositions = [
  { top: "10%", left: "1%", right: undefined, delay: "0s", dur: "7s" },
  { top: "52%", left: "0.5%", right: undefined, delay: "2.5s", dur: "9s" },
  { top: "22%", left: undefined, right: "1%", delay: "1s", dur: "8s" },
  { top: "68%", left: undefined, right: "0.5%", delay: "3s", dur: "10s" },
];

const emojis = ["🩷", "💕", "✨", "🌸", "💖", "🎀", "⭐", "🌷"];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function TeddySVG({
  animClass,
  eyeState,
  mouthState,
  leftPupilPos,
  rightPupilPos,
  teddyRef,
}: {
  animClass: string;
  eyeState: EyeType;
  mouthState: MouthType;
  leftPupilPos: { cx: number; cy: number };
  rightPupilPos: { cx: number; cy: number };
  teddyRef: React.RefObject<SVGSVGElement | null>;
}) {
  const eyeOpacity = (type: EyeType) => (eyeState === type ? "1" : "0");
  const mouthOpacity = (type: MouthType) => (mouthState === type ? "1" : "0");

  return (
    <svg
      id="hero-teddy"
      ref={teddyRef}
      className={animClass}
      viewBox="0 0 200 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 290,
        height: 320,
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        filter: "drop-shadow(0 20px 40px rgba(240,98,146,.4))",
        transition: "filter .3s",
      }}
    >
      {/* Body */}
      <ellipse cx="100" cy="152" rx="56" ry="63" fill="#f8a4c0" />
      <ellipse
        cx="100"
        cy="160"
        rx="34"
        ry="37"
        fill="#ffc8da"
        opacity="0.85"
      />
      {/* Head */}
      <circle cx="100" cy="78" r="53" fill="#f8a4c0" />
      <ellipse
        cx="82"
        cy="55"
        rx="14"
        ry="9"
        fill="white"
        opacity="0.1"
        transform="rotate(-25 82 55)"
      />
      {/* Ears */}
      <circle cx="55" cy="34" r="23" fill="#f8a4c0" />
      <circle cx="55" cy="34" r="14" fill="#ffb3cc" opacity="0.9" />
      <circle cx="145" cy="34" r="23" fill="#f8a4c0" />
      <circle cx="145" cy="34" r="14" fill="#ffb3cc" opacity="0.9" />
      {/* Cheeks */}
      <circle cx="70" cy="92" r="12" fill="#ff85aa" opacity="0.55" />
      <circle cx="130" cy="92" r="12" fill="#ff85aa" opacity="0.55" />

      {/* Normal eyes */}
      <g id="eyes-normal" opacity={eyeOpacity("normal")}>
        <circle cx="82" cy="72" r="11" fill="#2a0818" />
        <circle
          id="eye-left-pupil"
          cx={leftPupilPos.cx}
          cy={leftPupilPos.cy}
          r="5"
          fill="white"
        />
        <circle cx="86" cy="68.5" r="1.8" fill="white" />
        <circle cx="118" cy="72" r="11" fill="#2a0818" />
        <circle
          id="eye-right-pupil"
          cx={rightPupilPos.cx}
          cy={rightPupilPos.cy}
          r="5"
          fill="white"
        />
        <circle cx="122" cy="68.5" r="1.8" fill="white" />
      </g>

      {/* Sleeping eyes */}
      <g id="eyes-sleeping" opacity={eyeOpacity("sleeping")}>
        <path
          d="M72 72 Q82 65 92 72"
          stroke="#2a0818"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M108 72 Q118 65 128 72"
          stroke="#2a0818"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <text
          x="148"
          y="52"
          fontSize="15"
          fill="#93c5fd"
          fontWeight="bold"
          fontFamily="Arial"
        >
          z
        </text>
        <text
          x="158"
          y="39"
          fontSize="11"
          fill="#93c5fd"
          fontWeight="bold"
          fontFamily="Arial"
        >
          z
        </text>
        <text
          x="166"
          y="28"
          fontSize="8"
          fill="#93c5fd"
          fontWeight="bold"
          fontFamily="Arial"
        >
          z
        </text>
      </g>

      {/* Surprised eyes */}
      <g id="eyes-surprised" opacity={eyeOpacity("surprised")}>
        <circle cx="82" cy="72" r="14" fill="#2a0818" />
        <circle cx="86" cy="68" r="5.5" fill="white" />
        <circle cx="118" cy="72" r="14" fill="#2a0818" />
        <circle cx="122" cy="68" r="5.5" fill="white" />
      </g>

      {/* Heart eyes */}
      <g id="eyes-heart" opacity={eyeOpacity("heart")}>
        <path
          d="M74 66 C74 61 81 58 81 58 C81 58 88 61 88 66 C88 71 81 76 81 76 C81 76 74 71 74 66Z"
          fill="#ff5c8a"
        />
        <path
          d="M112 66 C112 61 119 58 119 58 C119 58 126 61 126 66 C126 71 119 76 119 76 C119 76 112 71 112 66Z"
          fill="#ff5c8a"
        />
      </g>

      {/* Wink eyes */}
      <g id="eyes-wink" opacity={eyeOpacity("wink")}>
        <circle cx="82" cy="72" r="11" fill="#2a0818" />
        <circle cx="85" cy="69" r="5" fill="white" />
        <circle cx="87" cy="68" r="1.8" fill="white" />
        <path
          d="M110 68 Q118 74 126 68"
          stroke="#2a0818"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Nose */}
      <ellipse cx="100" cy="90" rx="7" ry="5" fill="#d44070" />

      {/* Mouths */}
      <path
        id="mouth-normal"
        opacity={mouthOpacity("normal")}
        d="M90 99 Q100 110 110 99"
        stroke="#d44070"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        id="mouth-happy"
        opacity={mouthOpacity("happy")}
        d="M85 97 Q100 115 115 97"
        stroke="#d44070"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        id="mouth-surprised"
        opacity={mouthOpacity("surprised")}
        cx="100"
        cy="104"
        rx="7"
        ry="9"
        fill="#d44070"
      />
      <path
        id="mouth-sleeping"
        opacity={mouthOpacity("sleeping")}
        d="M93 101 Q100 108 107 101"
        stroke="#d44070"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        id="mouth-wink"
        opacity={mouthOpacity("wink")}
        d="M88 99 Q100 112 112 99"
        stroke="#d44070"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bow tie */}
      <polygon points="100,126 87,118 87,134" fill="#e91e8c" />
      <polygon points="100,126 113,118 113,134" fill="#e91e8c" />
      <circle cx="100" cy="126" r="5.5" fill="#ff85aa" />

      {/* Heart belly */}
      <path
        d="M95 156 C95 150 100 147 100 147 C100 147 105 150 105 156 C105 162 100 167 100 167 C100 167 95 162 95 156Z"
        fill="#ff5c8a"
        opacity="0.75"
      />

      {/* Arms */}
      <ellipse
        cx="46"
        cy="152"
        rx="18"
        ry="34"
        fill="#f8a4c0"
        transform="rotate(-15 46 152)"
      />
      <ellipse
        cx="154"
        cy="152"
        rx="18"
        ry="34"
        fill="#f8a4c0"
        transform="rotate(15 154 152)"
      />
      {/* Paws */}
      <ellipse cx="36" cy="178" rx="14" ry="10" fill="#f8a4c0" />
      <ellipse cx="164" cy="178" rx="14" ry="10" fill="#f8a4c0" />
      {/* Legs */}
      <ellipse cx="79" cy="207" rx="21" ry="26" fill="#f8a4c0" />
      <ellipse cx="121" cy="207" rx="21" ry="26" fill="#f8a4c0" />
      {/* Feet */}
      <ellipse cx="74" cy="225" rx="21" ry="10" fill="#f8a4c0" />
      <ellipse cx="126" cy="225" rx="21" ry="10" fill="#f8a4c0" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [currentMood, setCurrentMood] = useState<MoodKey>("normal");
  const [eyeState, setEyeState] = useState<EyeType>("normal");
  const [mouthState, setMouthState] = useState<MouthType>("normal");
  const [glowBg, setGlowBg] = useState(
    "radial-gradient(circle at 50% 60%, rgba(240,98,146,.3), transparent 70%)",
  );
  const [animClass, setAnimClass] = useState("teddy-anim-float");
  const [bubbleText, setBubbleText] = useState("Hehe! 🌸");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [moodLabel, setMoodLabel] = useState("");
  const [moodVisible, setMoodVisible] = useState(false);
  const [leftPupil, setLeftPupil] = useState({ cx: 84, cy: 70 });
  const [rightPupil, setRightPupil] = useState({ cx: 120, cy: 70 });

  const teddyRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);
  const isHoveringRef = useRef(false);
  const currentMoodRef = useRef<MoodKey>("normal");

  // Sync mood ref
  useEffect(() => {
    currentMoodRef.current = currentMood;
  }, [currentMood]);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const applyMood = useCallback((moodKey: MoodKey) => {
    const def = moodDefs[moodKey];
    setCurrentMood(moodKey);
    currentMoodRef.current = moodKey;
    setEyeState(def.eyes);
    setMouthState(def.mouth);
    setGlowBg(
      `radial-gradient(circle at 50% 60%, ${def.glow}, transparent 70%)`,
    );
    setMoodLabel(def.label);
    setMoodVisible(!!def.label);
  }, []);

  const showBubble = useCallback((text: string, ms = 2200) => {
    if (bubbleTimer.current !== null) {
      clearTimeout(bubbleTimer.current);
    }

    setBubbleText(text);
    setBubbleVisible(true);
    bubbleTimer.current = setTimeout(() => setBubbleVisible(false), ms);
  }, []);

  const resetSleepTimer = useCallback(() => {
    if (sleepTimer.current !== null) {
      clearTimeout(sleepTimer.current);
    }
    if (currentMoodRef.current === "sleeping") applyMood("normal");
    sleepTimer.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        applyMood("sleeping");
        showBubble("Zzz... 💤", 3500);
      }
    }, 9000);
  }, [applyMood, showBubble]);

  useEffect(() => {
    resetSleepTimer();

    return () => {
      if (sleepTimer.current !== null) {
        clearTimeout(sleepTimer.current);
      }

      if (bubbleTimer.current !== null) {
        clearTimeout(bubbleTimer.current);
      }
    };
  }, [resetSleepTimer]);

  // Mouse move for pupil tracking
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const mood = currentMoodRef.current;
      if (mood === "sleeping" || mood === "heart" || mood === "wink") return;
      if (!teddyRef.current) return;
      const rect = teddyRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.33;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxMove = 3.5;
      const factor = Math.min(dist / 250, 1) * maxMove;
      const angle = Math.atan2(dy, dx);
      setLeftPupil({
        cx: 84 + factor * Math.cos(angle),
        cy: 70 + factor * Math.sin(angle),
      });
      setRightPupil({
        cx: 120 + factor * Math.cos(angle),
        cy: 70 + factor * Math.sin(angle),
      });
      resetSleepTimer();
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [resetSleepTimer]);

  const spawnHearts = useCallback((x: number, y: number, count = 7) => {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "heart-particle";
      el.style.cssText = `left:${x + (Math.random() - 0.5) * 70}px;top:${y + (Math.random() - 0.5) * 40}px;animation-delay:${Math.random() * 0.35}s;animation-duration:${1 + Math.random() * 0.5}s;`;
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2000);
    }
  }, []);

  const handleTeddyMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    resetSleepTimer();
    if (currentMoodRef.current === "sleeping") {
      applyMood("surprised");
      setAnimClass("teddy-anim-bounce");
      showBubble("Wha—!! 😲");
      setTimeout(() => {
        if (isHoveringRef.current) {
          applyMood("happy");
          setAnimClass("teddy-anim-float");
          showBubble("Hii! 🌸");
        }
      }, 900);
    } else if (currentMoodRef.current !== "heart") {
      applyMood("happy");
      setAnimClass("teddy-anim-float");
      showBubble("Hii there! 🌸");
    }
  }, [applyMood, showBubble, resetSleepTimer]);

  const handleTeddyMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    resetSleepTimer();
    setTimeout(() => {
      if (
        !isHoveringRef.current &&
        currentMoodRef.current !== "heart" &&
        currentMoodRef.current !== "sleeping"
      ) {
        applyMood("normal");
        setMoodVisible(false);
        setAnimClass("teddy-anim-float");
      }
    }, 900);
  }, [applyMood, resetSleepTimer]);

  const handleTeddyClick = useCallback(
    (e: React.MouseEvent) => {
      resetSleepTimer();
      const seq = clickSeq[clickCountRef.current % clickSeq.length];
      clickCountRef.current++;
      setAnimClass(seq.anim);
      applyMood(seq.mood);
      showBubble(seq.bubble);
      spawnHearts(e.clientX, e.clientY);
      if (seq.mood !== "heart" && seq.mood !== "wink") {
        setTimeout(() => {
          if (!isHoveringRef.current && currentMoodRef.current === seq.mood) {
            applyMood("happy");
            setAnimClass("teddy-anim-float");
          }
        }, 2000);
      }
    },
    [applyMood, showBubble, spawnHearts, resetSleepTimer],
  );

  const handleTeddyDblClick = useCallback(
    (e: React.MouseEvent) => {
      resetSleepTimer();
      setAnimClass("teddy-anim-spin");
      applyMood("surprised");
      showBubble("Weeee!! 🌀✨", 2000);
      spawnHearts(e.clientX, e.clientY, 12);
      setTimeout(() => {
        applyMood("happy");
        setAnimClass("teddy-anim-float");
      }, 700);
      e.stopPropagation();
    },
    [applyMood, showBubble, spawnHearts, resetSleepTimer],
  );

  const gradientText =
    "linear-gradient(135deg,#ffb3cc 0%,#f06292 40%,#ce93d8 100%)";

  return (
    <>
      {/* ── NAV ── */}
      <nav
        className=" fixed top-0 left-0 right-0 z-100 px-8 py-4 flex items-center justify-between
         backdrop-blur-2xl border-b border-(--border) bg-[rgba(26,10,16,0.78)] transition-colors duration-400"
      >
        {/* Logo */}
        <div
          className=" font-['Playfair_Display'] text-2xl font-bold bg-linear-to-br
           from-pink-200 to-pink-500 bg-clip-text text-transparent tracking-tight "
        >
          sp.
        </div>

        {/* Nav Links */}
        <ul
          className="
      hidden md:flex
      items-center gap-8
      text-sm font-medium
      text-[var(--text2)]
    "
        >
          {["about", "projects", "experience", "contact"].map((s) => (
            <li key={s}>
              <a
                href={`#${s}`}
                className="
            capitalize
            relative
            transition-all duration-300
            hover:text-[var(--accent)]
            after:absolute after:left-0 after:-bottom-1
            after:h-[2px] after:w-0
            after:bg-[var(--accent)]
            after:transition-all after:duration-300
            hover:after:w-full
          "
              >
                {s}
              </a>
            </li>
          ))}
        </ul>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          title="Toggle theme"
          className="
      w-9 h-9
      flex items-center justify-center
      rounded-full
      border
      border-(--border)
      bg-[var(--surface)]
      text-[var(--text)]
      transition-all duration-300
      hover:bg-[var(--surface2)]
      hover:scale-105
    "
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="
    relative overflow-hidden
    min-h-screen
    grid grid-cols-1 lg:grid-cols-2
    items-center
    gap-12
    px-6 lg:px-24
    pt-28 pb-16
  "
      >
        {/* Blobs */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full blur-[80px] opacity-15 pointer-events-none bg-gradient-to-br from-pink-400 to-pink-600 animate-[blobFloat_8s_ease-in-out_infinite]" />

        <div className="absolute -bottom-12 right-40 w-[400px] h-[400px] rounded-full blur-[80px] opacity-15 pointer-events-none bg-gradient-to-br from-purple-300 to-purple-600 animate-[blobFloat_10s_ease-in-out_infinite_reverse]" />

        <div className="absolute top-[40%] -right-12 w-[300px] h-[300px] rounded-full blur-[80px] opacity-15 pointer-events-none bg-gradient-to-br from-pink-200 to-pink-400 animate-[blobFloat_12s_ease-in-out_infinite]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          {/* Availability Badge */}
          <div
            className="
      inline-flex items-center gap-2
      px-4 py-1.5
      rounded-full
      text-xs font-medium
      border
      bg-[var(--surface)]
      border-[var(--border)]
      text-[var(--accent)]
      mb-6
      animate-[fadeSlideUp_.6s_ease_both]
    "
          >
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
            Available for Opportunities
          </div>

          {/* Name */}
          <h1
            className="
      font-['Playfair_Display']
      font-black
      leading-[1.05]
      mb-3
      text-[clamp(3rem,6vw,5.5rem)]
      animate-[fadeSlideUp_.7s_ease_.1s_both]
    "
          >
            <span className="bg-gradient-to-br from-pink-200 via-pink-400 to-purple-300 bg-clip-text text-transparent">
              Srilekha
            </span>{" "}
            <span className="bg-gradient-to-br from-pink-200 via-pink-400 to-purple-300 bg-clip-text text-transparent">
              Paul
            </span>
          </h1>

          {/* Title */}
          <div
            className="
      text-base md:text-lg
      font-medium
      text-[var(--text2)]
      tracking-wide uppercase
      mb-6
      animate-[fadeSlideUp_.7s_ease_.2s_both]
    "
          >
            Frontend-Focused Full-Stack Developer
          </div>

          {/* Description */}
          <p
            className="
      text-[1.05rem]
      leading-relaxed
      text-[var(--text2)]
      mb-10
      animate-[fadeSlideUp_.7s_ease_.3s_both]
    "
          >
            {HERO_CONTENT}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 animate-[fadeSlideUp_.7s_ease_.4s_both]">
            <a
              href="#projects"
              className="
          inline-flex items-center gap-2
          px-8 py-3
          rounded-full
          text-sm font-semibold
          text-white
          bg-gradient-to-br from-pink-400 to-pink-600
          shadow-[0_4px_20px_rgba(240,98,146,.4)]
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-[0_8px_30px_rgba(240,98,146,.5)]
        "
            >
              View Projects ✦
            </a>

            <a
              href="mailto:srilkehapaul2003@gmail.com"
              className="
          inline-flex items-center gap-2
          px-8 py-3
          rounded-full
          text-sm font-semibold
          border
          border-[var(--border)]
          bg-[var(--surface)]
          text-[var(--text)]
          transition-all duration-300
          hover:bg-[var(--surface2)]
          hover:-translate-y-1
        "
            >
              Say Hello 🌸
            </a>
          </div>
        </div>

        {/* Teddy */}
        <div className="relative z-10 hidden lg:flex justify-center items-center">

  {/* Radial Background Glow */}
  <div className="
    absolute
    w-[600px] h-[600px]
    rounded-full
    bg-gradient-to-br from-pink-500/30 to-purple-500/20
    blur-[120px]
    opacity-60
    pointer-events-none
  " />

  {/* Ground Shadow */}
  <div className="
    absolute bottom-10
    w-[320px] h-[80px]
    bg-black/30
    blur-3xl
    rounded-full
    opacity-40
  " />

  <div
    ref={wrapperRef}
    className="relative w-[380px] h-[450px] cursor-pointer select-none"
    onMouseEnter={handleTeddyMouseEnter}
    onMouseLeave={handleTeddyMouseLeave}
    onClick={handleTeddyClick}
    onDoubleClick={handleTeddyDblClick}
  >

    {/* Soft Ambient Glow */}
    <div
      className="absolute -inset-6 rounded-full blur-3xl opacity-70 transition-all duration-500"
      style={{ background: glowBg }}
    />

    <div id="teddy-bubble" className={bubbleVisible ? "show" : ""}>
      {bubbleText}
    </div>

    <div id="teddy-mood" className={moodVisible ? "show" : ""}>
      {moodLabel}
    </div>

    <TeddySVG
      animClass={animClass}
      eyeState={eyeState}
      mouthState={mouthState}
      leftPupilPos={leftPupil}
      rightPupilPos={rightPupil}
      teddyRef={teddyRef}
    />

    {/* Hint */}
    <div className="
      absolute bottom-[115px] left-1/2 -translate-x-1/2
      text-xs text-[var(--text3)]
      tracking-wide
      animate-[fadeSlideUp_1s_ease_2s_both]
    ">
      Click & hover me ✨
    </div>

    {/* Stack Card (Improved Glass) */}
    <div className="
      absolute top-[320px] left-0 right-0
      backdrop-blur-2xl
      bg-white/5
      border border-white/10
      rounded-3xl
      px-8 py-6
      text-center
      shadow-[0_20px_60px_rgba(0,0,0,.25)]
      transition-all duration-300
      hover:shadow-[0_25px_80px_rgba(0,0,0,.35)]
    ">
      <div className="text-xs uppercase tracking-widest text-[var(--text3)] mb-3">
        Current Stack
      </div>

      <div className="flex justify-center gap-5 text-2xl mb-3">
        🟢 🔷 🟡 🐘 🍃 🐋
      </div>

      <div className="text-sm font-semibold text-[var(--accent)]">
        Node · TypeScript · Python · PostgreSQL · MongoDB · Docker
      </div>
    </div>
  </div>
</div>
      </section>

      {/* ── ABOUT ── */}
      <section
        id="about"
        className="about-grid"
        style={{
          padding: "6rem 6rem",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
      >
        <div className="reveal">
          <div
            className="section-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
              marginBottom: "1rem",
              fontSize: ".8rem",
              fontWeight: 700,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            ✦ Who I Am
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(2rem,4vw,3.5rem)",
              fontWeight: 700,
              marginBottom: "1rem",
              lineHeight: 1.15,
              color: "var(--text)",
            }}
          >
            Crafting Code with
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#ffb3cc,#f06292)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Precision &amp; Passion
            </span>
          </h2>
          <div
            className="about-card"
            style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border)",
              borderRadius: "2rem",
              padding: "2.5rem",
              transition: "all .4s",
              position: "relative",
              overflow: "hidden",
              marginTop: "2rem",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-4px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 20px 60px rgba(0,0,0,.1)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(240,98,146,.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--border)";
            }}
          >
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.85,
                color: "var(--text2)",
                marginBottom: "2rem",
              }}
            >
              {ABOUT_TEXT}
            </p>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {[
                ["3+", "Years Experience"],
                ["4+", "Projects Shipped"],
                ["10+", "Technologies"],
                ["∞", "Coffees Consumed ☕"],
              ].map(([num, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: ".8rem",
                      color: "var(--text3)",
                      marginTop: ".25rem",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reveal" style={{ transitionDelay: ".15s" }}>
          <div
            className="section-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
              marginBottom: "1rem",
              fontSize: ".8rem",
              fontWeight: 700,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            ✦ Tech Stack
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              color: "var(--text)",
            }}
          >
            Tools I Work With
          </h3>
          <div
            className="tech-grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "1rem",
            }}
          >
            {techs.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-3  px-4 py-3 bg-(--card-bg) border border-(--border) rounded-xl cursor-default transition-all duration-300
                 hover:bg-(--surface2) hover:border-pink-400/40  hover:translate-x-1  group "
              >
                <div
                  className="text-2xl w-8 text-center  text-(--accent)  
                  transition-all duration-300  group-hover:scale-110  group-hover:text-pink-400 "
                >
                  {tech.icon}
                </div>

                <span className="text-sm font-medium text-(--text)">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section
        id="projects"
        className="py-24 px-24 relative"
        style={{ background: "var(--bg2)" }}
      >
        <div className="reveal">
          <div className="section-label flex items-center gap-3 mb-4 text-xs font-bold tracking-[0.15em] uppercase text-(--accent)">
            ✦ What I've Built
          </div>

          <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.5rem)] font-bold mb-4 leading-tight text-(--text)">
            Featured{" "}
            <span className="bg-gradient-to-r from-pink-200 to-purple-300 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
        </div>

        {/* GRID */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {PROJECTS.map((project, index) => {
            const num = `0${index + 1}`;

            const statusType =
              project.status === "Live"
                ? "live"
                : project.status === "Backend Complete"
                  ? "backend"
                  : "dev";

            return (
              <div
                key={project.title}
                className="
            project-card reveal
            relative overflow-hidden
            flex flex-col
            p-8
            rounded-[2rem]
            transition-all duration-500
            hover:-translate-y-2
          "
                style={{
                  background: "var(--card-bg)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Big Number */}
                <span
                  className="absolute top-6 right-6 font-black text-[3.5rem] leading-none font-['Playfair_Display']"
                  style={{ color: "var(--border)" }}
                >
                  {num}
                </span>

                {/* Status Badge */}
                <div
                  className={`
              inline-flex items-center gap-1
              text-[0.72rem] font-bold
              px-3 py-1
              rounded-full
              mb-4
              tracking-wide
              w-fit
              ${
                statusType === "live"
                  ? "bg-green-400/15 text-green-600 border border-green-400/35"
                  : statusType === "backend"
                    ? "bg-blue-400/15 text-blue-600 border border-blue-400/35"
                    : "bg-yellow-400/15 text-yellow-700 border border-yellow-400/35"
              }
            `}
                >
                  {statusType === "live"
                    ? "🟢 Live"
                    : statusType === "backend"
                      ? "✅ Backend Complete"
                      : "⏳ In Development"}
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3 pr-12 leading-snug font-['Playfair_Display']"
                  style={{ color: "var(--text)" }}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-6 flex-1"
                  style={{ color: "var(--text2)" }}
                >
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="tech-tag text-[0.72rem] font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(240,98,146,.1)",
                        color: "var(--accent)",
                        border: "1px solid rgba(240,98,146,.2)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Link */}
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-sm font-bold transition-all hover:gap-2"
                    style={{ color: "var(--accent)" }}
                  >
                    View Live Project →
                  </a>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 text-sm"
                    style={{ color: "var(--text3)" }}
                  >
                    🔒 {statusType === "dev" ? "In Development" : "Coming Soon"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="py-24 px-24 relative">
        <div className="reveal">
          <div className="section-label flex items-center gap-3 mb-4 text-xs font-bold tracking-[0.15em] uppercase text-(--accent)">
            ✦ My Journey
          </div>

          <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.5rem)] font-bold mb-4 leading-tight text-(--text)">
            Work{" "}
            <span className="bg-gradient-to-r from-pink-200 to-pink-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="experience-list reveal mt-12 relative">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-[var(--border)]" />

          {EXPERIENCE.map((exp, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr] gap-x-8 mb-12 relative"
            >
              {/* Dot */}
              <div className="flex flex-col items-center pt-1">
                <div
                  className={`w-[22px] h-[22px] rounded-full border-[3px] border-[var(--bg)] shadow-[0_0_15px_var(--glow)] ${exp.dotClass}`}
                />
              </div>

              {/* Card */}
              <div
                className="
            bg-[var(--card-bg)]
            backdrop-blur-xl
            border border-(--border)
            rounded-2xl
            p-7
            transition-all duration-300
            hover:border-pink-400/40
            hover:translate-x-1.5
          "
              >
                {/* Header */}
                <div className="flex flex-wrap gap-2 items-baseline mb-1">
                  <span className="text-lg font-bold text-(--text)">
                    {exp.role}
                  </span>

                  <span className={`text-sm font-semibold ${exp.companyClass}`}>
                    @ {exp.company}
                  </span>

                  <span className="ml-auto text-xs text-(--text2) bg-[var(--surface2)] px-3 py-1 rounded-full border border-(--border)">
                    {exp.period}
                  </span>
                </div>

                {/* Bullets */}
                <ul className="mt-4 flex flex-col gap-2">
                  {exp.description.map((point, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm text-(--text2) leading-relaxed"
                    >
                      <span className="text-(--accent) text-[0.5rem] mt-2">
                        ◆
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="relative py-24 px-24 text-center overflow-hidden"
        style={{ background: "var(--bg2)" }}
      >
        {/* Background Blobs */}
        <div
          className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full blur-[80px] opacity-[0.07] pointer-events-none animate-[blobFloat_8s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle,#f06292,#e91e8c)" }}
        />
        <div
          className="absolute -bottom-12 right-48 w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.07] pointer-events-none animate-[blobFloat_10s_ease-in-out_infinite_reverse]"
          style={{ background: "radial-gradient(circle,#ce93d8,#9c27b0)" }}
        />

        <div
          className="
      contact-card-inner reveal
      max-w-2xl mx-auto
      bg-[var(--card-bg)]
      backdrop-blur-3xl
      border border-(--border)
      rounded-[2.5rem]
      p-16
      relative
      shadow-[0_40px_80px_rgba(0,0,0,.1)]
    "
        >
          {/* Floating Teddy */}
          <span className="block text-[3.5rem] mb-6 animate-[teddyFloatSmall_3s_ease-in-out_infinite]">
            🧸
          </span>

          {/* Heading */}
          <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-4 text-(--text)">
            Let's Build Something{" "}
            <span className="bg-gradient-to-r from-pink-200 to-pink-400 bg-clip-text text-transparent">
              Wonderful
            </span>
          </h2>

          {/* Description */}
          <p className="text-(--text2) mb-8 leading-relaxed">
            Have a project in mind or just want to say hello? I'd love to hear
            from you. Let's create something amazing together.
          </p>

          {/* Email Badge */}
          <div className="flex justify-center mb-4">
            <a
              href={`mailto:${CONTACT.email}`}
              className="
          email-badge
          inline-flex items-center gap-3
          bg-pink-400/10
          border border-pink-400/25
          px-8 py-4
          rounded-xl
          text-(--accent)
          text-base font-medium
          transition-all duration-300
          hover:bg-pink-400/20
          hover:-translate-y-1
          hover:shadow-[0_10px_30px_var(--glow)]
        "
            >
              ✉️ {CONTACT.email}
            </a>
          </div>

          {/* CTA Button */}
          <a
            href={`mailto:${CONTACT.email}`}
            className="
        inline-flex items-center gap-2
        px-8 py-3
        rounded-full
        text-white
        font-semibold text-sm
        bg-linear-to-br from-pink-400 to-pink-600
        shadow-[0_4px_20px_rgba(240,98,146,.4)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_8px_30px_rgba(240,98,146,.5)]
      "
          >
            Send a Message 🌸
          </a>
        </div>
      </section>
      {/* ── FOOTER ── */}
      <footer
        className="
    bg-[var(--bg3)]
    border-t border-(--border)
    px-24 py-12
    flex items-center justify-between
  "
      >
        {/* Name */}
        <div
          className="
      font-['Playfair_Display']
      text-xl
      font-bold
      bg-linear-to-br from-pink-200 to-pink-400
      bg-clip-text
      text-transparent
    "
        >
          Nayan Bera
        </div>

        {/* Copyright */}
        <p className="text-xs text-(--text2)">
          Crafted with 🩷 and lots of ☕ · © 2025
        </p>

        {/* Floating Teddy */}
        <div className="animate-[teddyFloatSmall_4s_ease-in-out_infinite] [animation-delay:1s]">
          <svg
            width="44"
            height="50"
            viewBox="0 0 200 230"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="100" cy="152" rx="56" ry="63" fill="#f8a4c0" />
            <ellipse
              cx="100"
              cy="160"
              rx="34"
              ry="37"
              fill="#ffc8da"
              opacity="0.85"
            />
            <circle cx="100" cy="78" r="53" fill="#f8a4c0" />
            <circle cx="55" cy="34" r="23" fill="#f8a4c0" />
            <circle cx="55" cy="34" r="14" fill="#ffb3cc" opacity="0.9" />
            <circle cx="145" cy="34" r="23" fill="#f8a4c0" />
            <circle cx="145" cy="34" r="14" fill="#ffb3cc" opacity="0.9" />
            <circle cx="70" cy="92" r="12" fill="#ff85aa" opacity="0.55" />
            <circle cx="130" cy="92" r="12" fill="#ff85aa" opacity="0.55" />
            <circle cx="82" cy="72" r="11" fill="#2a0818" />
            <circle cx="85" cy="69" r="4.5" fill="white" />
            <circle cx="118" cy="72" r="11" fill="#2a0818" />
            <circle cx="121" cy="69" r="4.5" fill="white" />
            <ellipse cx="100" cy="90" rx="7" ry="5" fill="#d44070" />
            <path
              d="M90 99 Q100 110 110 99"
              stroke="#d44070"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <polygon points="100,126 87,118 87,134" fill="#e91e8c" />
            <polygon points="100,126 113,118 113,134" fill="#e91e8c" />
            <circle cx="100" cy="126" r="5.5" fill="#ff85aa" />
          </svg>
        </div>
      </footer>

      {/* Floating mini teddies */}
      {miniPositions.map((pos, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            right: pos.right,
            pointerEvents: "none",
            zIndex: 0,
            animation: `miniFloat ${pos.dur} ease-in-out infinite`,
            animationDelay: pos.delay,
          }}
        >
          <svg
            width="28"
            height="32"
            viewBox="0 0 200 230"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="100"
              cy="152"
              rx="56"
              ry="63"
              fill="#f8a4c0"
              opacity="0.45"
            />
            <circle cx="100" cy="78" r="53" fill="#f8a4c0" opacity="0.45" />
            <circle cx="55" cy="34" r="23" fill="#f8a4c0" opacity="0.45" />
            <circle cx="145" cy="34" r="23" fill="#f8a4c0" opacity="0.45" />
            <circle cx="82" cy="72" r="9" fill="#2a0818" opacity="0.35" />
            <circle cx="85" cy="69" r="3.5" fill="white" opacity="0.35" />
            <circle cx="118" cy="72" r="9" fill="#2a0818" opacity="0.35" />
            <circle cx="121" cy="69" r="3.5" fill="white" opacity="0.35" />
          </svg>
        </div>
      ))}
    </>
  );
}

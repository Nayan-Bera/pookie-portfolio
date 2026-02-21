"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --pink-100:#fff0f5; --pink-200:#ffd6e7; --pink-300:#ffb3cc;
    --pink-400:#ff85aa; --pink-500:#f06292; --pink-600:#e91e8c;
    --lavender:#e8d5f5;
    --bg:#1a0a10; --bg2:#22101a; --bg3:#2d1520;
    --surface:rgba(255,182,193,0.07); --surface2:rgba(255,182,193,0.12);
    --border:rgba(255,182,193,0.15);
    --text:#fdf0f5; --text2:#e0b0c8; --text3:#b88aaa;
    --accent:#ff85aa; --glow:rgba(240,98,146,0.3);
    --card-bg:rgba(255,182,193,0.06);
  }
  [data-theme="light"] {
    --bg:#fff5f8; --bg2:#ffeef4; --bg3:#ffdce8;
    --surface:rgba(180,40,80,0.07); --surface2:rgba(180,40,80,0.12);
    --border:rgba(180,40,80,0.18);
    --text:#1a0510; --text2:#4a1020; --text3:#7a2040;
    --accent:#c0306a; --glow:rgba(180,40,80,0.15);
    --card-bg:rgba(180,40,80,0.05);
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    transition: background 0.4s, color 0.4s;
  }
  body::before {
    content:''; position:fixed; inset:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events:none; z-index:0; opacity:0.4;
  }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:var(--bg); }
  ::-webkit-scrollbar-thumb { background:#ff85aa; border-radius:3px; }

  @keyframes blobFloat {
    0%,100%{transform:translate(0,0) scale(1);}
    33%{transform:translate(30px,-20px) scale(1.05);}
    66%{transform:translate(-20px,15px) scale(.95);}
  }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
  @keyframes glowPulse { 0%,100%{opacity:.7;transform:scale(1);} 50%{opacity:1;transform:scale(1.1);} }
  @keyframes teddyFloat {
    0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg);}
    50%{transform:translateX(-50%) translateY(-12px) rotate(1deg);}
  }
  @keyframes teddyDance {
    0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg);}
    25%{transform:translateX(-46%) translateY(-8px) rotate(-7deg);}
    75%{transform:translateX(-54%) translateY(-8px) rotate(7deg);}
  }
  @keyframes teddySpin {
    0%{transform:translateX(-50%) rotate(0deg) scale(1);}
    50%{transform:translateX(-50%) rotate(180deg) scale(1.15);}
    100%{transform:translateX(-50%) rotate(360deg) scale(1);}
  }
  @keyframes teddyBounce {
    0%,100%{transform:translateX(-50%) translateY(0) scale(1);}
    50%{transform:translateX(-50%) translateY(-22px) scale(1.06);}
  }
  @keyframes heartFloat {
    0%{opacity:1;transform:translateY(0) scale(1) rotate(0deg);}
    100%{opacity:0;transform:translateY(-90px) scale(.4) rotate(20deg);}
  }
  @keyframes teddyFloatSmall {
    0%,100%{transform:translateY(0);}
    50%{transform:translateY(-10px);}
  }
  @keyframes miniFloat {
    0%,100%{transform:translateY(0) rotate(0deg); opacity:.25;}
    50%{transform:translateY(-18px) rotate(4deg); opacity:.45;}
  }

  .teddy-anim-float { animation: teddyFloat 4s ease-in-out infinite; }
  .teddy-anim-dance { animation: teddyDance .5s ease-in-out 3; }
  .teddy-anim-spin  { animation: teddySpin .65s ease-in-out 1; }
  .teddy-anim-bounce{ animation: teddyBounce .4s ease-in-out 3; }

  .heart-particle {
    position:fixed; pointer-events:none; z-index:9999; font-size:1.2rem;
    animation: heartFloat 1.3s ease-out forwards;
  }
  .reveal { opacity:0; transform:translateY(30px); transition:opacity .7s ease,transform .7s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  .nav-link-item { color:var(--text2); text-decoration:none; font-size:.9rem; font-weight:500; transition:color .2s; }
  .nav-link-item:hover { color:var(--accent); }

  .section-label::after {
    content:''; flex:1; max-width:60px; height:1px; background:var(--accent); opacity:.5;
  }
  .about-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,#ff85aa,#e8d5f5); opacity:0; transition:opacity .3s;
  }
  .about-card:hover::before { opacity:1; }
  .project-card::after {
    content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,#ff85aa,transparent); opacity:0; transition:opacity .3s;
  }
  .project-card:hover::after { opacity:1; }

  [data-theme="light"] .tech-tag {
    background: rgba(180,40,80,.1);
    border-color: rgba(180,40,80,.2);
  }
  [data-theme="light"] #teddy-bubble { background:#fff0f5; color:#7a1030; border-color:rgba(180,40,80,.25); }
  [data-theme="light"] .email-badge { background:rgba(180,40,80,.08); border-color:rgba(180,40,80,.22); }
  [data-theme="light"] nav { background:rgba(255,240,248,0.9); }

  #teddy-bubble {
    position:absolute; top:-14px; right:10px;
    background:white; color:#a0204a;
    border-radius:1.2rem 1.2rem 1.2rem 0;
    padding:.45rem .9rem; font-size:.8rem; font-weight:700;
    box-shadow:0 4px 18px rgba(0,0,0,.18);
    opacity:0; transform:scale(.5) translateY(10px);
    transition:all .25s cubic-bezier(.34,1.56,.64,1);
    pointer-events:none; white-space:nowrap; z-index:10; border:1px solid rgba(240,98,146,.2);
  }
  #teddy-bubble.show { opacity:1; transform:scale(1) translateY(0); }
  #teddy-mood {
    position:absolute; bottom:130px; left:50%; transform:translateX(-50%);
    font-size:.68rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    color:var(--accent); opacity:0; transition:opacity .3s; white-space:nowrap;
  }
  #teddy-mood.show { opacity:1; }

  @media(max-width:1024px){
    .hero-illustration { display:none; }
    .hero-grid { grid-template-columns:1fr !important; padding:6rem 3rem 3rem !important; }
    .about-grid { grid-template-columns:1fr !important; gap:2.5rem !important; }
    .projects-grid { grid-template-columns:1fr !important; }
    section { padding:4rem 3rem !important; }
    footer { flex-direction:column !important; gap:1rem !important; text-align:center !important; padding:2rem 3rem !important; }
  }
  @media(max-width:640px){
    .hero-grid { padding:5rem 1.5rem 2rem !important; }
    section { padding:3rem 1.5rem !important; }
    .nav-links-list { display:none !important; }
    .tech-grid-2 { grid-template-columns:1fr !important; }
    .contact-card-inner { padding:2.5rem 1.5rem !important; }
  }
`;

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

  // Inject global CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(20px)",
          background: "rgba(26,10,16,0.78)",
          borderBottom: "1px solid var(--border)",
          transition: "background 0.4s",
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            background: "linear-gradient(135deg,#ffb3cc,#f06292)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          NB.
        </div>
        <ul
          className="nav-links-list"
          style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            alignItems: "center",
            margin: 0,
            padding: 0,
          }}
        >
          {["about", "projects", "experience", "contact"].map((s) => (
            <li key={s}>
              <a
                href={`#${s}`}
                className="nav-link-item"
                style={{ textTransform: "capitalize" }}
              >
                {s}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          title="Toggle theme"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            color: "var(--text)",
            transition: "all .3s",
          }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="hero-grid"
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          padding: "6rem 6rem 3rem",
          position: "relative",
          overflow: "hidden",
          gap: "3rem",
        }}
      >
        {/* Blobs */}
        <div
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.15,
            pointerEvents: "none",
            width: 500,
            height: 500,
            background: "radial-gradient(circle,#f06292,#e91e8c)",
            top: -100,
            left: -100,
            animation: "blobFloat 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.15,
            pointerEvents: "none",
            width: 400,
            height: 400,
            background: "radial-gradient(circle,#ce93d8,#9c27b0)",
            bottom: -50,
            right: 200,
            animation: "blobFloat 10s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.15,
            pointerEvents: "none",
            width: 300,
            height: 300,
            background: "radial-gradient(circle,#ffb3cc,#f06292)",
            top: "40%",
            right: -50,
            animation: "blobFloat 12s ease-in-out infinite",
          }}
        />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".5rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 100,
              padding: ".4rem 1rem",
              fontSize: ".8rem",
              color: "var(--accent)",
              marginBottom: "1.5rem",
              animation: "fadeSlideUp .6s ease both",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: "#4ade80",
                borderRadius: "50%",
                boxShadow: "0 0 8px #4ade80",
                animation: "pulse 2s infinite",
              }}
            />
            Available for Opportunities
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(3rem,6vw,5.5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: ".5rem",
              animation: "fadeSlideUp .7s ease .1s both",
            }}
          >
            <span
              style={{
                background: gradientText,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Nayan
            </span>
            <br />
            <span
              style={{
                background: gradientText,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Bera
            </span>
          </h1>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "var(--text2)",
              marginBottom: "1.5rem",
              letterSpacing: ".05em",
              textTransform: "uppercase",
              animation: "fadeSlideUp .7s ease .2s both",
            }}
          >
            Full-Stack Developer · Frontend Specialist
          </div>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "var(--text2)",
              maxWidth: 500,
              marginBottom: "2.5rem",
              animation: "fadeSlideUp .7s ease .3s both",
            }}
          >
            I design and build full-stack applications that blend seamless user
            experiences with powerful backend systems. Specialized in modern web
            development, API architecture, real-time features, and cloud-ready
            deployments.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              animation: "fadeSlideUp .7s ease .4s both",
            }}
          >
            <a
              href="#projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".8rem 2rem",
                background: "linear-gradient(135deg,#f06292,#e91e8c)",
                color: "white",
                borderRadius: 100,
                fontWeight: 600,
                fontSize: ".95rem",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(240,98,146,.4)",
                transition: "all .3s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(-2px)";
                (e.target as HTMLElement).style.boxShadow =
                  "0 8px 30px rgba(240,98,146,.5)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = "";
                (e.target as HTMLElement).style.boxShadow =
                  "0 4px 20px rgba(240,98,146,.4)";
              }}
            >
              View Projects ✦
            </a>
            <a
              href="mailto:nayanbera@example.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".8rem 2rem",
                background: "var(--surface)",
                color: "var(--text)",
                borderRadius: 100,
                fontWeight: 600,
                fontSize: ".95rem",
                textDecoration: "none",
                border: "1px solid var(--border)",
                transition: "all .3s",
              }}
            >
              Say Hello 🌸
            </a>
          </div>
        </div>

        {/* Teddy */}
        <div
          className="hero-illustration"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "fadeSlideUp .8s ease .2s both",
          }}
        >
          <div
            ref={wrapperRef}
            id="teddyWrapper"
            style={{
              position: "relative",
              width: 380,
              height: 450,
              cursor: "pointer",
              userSelect: "none",
            }}
            onMouseEnter={handleTeddyMouseEnter}
            onMouseLeave={handleTeddyMouseLeave}
            onClick={handleTeddyClick}
            onDoubleClick={handleTeddyDblClick}
          >
            <div
              id="teddyGlow"
              style={{
                position: "absolute",
                inset: -20,
                background: glowBg,
                borderRadius: "50%",
                animation: "glowPulse 4s ease-in-out infinite",
                transition: "background .5s",
              }}
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

            <div
              style={{
                position: "absolute",
                bottom: 108,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: ".7rem",
                color: "var(--text3)",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: ".4rem",
                animation: "fadeSlideUp 1s ease 2.5s both",
              }}
            >
              👆 Click &amp; hover me!
            </div>

            {/* Stack card */}
            <div
              style={{
                position: "absolute",
                top: 308,
                left: 0,
                right: 0,
                background: "var(--surface)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--border)",
                borderRadius: "2rem",
                padding: "1rem 1.5rem",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,.12)",
              }}
            >
              <div
                style={{
                  fontSize: ".72rem",
                  color: "var(--text3)",
                  marginBottom: ".4rem",
                }}
              >
                Current Stack
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: ".75rem",
                  fontSize: "1.3rem",
                }}
              >
                🟢 🔷 🟡 🐘 🍃 🐋
              </div>
              <div
                style={{
                  fontSize: ".72rem",
                  color: "var(--accent)",
                  marginTop: ".4rem",
                  fontWeight: 700,
                }}
              >
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
              With 3+ years of frontend and full-stack development experience, I
              build scalable application architectures, design modular service
              layers, and develop reliable APIs that integrate seamlessly across
              systems. I focus on clean, maintainable code and engineering
              practices that ensure performance, security, and long-term
              stability.
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
            {[
              ["🟢", "Node.js"],
              ["🔷", "TypeScript"],
              ["🐍", "Python"],
              ["🐘", "PostgreSQL"],
              ["🍃", "MongoDB"],
              ["🐋", "Docker"],
              ["⚛️", "React.js"],
              ["▲", "Next.js"],
              ["🩷", "GraphQL"],
            ].map(([icon, name]) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".75rem",
                  padding: ".85rem 1.1rem",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "1rem",
                  transition: "all .3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--surface2)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(240,98,146,.35)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--card-bg)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                  (e.currentTarget as HTMLElement).style.transform = "";
                }}
              >
                <div
                  style={{ fontSize: "1.5rem", width: 32, textAlign: "center" }}
                >
                  {icon}
                </div>
                <span
                  style={{
                    fontSize: ".9rem",
                    fontWeight: 500,
                    color: "var(--text)",
                  }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section
        id="projects"
        style={{
          padding: "6rem 6rem",
          position: "relative",
          background: "var(--bg2)",
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
            ✦ What I've Built
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
            Featured{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ffb3cc,#ce93d8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Projects
            </span>
          </h2>
        </div>
        <div
          className="projects-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "1.5rem",
            marginTop: "3rem",
          }}
        >
          {[
            {
              num: "01",
              status: "dev",
              statusText: "⏳ In Development",
              title: "Tripzy — Smart Hotel Booking System",
              desc: "A full hotel booking platform with automated document verification, secure JWT-based access, digital check-ins, and integrated Razorpay payment workflows.",
              tags: [
                "Node.js",
                "TypeScript",
                "React.js",
                "JWT",
                "Razorpay",
                "REST API",
              ],
              link: null,
              delay: ".1s",
            },
            {
              num: "02",
              status: "dev",
              statusText: "⏳ In Development",
              title: "ProctorLive — Online Exam & Monitoring System",
              desc: "A secure examination platform with live monitoring, keyboard lock, candidate event tracking, quick results, and real-time updates powered by WebSockets and JWT.",
              tags: [
                "Node.js",
                "TypeScript",
                "React.js",
                "WebSockets",
                "JWT",
                "REST API",
              ],
              link: null,
              delay: ".2s",
            },
            {
              num: "03",
              status: "backend",
              statusText: "✅ Backend Complete",
              title: "StaySphere — PG & Hostel Finder Platform",
              desc: "A property discovery and management platform enabling PG/hostel providers to manage listings while users search, filter, and book stays with secure payments and reCAPTCHA-protected authentication.",
              tags: [
                "Node.js",
                "TypeScript",
                "React.js",
                "RTK Query",
                "Razorpay",
                "reCAPTCHA v3",
                "JWT",
              ],
              link: null,
              delay: ".3s",
            },
            {
              num: "04",
              status: "live",
              statusText: "🟢 Live",
              title: "NexaFlow CRM — Role-Based Operations & Workflow Manager",
              desc: "A modular CRM solution featuring role-based access control, task pipelines, team collaboration tools, and automated workflow management with scalable backend architecture.",
              tags: ["Next.js", "TypeScript", "RBAC", "REST API"],
              link: "https://naystack.vercel.app",
              delay: ".4s",
            },
          ].map((p) => (
            <div
              key={p.num}
              className="project-card reveal"
              style={{
                background: "var(--card-bg)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--border)",
                borderRadius: "2rem",
                padding: "2rem",
                transition: "all .4s",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transitionDelay: p.delay,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(240,98,146,.35)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 24px 60px rgba(0,0,0,.12),0 0 40px var(--glow)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)";
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  color: "var(--border)",
                  lineHeight: 1,
                }}
              >
                {p.num}
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".4rem",
                  fontSize: ".72rem",
                  fontWeight: 700,
                  padding: ".3rem .8rem",
                  borderRadius: 100,
                  marginBottom: "1rem",
                  letterSpacing: ".05em",
                  width: "fit-content",
                  ...(p.status === "live"
                    ? {
                        background: "rgba(74,222,128,.15)",
                        color: "#16a34a",
                        border: "1px solid rgba(74,222,128,.35)",
                      }
                    : p.status === "backend"
                      ? {
                          background: "rgba(147,197,253,.15)",
                          color: "#1d4ed8",
                          border: "1px solid rgba(147,197,253,.35)",
                        }
                      : {
                          background: "rgba(251,191,36,.15)",
                          color: "#b45309",
                          border: "1px solid rgba(251,191,36,.35)",
                        }),
                }}
              >
                {p.statusText}
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: ".75rem",
                  lineHeight: 1.3,
                  paddingRight: "3rem",
                  color: "var(--text)",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: ".9rem",
                  lineHeight: 1.7,
                  color: "var(--text2)",
                  marginBottom: "1.5rem",
                  flex: 1,
                }}
              >
                {p.desc}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: ".5rem",
                  marginBottom: "1.5rem",
                }}
              >
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="tech-tag"
                    style={{
                      fontSize: ".72rem",
                      fontWeight: 600,
                      padding: ".25rem .7rem",
                      background: "rgba(240,98,146,.1)",
                      color: "var(--accent)",
                      borderRadius: 100,
                      border: "1px solid rgba(240,98,146,.2)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".4rem",
                    color: "var(--accent)",
                    fontSize: ".85rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "gap .2s",
                  }}
                >
                  View Live Project →
                </a>
              ) : (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".4rem",
                    color: "var(--text3)",
                    fontSize: ".85rem",
                  }}
                >
                  🔒 {p.status === "dev" ? "In Development" : "Coming Soon"}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section
        id="experience"
        style={{ padding: "6rem 6rem", position: "relative" }}
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
            ✦ My Journey
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
            Work{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ffb3cc,#f06292)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Experience
            </span>
          </h2>
        </div>
        <div
          className="experience-list reveal"
          style={{
            marginTop: "3rem",
            position: "relative",
            transitionDelay: ".15s",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 11,
              top: 0,
              bottom: 0,
              width: 1,
              background: "var(--border)",
            }}
          />
          {[
            {
              dot: "#22d3ee",
              role: "Full-Stack Web Developer",
              company: "@ Maity Innovations Pvt Ltd",
              companyColor: "#0e7490",
              period: "2025 — Present",
              bullets: [
                "Built multiple full-stack applications, handling both frontend and backend modules.",
                "Designed and implemented a multi-tenant SaaS platform with role-based access control and modular architecture.",
                "Managed Docker containers, created project-specific images, and monitored deployments on Dokploy.",
                "Integrated Razorpay, optimized CI/CD flows, and improved environment setups for production stability.",
                "Reviewed and merged branches, mentored teammates on backend fundamentals, and improved project workflows.",
              ],
            },
            {
              dot: "#60a5fa",
              role: "Web Developer Intern",
              company: "@ Maity Innovations Pvt Ltd",
              companyColor: "#1d4ed8",
              period: "2024 — 2025",
              bullets: [
                "Built dynamic Laravel applications including admin dashboards and CMS modules.",
                "Developed backend services in Node.js using JWT and reCAPTCHA with optimized search endpoints and scalable API design.",
                "Delivered responsive UI pages using HTML, CSS, and JavaScript.",
                "Collaborated with senior developers to refine architecture and improve maintainability.",
              ],
            },
          ].map((exp, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "0 2rem",
                marginBottom: "3rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: ".3rem",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "3px solid var(--bg)",
                    flexShrink: 0,
                    boxShadow: "0 0 15px var(--glow)",
                    background: exp.dot,
                  }}
                />
              </div>
              <div
                style={{
                  background: "var(--card-bg)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--border)",
                  borderRadius: "1.5rem",
                  padding: "1.75rem",
                  transition: "all .3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(240,98,146,.35)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateX(6px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                  (e.currentTarget as HTMLElement).style.transform = "";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".5rem",
                    alignItems: "baseline",
                    marginBottom: ".25rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    {exp.role}
                  </span>
                  <span
                    style={{
                      fontSize: ".9rem",
                      fontWeight: 600,
                      color: exp.companyColor,
                    }}
                  >
                    {exp.company}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: ".8rem",
                      color: "var(--text2)",
                      background: "var(--surface2)",
                      padding: ".2rem .75rem",
                      borderRadius: 100,
                      border: "1px solid var(--border)",
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    marginTop: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: ".5rem",
                    padding: 0,
                  }}
                >
                  {exp.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      style={{
                        fontSize: ".9rem",
                        color: "var(--text2)",
                        lineHeight: 1.6,
                        display: "flex",
                        gap: ".75rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--accent)",
                          fontSize: ".5rem",
                          marginTop: ".4rem",
                          flexShrink: 0,
                        }}
                      >
                        ◆
                      </span>
                      {b}
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
        style={{
          padding: "6rem 6rem",
          position: "relative",
          background: "var(--bg2)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.07,
            pointerEvents: "none",
            width: 500,
            height: 500,
            background: "radial-gradient(circle,#f06292,#e91e8c)",
            top: -100,
            left: -100,
            animation: "blobFloat 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.07,
            pointerEvents: "none",
            width: 400,
            height: 400,
            background: "radial-gradient(circle,#ce93d8,#9c27b0)",
            bottom: -50,
            right: 200,
            animation: "blobFloat 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="contact-card-inner reveal"
          style={{
            maxWidth: 640,
            margin: "0 auto",
            background: "var(--card-bg)",
            backdropFilter: "blur(30px)",
            border: "1px solid var(--border)",
            borderRadius: "2.5rem",
            padding: "4rem",
            position: "relative",
            boxShadow: "0 40px 80px rgba(0,0,0,.1)",
          }}
        >
          <span
            style={{
              fontSize: "3.5rem",
              marginBottom: "1.5rem",
              display: "block",
              animation: "teddyFloatSmall 3s ease-in-out infinite",
            }}
          >
            🧸
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "var(--text)",
            }}
          >
            Let's Build Something{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ffb3cc,#f06292)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Wonderful
            </span>
          </h2>
          <p
            style={{
              color: "var(--text2)",
              marginBottom: "2rem",
              lineHeight: 1.7,
            }}
          >
            Have a project in mind or just want to say hello? I'd love to hear
            from you. Let's create something amazing together.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <a
              href="mailto:nayanbera@example.com"
              className="email-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".75rem",
                background: "rgba(240,98,146,.1)",
                border: "1px solid rgba(240,98,146,.25)",
                padding: "1rem 2rem",
                borderRadius: "1rem",
                color: "var(--accent)",
                fontSize: "1rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all .3s",
                marginBottom: "2rem",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(240,98,146,.2)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 10px 30px var(--glow)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(240,98,146,.1)";
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              ✉️ nayanbera@example.com
            </a>
          </div>
          <a
            href="mailto:nayanbera@example.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".5rem",
              padding: ".8rem 2rem",
              background: "linear-gradient(135deg,#f06292,#e91e8c)",
              color: "white",
              borderRadius: 100,
              fontWeight: 600,
              fontSize: ".95rem",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(240,98,146,.4)",
              transition: "all .3s",
            }}
          >
            Send a Message 🌸
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "var(--bg3)",
          padding: "3rem 6rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            background: "linear-gradient(135deg,#ffb3cc,#f06292)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Nayan Bera
        </div>
        <p style={{ fontSize: ".8rem", color: "var(--text2)" }}>
          Crafted with 🩷 and lots of ☕ · © 2025
        </p>
        <div
          style={{
            animation: "teddyFloatSmall 4s ease-in-out infinite",
            animationDelay: "1s",
          }}
        >
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

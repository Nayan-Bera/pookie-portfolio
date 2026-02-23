import {
  FaGithub,
  FaNodeJs,
  FaPython,
} from "react-icons/fa6";

import {
  RiNextjsFill,
  RiReactjsLine,
} from "react-icons/ri";

import {
  SiJavascript,
  SiTailwindcss,
  SiTypescript,
  SiMongodb,
  SiMysql,
} from "react-icons/si";

/* ================= PERSONAL INFO ================= */

export const PERSONAL_INFO = {
  name: "Srilekha Paul",
  role: "Web Developer",
  location: "Duttapulia, Nadia, West Bengal",
};

/* ================= HERO SECTION ================= */

export const HERO_CONTENT =
  "Motivated Web Developer with a strong foundation in front-end development and expanding backend skills. I build responsive, user-friendly web applications using modern technologies and clean coding practices.";

/* ================= ABOUT SECTION ================= */

export const ABOUT_TEXT =
  "I am a Computer Science student passionate about developing scalable and responsive web applications. I enjoy transforming ideas into practical digital solutions while continuously learning new technologies. My focus is on writing clean, maintainable code and building performance-optimized applications.";

/* ================= TECH STACK ================= */

export const techs = [
  { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" /> },
  { name: "React.js", icon: <RiReactjsLine className="text-cyan-400" /> },
  { name: "Next.js", icon: <RiNextjsFill className="text-gray-300" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-sky-400" /> },
  { name: "TypeScript", icon: <SiTypescript className="text-blue-400" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
  { name: "Express.js", icon: <FaNodeJs className="text-green-400" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-green-600" /> },
  { name: "MySQL", icon: <SiMysql className="text-blue-600" /> },
  { name: "Python", icon: <FaPython className="text-yellow-300" /> },
  { name: "Git & GitHub", icon: <FaGithub className="text-gray-300" /> },
];

/* ================= PROJECTS ================= */

export const PROJECTS = [
  {
    title: "Personal Portfolio Website",
    description:
      "Designed and deployed a fully responsive portfolio website to showcase projects and technical skills. Implemented modern UI principles, optimized performance, and ensured cross-device compatibility.",
    technologies: [
      "Next.js",
      "React.js",
      "JavaScript",
      "Tailwind CSS",
      "Vercel",
    ],
    link: "https://sri-paul.vercel.app",
    status: "Live",
  },
  {
    title: "NexaFlow CRM — Role-Based Operations & Workflow Manager",
    description:
      "Built a scalable CRM application featuring role-based access control (RBAC), task management pipelines, and workflow automation. Developed secure REST APIs and implemented modular backend architecture.",
    technologies: [
      "Next.js",
      "TypeScript",
      "REST API",
      "RBAC",
      "Git",
    ],
    link: "",
    status: "Project Completed",
  },
];

/* ================= EXPERIENCE ================= */

export const EXPERIENCE = [
  {
    role: "Python Developer Intern",
    company: "Kodbud",
    period: "Sep 2025 — Present",
    dotClass: "bg-yellow-400",
    companyClass: "text-yellow-400",
    description: [
      "Worked on backend development tasks using Python.",
      "Assisted in building and testing application features.",
      "Improved debugging and problem-solving skills through real-world projects.",
    ],
  },
  {
    role: "Web Developer Intern",
    company: "VaultofCode",
    period: "Jul 2025 — Aug 2025",
    dotClass: "bg-blue-400",
    companyClass: "text-blue-400",
    description: [
      "Developed responsive UI components using modern frontend technologies.",
      "Collaborated with team members to enhance performance and usability.",
    ],
  },
  {
    role: "Web Developer Intern",
    company: "Codsoft",
    period: "Jun 2025 — Jul 2025",
    dotClass: "bg-green-400",
    companyClass: "text-green-400",
    description: [
      "Built small-scale web applications and landing pages.",
      "Gained practical experience in frontend workflows and deployment.",
    ],
  },
];

/* ================= CONTACT ================= */

export const CONTACT = {
  email: "srilekhapaul2003@gmail.com",
  github: "https://github.com/your-github-username",
  portfolio: "https://sri-paul.vercel.app",
};
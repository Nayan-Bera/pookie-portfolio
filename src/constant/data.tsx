
import { FaDocker, FaNodeJs, FaPython } from "react-icons/fa6";
import { RiNextjsFill, RiReactjsLine, RiTwitterXLine } from "react-icons/ri";
import {
  SiGraphql,
  SiMongodb,
  SiPostgresql,
  SiTypescript,
} from "react-icons/si";

export const HERO_CONTENT =
  "I design and build full-stack applications that blend seamless user experiences with powerful backend systems. Specialized in modern web development, API architecture, real-time features, and cloud-ready deployments.";

export const ABOUT_TEXT =
  "With 1+ years of backend and full-stack development experience, I build scalable application architectures, design modular service layers, and develop reliable APIs that integrate seamlessly across systems. I focus on clean, maintainable code and engineering practices that ensure performance, security, and long-term stability.";

export const techs = [
  { name: "Node.js", icon: <FaNodeJs className="text-green-400" /> },
  { name: "TypeScript", icon: <SiTypescript className="text-blue-400" /> },
  { name: "Python", icon: <FaPython className="text-yellow-300" /> },
  { name: "PostgreSQL", icon: <SiPostgresql className="text-sky-400" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
  // { name: "Redis", icon: <SiRedis className="text-red-400" /> },
  { name: "Docker", icon: <FaDocker className="text-blue-300" /> },
  { name: "React.js", icon: <RiReactjsLine className="text-blue-500" /> },
  { name: "Next.js", icon: <RiNextjsFill className="text-gray-300" /> },
  // { name: "Kubernetes", icon: <SiKubernetes className="text-blue-500" /> },
  // { name: "AWS", icon: <FaAws className="text-orange-400" /> },
  { name: "GraphQL", icon: <SiGraphql className="text-pink-500" /> },
];

export const PROJECTS = [
  {
    title: "Tripzy — Smart Hotel Booking System",
    description:
      "A full hotel booking platform with automated document verification, secure JWT-based access, digital check-ins, and integrated Razorpay payment workflows.",
    technologies: [
      "Node.js",
      "TypeScript",
      "React.js",
      "JWT",
      "Razorpay",
      "REST API",
    ],
    link: "",
    status: "In Development",
  },
  {
    title: "ProctorLive — Online Exam & Monitoring System",
    description:
      "A secure examination platform with live monitoring, keyboard lock, candidate event tracking, quick results, and real-time updates powered by WebSockets and JWT.",
    technologies: [
      "Node.js",
      "TypeScript",
      "React.js",
      "WebSockets",
      "JWT",
      "REST API",
    ],
    link: "",
    status: "In Development",
  },
  {
    title: "StaySphere — PG & Hostel Finder Platform",
    description:
      "A property discovery and management platform enabling PG/hostel providers to manage listings while users search, filter, and book stays with secure payments and reCAPTCHA-protected authentication.",
    technologies: [
      "Node.js",
      "TypeScript",
      "React.js",
      "RTK Query",
      "Razorpay",
      "reCAPTCHA v3",
      "JWT",
    ],
    link: "",
     status: "Backend Complete",
  },
  {
    title: "NexaFlow CRM — Role-Based Operations & Workflow Manager",
    description:
      "A modular CRM solution featuring role-based access control, task pipelines, team collaboration tools, and automated workflow management with scalable backend architecture.",
    technologies: ["Next.js", "TypeScript", "RBAC", "REST API"],
    link: "https://naystack.vercel.app",
    status: "Live",
  },
];

export const EXPERIENCE = [
  {
    role: "Full-Stack Web Developer",
    company: "Maity Innovations Pvt Ltd",
    period: "2025 — Present",
    dotClass: "bg-cyan-400",
    companyClass: "text-cyan-400",
    description: [
      "Built multiple full-stack applications, handling both frontend and backend modules.",
      "Designed and implemented a multi-tenant SaaS platform with role-based access control and modular architecture.",
      "Managed Docker containers, created project-specific images, and monitored deployments on Dokploy.",
      "Integrated Razorpay, optimized CI/CD flows, and improved environment setups for production stability.",
      "Reviewed and merged branches, mentored teammates on backend fundamentals, and improved project workflows.",
    ],
  },
  {
    role: "Web Developer Intern",
    company: "Maity Innovations Pvt Ltd",
    period: "2024 — 2025",
    dotClass: "bg-blue-400",
    companyClass: "text-blue-400",
    description: [
      "Built dynamic Laravel applications including admin dashboards and CMS modules.",
      "Developed backend services in Node.js using JWT and reCAPTCHA with optimized search endpoints and scalable API design.",
      "Delivered responsive UI pages using HTML, CSS, and JavaScript.",
      "Collaborated with senior developers to refine architecture and improve maintainability.",
    ],
  },
];


export const CONTACT = {
  email: "nayanberaofficial@gmail.com",
};
import {
  IconBrandFacebookFilled,
  IconBrandGithubFilled,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export const menuData = [
  {
    title: "HOME",
    route: "#home",
  },
  {
    title: "ABOUT",
    route: "#about",
  },
  {
    title: "WORK",
    route: "#projects",
  },
  {
    title: "SERVICES",
    route: "#services",
  },
  {
    title: "SKILLS",
    route: "#tools",
  },
  {
    title: "CONTACT",
    route: "#contact",
  },
];

export const socialLinks = [
  {
    name: "Facebook",
    route: "https://www.facebook.com/Aj23Mah",
    icons: (
      <IconBrandFacebookFilled
        stroke={2}
        style={{ height: "100%", width: "100%" }}
      />
    ),
    color: "#0862F7",
  },
  {
    name: "Instagram",
    route: "https://www.instagram.com/mah._.ajay/",
    icons: (
      <IconBrandInstagram
        stroke={2}
        style={{ height: "100%", width: "100%" }}
      />
    ),
    color: "#C13584",
  },
  {
    name: "Linkedin",
    route: "https://www.linkedin.com/in/ajaymaharjan",
    icons: (
      <IconBrandLinkedin stroke={2} style={{ height: "100%", width: "100%" }} />
    ),
    color: "#007AB5",
  },
  {
    name: "Github",
    route: "https://github.com/Aj23Mah",
    icons: (
      <IconBrandGithubFilled
        stroke={2}
        style={{ height: "100%", width: "100%" }}
      />
    ),
    color: "#000",
  },
];

export const serviceData = [
  {
    number: "01",
    title: "Full-Stack Web Development",
    description: `Complete web applications built with responsive interfaces, reliable backend systems, and maintainable architecture.`,
    image: "/image/icons/IconDeviceImacCode.png",
  },
  {
    number: "02",
    title: "API Development & Integration",
    description: `Well-structured APIs that connect applications, services, and data reliably and efficiently.`,
    image: "/image/icons/IconApi.png",
  },
  {
    number: "03",
    title: "Database Design & Management",
    description: `Clean and scalable database structures designed for reliable data storage, performance, and maintainability.`,
    image: "/image/icons/IconBrandDatabricks.png",
  },
  {
    number: "04",
    title: "Testing & Debugging",
    description: `Finding problems, improving reliability, and making applications more stable before they reach users.`,
    image: "/image/icons/IconSettingsSearch.png",
  },
  {
    number: "05",
    title: "Frontend Development",
    description: `Responsive and intuitive interfaces focused on usability, performance, and a consistent user experience.`,
    image: "/image/icons/IconFingerprintScan.png",
  },
  {
    number: "06",
    title: "Backend Development",
    description: `Secure and maintainable backend systems that handle application logic, data, authentication, and integrations.`,
    image: "/image/icons/IconReplace.png",
  },
];

export const projectData = [
  {
    number: "01",
    title: "Daily Dazzle",
    category: "E-COMMERCE WEB APP",
    role: "Full-Stack Development",
    description: `A modern e-commerce web application designed for streamlined product discovery and daily deals. Features curated product categories, interactive cart management, dynamic search, and a responsive shopping layout.`,
    contribution: `Designed and built the full-stack architecture, dynamic deal catalog, responsive layout, and product data flow.`,
    technologies: [
      "React",
      "Next.js",
      "Mantine",
      "Tailwind CSS",
      "Typescript",
      "Nest.js",
      "PostgreSQL",
    ],
    image: "/image/dailyDazzle.png",
    link: "https://dailydazzle.nxin.tech/",
    github: "https://github.com/Aj23Mah",
  },
  {
    number: "02",
    title: "Biruwa Pasa",
    category: "E-COMMERCE PLATFORM",
    role: "Full-Stack Development",
    description: `An online plant store and botanical marketplace designed to connect buyers with healthy indoor and outdoor plants. Includes plant cataloging, custom order processing, cart integration, and plant care guidance.`,
    contribution: `Developed the application focusing on plant catalog management, shopping cart integration, custom order handling, and data storage.`,
    technologies: [
      "React",
      "Next.js",
      "Mantine",
      "Tailwind CSS",
      "Typescript",
      "Nest.js",
      "PostgreSQL",
    ],
    image: "/image/biruwa.png",
    link: "https://biruwapasa.com/",
    github: "https://github.com/Aj23Mah",
  },
  {
    number: "03",
    title: "Yuma",
    category: "FULL-STACK WEB APP",
    role: "Full-Stack Development",
    description: `A modern full-stack web application engineered for interactive user experiences and streamlined online ordering. Features curated product cataloging, state management workflows, and a responsive shopping layout.`,
    contribution: `Architected the full-stack ordering flow, state management workflows, and responsive interface layout.`,
    technologies: [
      "React",
      "Next.js",
      "Mantine",
      "Tailwind CSS",
      "Typescript",
      "Nest.js",
      "PostgreSQL",
    ],
    image: "/image/yuma.png",
    link: "https://yuma9.com/",
    github: "https://github.com/Aj23Mah",
  },
  {
    number: "04",
    title: "Food Chow",
    category: "WEB PLATFORM",
    role: "Frontend Development",
    description: `A sleek digital web platform engineered for high-performance interactive experiences. Built with modern React frameworks, smooth visual transitions, and custom layout components.`,
    contribution: `Built responsive UI components, implemented layout transitions, and optimized performance across desktop and mobile devices.`,
    technologies: ["React", "JavaScript", "Tailwind CSS", "Mantine", "Motion"],
    image: "/image/FoodChow.jpg",
    link: "https://food-ordering-brown.vercel.app/",
    github: "https://github.com/Aj23Mah",
  },
];

export const whatIDo = [
  "Full-Stack Web Development",
  "REST API Development",
  "Database Design & Management",
  "Frontend Development",
  "Backend Development",
  "Testing & Debugging",
  "API Integration",
  "Responsive Web Design",
];

export const experiencesList = [
  {
    label: "Junior JS Developer",
    company: "Next In Tech Pvt Ltd",
    duration: "Sep 2024 – Present",
    location: "Tahachal, Kathmandu",
    description: "Developing scalable web applications, REST APIs, and interactive UI components with modern JavaScript frameworks.",
  },
  {
    label: "Internship (Full Stack JS)",
    company: "Krafters Technology",
    duration: "Mar 2024 – Aug 2024 (6 Months)",
    location: "Kumaripati, Lalitpur",
    description: "Hands-on experience developing full-stack web solutions, database modeling, and collaborating in agile sprints.",
  },
];

export const educationList = [
  {
    studyAt: "Krafters Technology",
    location: "Kumaripati, Lalitpur",
    course: "Full Stack JS Development Certification",
    year: "2024",
  },
];

export const toolsList = [
  { name: "HTML5", img: "/image/html-logo.png" },
  { name: "CSS3", img: "/image/css-logo.png" },
  { name: "JavaScript", img: "/image/JS-logo.png" },
  { name: "React", img: "/image/React_logo.webp" },
  { name: "Next.js", img: "/image/Next-logo.webp" },
  { name: "Node.js", img: "/image/node-logo.png" },
  { name: "NestJS", img: "/image/Nest-logo.webp" },
  { name: "PostgreSQL", img: "/image/postgresql-logo.png" },
];

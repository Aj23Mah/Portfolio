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
    technologies: ["Next.js", "React", "Tailwind CSS", "Node.js"],
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
    technologies: ["Next.js", "React", "Node.js", "Express", "MongoDB"],
    image: "/image/biruwa.png",
    link: "https://biruwapasa.com/",
    github: "https://github.com/Aj23Mah",
  },
  {
    number: "03",
    title: "Yuma",
    category: "WEB PLATFORM",
    role: "Frontend Development",
    description: `A sleek digital web platform engineered for high-performance interactive experiences. Built with modern React frameworks, smooth visual transitions, and custom layout components.`,
    contribution: `Built responsive UI components, implemented layout transitions, and optimized performance across desktop and mobile devices.`,
    technologies: ["React", "Next.js", "JavaScript", "CSS3"],
    image: "/image/yuma.png",
    link: "https://yuma9.com/",
    github: "https://github.com/Aj23Mah",
  },
  {
    number: "04",
    title: "Food Chow",
    category: "FULL-STACK WEB APP",
    role: "Full-Stack Development",
    description: `A full-stack food ordering platform designed for fast restaurant browsing and order placement. Features interactive menu categories, real-time cart state management, and mobile checkout.`,
    contribution: `Architected the full-stack ordering flow, state management workflows, and responsive interface layout.`,
    technologies: ["React", "Next.js", "Node.js", "Tailwind CSS"],
    image: "/image/FoodChow.jpg",
    link: "https://food-ordering-brown.vercel.app/",
    github: "https://github.com/Aj23Mah",
  },
];

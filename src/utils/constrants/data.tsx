import {
  IconBrandFacebookFilled,
  IconBrandGithubFilled,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export const menuData = [
  {
    title: "Home",
    route: "#home",
  },
  {
    title: "About",
    route: "#about",
  },
  {
    title: "Work",
    route: "#projects",
  },
  {
    title: "Service",
    route: "#services",
  },
  {
    title: "Contact",
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
    title: "Authentication and Authorization",
    description: `Implementing secure user authentication, JWT/OAuth2 flows, role-based access control (RBAC), and session management.`,
    image: "/image/icons/IconFingerprintScan.png",
  },
  {
    title: "Deployment and Maintenance",
    description: `Deploying web applications on Vercel, VPS, and cloud platforms with automated CI/CD pipelines and zero-downtime maintenance.`,
    image: "/image/icons/IconReplace.png",
  },
  {
    title: "Web Development",
    description: `Building responsive, high-performance full-stack web applications using Next.js, React, Node.js, and modern CSS tools.`,
    image: "/image/icons/IconDeviceImacCode.png",
  },
  {
    title: "Testing and Debugging",
    description: `Comprehensive frontend and backend testing, issue tracking, memory optimization, and fast bug resolution.`,
    image: "/image/icons/IconSettingsSearch.png",
  },
  {
    title: "Database Design and Management",
    description: `Architecting scalable relational (PostgreSQL, MySQL) and NoSQL (MongoDB) schemas with optimized queries and indexing.`,
    image: "/image/icons/IconBrandDatabricks.png",
  },
  {
    title: "API Development and Integration",
    description: `Designing clean RESTful and GraphQL APIs with robust security, detailed documentation, and third-party integrations.`,
    image: "/image/icons/IconApi.png",
  },
];

export const projectData = [
  {
    title: "Daily Dazzle",
    description: `A modern e-commerce web application featuring daily deal highlights, curated product categories, dynamic search, and responsive layout. Built with Next.js & Tailwind CSS.`,
    image: "/image/dailyDazzle.png",
    link: "https://dailydazzle.nxin.tech/",
    github: "https://github.com/Aj23Mah",
  },
  {
    title: "Biruwa Pasa",
    description: `An online plant store and botanical marketplace featuring plant cataloging, shopping cart integration, custom order management, and plant care tips.`,
    image: "/image/biruwa.png",
    link: "https://biruwapasa.com/",
    github: "https://github.com/Aj23Mah",
  },
  {
    title: "Yuma",
    description: `A sleek digital web platform designed with React & Next.js, focusing on dynamic animations, interactive user experience, and optimized mobile performance.`,
    image: "/image/yuma.png",
    link: "https://yuma9.com/",
    github: "https://github.com/Aj23Mah",
  },
  {
    title: "Food Chow",
    description: `A full-stack food ordering platform with interactive menu management, real-time cart state, smooth page transitions, and responsive mobile checkout UI.`,
    image: "/image/FoodChow.jpg",
    link: "https://food-ordering-brown.vercel.app/",
    github: "https://github.com/Aj23Mah",
  },
  //   {
  //     title: "Kurus",
  //     description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
  //     image: "/image/FoodChow.jpg",
  //     link: "https://kuruscollections.com/",
  // github: "https://github.com/Aj23Mah",
  //   },
];

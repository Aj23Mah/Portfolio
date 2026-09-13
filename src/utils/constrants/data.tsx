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
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/icons/IconFingerprintScan.png",
  },
  {
    title: "Deployment and Maintenance",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/icons/IconReplace.png",
  },
  {
    title: "Web Development",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/icons/IconDeviceImacCode.png",
  },
  {
    title: "Testing and Debugging",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/icons/IconSettingsSearch.png",
  },
  {
    title: "Database Design and Management",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/icons/IconBrandDatabricks.png",
  },
  {
    title: "API Development and Integration",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/icons/IconApi.png",
  },
];

export const projectData = [
  {
    title: "Daily Dazzle",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/dailyDazzle.png",
    link: "https://dailydazzle.nxin.tech/",
  },
  {
    title: "Biruwa Pasa",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/biruwa.png",
    link: "https://biruwapasa.com/",
  },
  {
    title: "Yuma",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/yuma.png",
    link: "https://yuma9.com/",
  },
  {
    title: "Food Chow",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    image: "/image/FoodChow.jpg",
    link: "https://food-ordering-brown.vercel.app/",
  },
  //   {
  //     title: "Kurus",
  //     description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
  //     image: "/image/FoodChow.jpg",
  //     link: "https://kuruscollections.com/",
  //   },
];

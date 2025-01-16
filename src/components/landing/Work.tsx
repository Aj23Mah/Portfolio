"use client"
import React from "react";
import projectImg1 from '../../../public/image/FoodChow.jpg'
import projectImg2 from '../../../public/image/krafters.jpg'
import projectImg3 from '../../../public/image/KrafterSchool.jpg'
import projectImg4 from '../../../public/image/chat-app.jpg'
import projectImg5 from '../../../public/image/chat-app1.jpg'
import projectImg6 from '../../../public/image/chat-app2.jpg'
import projectImg7 from '../../../public/image/food-chowFull.png'
import projectImg8 from '../../../public/image/krafterSchoolFull.png'
import projectImg9 from '../../../public/image/krafter.devFull.png'
import Image from "next/image";
import useScrollPosition from "@/utils/hooks/useScrollPosition";

export default function Work() {
    const myWork = [
        {
            id: 1,
            title: "Krafter.dev - Company Portfolio Website",
            description: "Redesigned and improved the UI components of the company's portfolio website, ensuring a modern and user-friendly experience.",
            features: [
                "Enhanced UI/UX design",
                "Responsive layout for different screen sizes",
                "Optimized performance and accessibility",
            ],
            techStack: ["Next.js", "Tailwind CSS", "React"],
            image: [
                projectImg2,
                projectImg9,
            ],
            liveDemo: "",
            github: "",
        },
        {
            id: 2,
            title: "Krafter School Website",
            description: "Migrated the Krafter School website from a static HTML, CSS, and JavaScript implementation to Next.js for better scalability and maintainability.",
            features: [
                "Dynamic routing and server-side rendering",
                "Improved animations using React Motion",
                "Enhanced SEO and performance",
            ],
            techStack: ["Next.js", "React Motion", "Tailwind CSS"],
            image: [
                projectImg3,
                projectImg8,
            ],
            liveDemo: "",
            github: "",
        },
        {
            id: 3,
            title: "Travel and Tourism CMS",
            description: "Developed a full-stack CMS for a travel and tourism platform, featuring a user-friendly frontend, a robust backend, and an intuitive dashboard.",
            features: [
                "Dynamic package and category management",
                "Comprehensive admin dashboard",
                "Integrated API for seamless frontend-backend communication",
            ],
            techStack: ["Next.js", "NestJS", "Vue.js", "PostgreSQL"],
            image: [
                projectImg1,
                projectImg1,
                projectImg4
            ],
            liveDemo: "",
            github: "",
        },
        {
            id: 4,
            title: "Food Chow",
            description: "A full-stack e-commerce platform with product listing",
            features: [
                "UI design fully animation with react motion",
                "Optimized Redux state management, reducing authentication time.",
                "Enhanced user engagement through improved UI/UX design.",
            ],
            techStack: [
                 "Next",
                 "Tailwind CSS",
                 "react motion",
            ],
            image: [
                projectImg1,
                projectImg7,
            ],
            liveDemo: "https://food-ordering-brown.vercel.app/",
            github: "",
        },
        {
            id: 5,
            title: "Chat Application",
            description: "A full-stack e-commerce platform with product listing.",
            features: [
                 "Developed a real-time chat application with Redux for authentication.",
                 "Optimized Redux state management, reducing authentication time.",
                 "Enhanced user engagement through improved UI/UX design.",
            ],
            techStack: [
                 "MERN stack",
                 "Redux",
                 "Tailwind CSS",
            ],
            image: [
                projectImg4,
                projectImg5,
                projectImg6,
            ],
            liveDemo: "",
            github: "",
        },
        {
            id: 6,
            title: "E-commerce Website",
            description: "A full-stack e-commerce platform with product listing.",
            features: [
                 "Built a comprehensive e-commerce platform with secure Firebase authentication.",
                 "Developed an intuitive Admin Dashboard, streamlining product management for store owners.",
                 "Delivered a seamless shopping experience, contributing to increased client sales.",
            ],
            techStack: [
                 "React",
                 "Tailwind CSS",
                 "Firebase",
            ],
            image: [
                projectImg1,
                projectImg1,
                projectImg4
            ],
            liveDemo: "",
            github: "",
        },
    ];

    const scrollPosition = useScrollPosition();

    return (
        <section className={`py-10 px-[15vw] text-black project-bg ${scrollPosition > 2200 ? 'dark text-white' : ''}`}>
            <div className="text-2xl text-center mb-4">Explore Latest Work</div>
            <div className="md:text-[2.5rem] text-3xl font-bold text-center mb-6">Project</div>
            <div>
                {myWork.map((item, index) => (
                    <div
                        key={index}
                        className={`sticky top-36 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 rounded-3xl p-10   ${scrollPosition > 2200 ? 'project-card' : 'bg-white text-black'}`}
                    >
                        <div>
                            <div className="text-2xl font-bold mb-2">{item.title}</div>
                            <div className="text-lg">{item.description}</div>
                            <ul className="list-disc list-inside mb-4">
                                {item.features.map((feature, index) => (
                                    <li key={index} className="">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm mb-4">
                                <strong>Tech Stack:</strong> {item.techStack.join(", ")}
                            </p>
                            <a
                                href={item.liveDemo}
                                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-700 hover:text-gray-200 font-bold transition"
                            >
                                View Demo
                            </a>
                        </div>
                        <div className="rounded-2xl overflow-hidden">
                            <Image src={item.image[0]} alt={item.title} className="w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
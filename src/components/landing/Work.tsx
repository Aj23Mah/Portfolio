"use client"
import React, {useState} from "react";
import projectImg1 from '@/assets/image/FoodChow.jpg'
import projectImg2 from '@/assets/image/krafters.jpg'
import projectImg3 from '@/assets/image/KrafterSchool.jpg'
import projectImg4 from '@/assets/image/chat-app.jpg'
import projectImg5 from '@/assets/image/chat-app1.jpg'
import projectImg6 from '@/assets/image/chat-app2.jpg'
import projectImg7 from '@/assets/image/food-chowFull.png'
import projectImg8 from '@/assets/image/krafterSchoolFull.png'
import projectImg9 from '@/assets/image/krafter.devFull.png'
import Image from "next/image";

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
            liveDemo: "",
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

    const [openModal, setOpenModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const openProjectModal = (project: any) => {
        setSelectedProject(project);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedProject(null);
    };

    return (
        <section className="py-10 px-[15vw] text-white project-bg">
            <div className="text-2xl text-center mb-4">Explore Latest Work</div>
            <div className="md:text-[2.5rem] text-3xl font-bold text-center mb-6">Project</div>
            <div>
                {myWork.map((item, index) => (
                    <div
                        key={index}
                        className="sticky top-36 grid grid-cols-1 lg:grid-cols-2 gap-6 border mb-10 rounded-3xl p-10 bg-gray-900"
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
                            <button
                                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-700 hover:text-gray-200 font-bold transition"
                                onClick={() => openProjectModal(item)}
                            >
                                View Demo
                            </button>
                        </div>
                        <div className="rounded-2xl overflow-hidden">
                            <Image src={item.image[0]} alt={item.title} className="w-full" />
                        </div>
                    </div>
                ))}
            </div>

            {openModal && selectedProject && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-3xl w-full relative overflow-y-scroll h-full">
                        <button
                            className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4">{selectedProject.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedProject.image.map((image: string, index: number) => (
                                <div key={index} className="rounded-lg overflow-auto">
                                    <Image
                                        src={image}
                                        alt={`${selectedProject.title} Image ${index + 1}`}
                                        className="rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition mt-4"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
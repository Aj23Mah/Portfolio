import React from "react";
import img from "@/assets/image/FoodChow.jpg"
import Image from "next/image";
const projects = [
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
        image: "/images/krafter-dev.jpg",
        liveDemo: "https://krafter.dev",
        github: "https://github.com/yourusername/krafter-dev",
        caseStudy: "https://krafter.dev/case-study",
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
        image: "/images/krafter-school.jpg",
        liveDemo: "https://krafter.school",
        github: "https://github.com/yourusername/krafter-school",
        caseStudy: "https://krafter.school/case-study",
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
        image: "/images/travel-cms.jpg",
        liveDemo: "https://travelcms.com",
        github: "https://github.com/yourusername/travel-cms",
        caseStudy: "https://travelcms.com/case-study",
    },
    {
        id: 4,
        title: "E-Commerce Platform",
        description: "A full-stack e-commerce platform with product listing, shopping cart, and payment integration.",
        features: [
            "User authentication and authorization",
            "Dynamic product search and filtering",
            "Stripe payment gateway integration"
        ],
        techStack: ["React", "Node.js", "Express", "MongoDB"],
        image: img,
        liveDemo: "https://myecommerce.com",
        github: "https://github.com/yourusername/ecommerce-platform",
        caseStudy: "https://myecommerce.com/case-study"
    },
];

const Portfolio = () => {
    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">My Projects</h1>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            className="h-48 w-full object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {project.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{project.description}</p>
                            <ul className="list-disc list-inside mb-4">
                                {project.features.map((feature, index) => (
                                    <li key={index} className="text-gray-600">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm text-gray-600 mb-4">
                                <strong>Tech Stack:</strong> {project.techStack.join(", ")}
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href={project.liveDemo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                >
                                    Live Demo
                                </a>
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                                >
                                    GitHub
                                </a>
                                {project.caseStudy && (
                                    <a
                                        href={project.caseStudy}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                    >
                                        Case Study
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Portfolio;

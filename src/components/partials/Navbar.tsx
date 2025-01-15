"use client"
import Link from "next/link";
import Logo from "@/components/partials/logo";
import {useState} from "react";
import {IconMenu2, IconX} from "@tabler/icons-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
        {label: "Home", path: "/"},
        {label: "About", path: "/"},
        {label: "Service", path: "/"},
        {label: "Work", path: "/"},
    ]

    return (
        <nav className="shadow-md w-full sticky top-0 left-0 z-50 bg-white">
            <div className="md:flex items-center justify-between bg-[#ffff] py-2 container mx-auto">
                <div><Logo/></div>
                <div
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-3xl absolute right-8 top-4 cursor-pointer md:hidden text-[#131313] hover:text-[#576cbc]"
                >
                    {isMenuOpen ? <IconX  /> : <IconMenu2/>}
                </div>
                <div
                    className={`cursor-pointer md:flex md:items-center absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto transition-all duration-500 ease-in gap-2
          ${isMenuOpen ? "top-14 opacity-100 bg-gray-50" : "top-[-490px]"} md:opacity-100`}
                >
                    {navLinks.map((v, key) => (
                        <div
                            key={key}
                            className="text-lg font-semibold md:my-0 my-7"
                        >
                            <div
                                className="flex items-center justify-center px-4 py-1 rounded-lg text-[#131313] hover:text-blue-800 hover:bg-blue-300 duration-500">
                                <Link href={v.path} onClick={()=>setIsMenuOpen((!isMenuOpen))}>{v.label}</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    )
}

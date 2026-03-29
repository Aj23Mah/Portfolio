"use client"
import Logo from "@/components/partials/logo";
import { useEffect, useState} from "react";
import {IconMenu2, IconX} from "@tabler/icons-react";
import useStore from "@/store/store";

export default function Navbar() {
    const menuData = useStore((state: any) => state.menuData);

    const [toggle, setToggle] = useState(false);
    const [active, setActive] = useState("");

    // ✅ Scroll to section
    const handleScroll = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        setToggle(false);
    };

    // ✅ Scroll spy (active section)
    useEffect(() => {
        const handleScrollSpy = () => {
            menuData?.forEach((item: any) => {
                const section = document.getElementById(item.route);
                if (!section) return;

                const rect = section.getBoundingClientRect();

                if (rect.top <= 150 && rect.bottom >= 150) {
                    setActive(item.route);
                }
            });
        };

        window.addEventListener("scroll", handleScrollSpy);
        return () => window.removeEventListener("scroll", handleScrollSpy);
    }, [menuData]);

    return (
        <>
            {/* 🔹 Sidebar */}
            <nav className="fixed left-4 md:left-6 lg:left-8 z-50 min-h-full py-10 flex flex-col justify-between items-center">

                {/* Logo */}
                <div>
                    <Logo />
                </div>

                {/* 🔹 Menu */}
                <div className="relative">

                    {/* Backdrop (mobile UX) */}
                    {toggle && (
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
                            onClick={() => setToggle(false)}
                        />
                    )}

                    {/* Menu Items */}
                    <div
                        className={`
    fixed inset-0 z-40
    flex items-center justify-center
    bg-black/50 backdrop-blur-lg
    transition-all duration-300 ease-in-out
    ${
                            toggle
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 pointer-events-none"
                        }
  `}
                    >
                        <div className="flex flex-col items-center gap-6">
                            {menuData?.map((v: any, key: number) => (
                                <button
                                    key={key}
                                    onClick={() => handleScroll(v.route)}
                                    className={`
          text-3xl md:text-5xl font-bold tracking-wide
          text-white transition-all duration-300
          hover:scale-110 hover:text-orange-500
          ${active === v.route ? "text-orange-500" : ""}
        `}
                                >
                                    {v.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggle Button */}
                    <div className="relative z-50">
                        <div
                            onClick={() => setToggle(!toggle)}
                            className="text-3xl bg-white rounded-full border shadow-lg cursor-pointer text-center p-2 text-orange-700 hover:text-[#576cbc] transition"
                        >
                            {toggle ? <IconX /> : <IconMenu2 />}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

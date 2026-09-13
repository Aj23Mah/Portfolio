"use client";
import { socialLinks } from "@/utils/constrants/data";

export default function Footer() {
  return (
    <footer id="contact" className="py-8 container mx-auto">
      <div className={"text-black grid justify-items-center"}>
        <div className="flex gap-4">
          {socialLinks.map((item: any, key: number) => (
            <a
              key={key}
              href={item.route}
              className={`p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] hover:text-white hover:bg-[${item.color}] transition duration-300`}
            >
              {item.icons}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 text-gray-400 pt-4 border-t-2">
          © 2021 <p className="text-black">Ajay Kumar Maharjan.</p> All Rights
          Reserved
        </div>
      </div>
    </footer>
  );
}

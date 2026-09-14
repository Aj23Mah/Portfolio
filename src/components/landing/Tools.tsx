import htmlLogo from "../../../public/image/html-logo.png";
import cssLogo from "../../../public/image/css-logo.png";
import reactLogo from "../../../public/image/React_logo.webp";
import jsLogo from "../../../public/image/JS-logo.png";
import nodeLogo from "../../../public/image/node-logo.png";
import nestLogo from "../../../public/image/Nest-logo.webp";
import nextLogo from "../../../public/image/Next-logo.webp";
import postgreLogo from "../../../public/image/postgresql-logo.png";
import Image from "next/image";

export default function Tools() {
  const items = [
    { name: "HTML5", img: htmlLogo },
    { name: "CSS3", img: cssLogo },
    { name: "JavaScript", img: jsLogo },
    { name: "React", img: reactLogo },
    { name: "Next.js", img: nextLogo },
    { name: "Node.js", img: nodeLogo },
    { name: "NestJS", img: nestLogo },
    { name: "PostgreSQL", img: postgreLogo },
  ];
  return (
    <section id="tools" className={"container mx-auto py-12 sm:px-0 px-5"}>
      <div className={"md:text-[2.5rem] text-3xl font-bold text-center mb-8"}>
        Tools & Technologies
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 justify-center gap-5">
        {items.map((v, key) => (
          <div
            key={key}
            className={
              "bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 group cursor-pointer"
            }
          >
            <div className="w-12 h-12 flex items-center justify-center transition group-hover:scale-110">
              <Image
                src={v.img}
                alt={v.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-xs font-semibold text-gray-600 group-hover:text-black transition">
              {v.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

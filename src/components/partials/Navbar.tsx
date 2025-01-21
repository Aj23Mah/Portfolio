"use client"
import Logo from "@/components/partials/logo";
import {useState} from "react";
import {IconMenu2, IconX} from "@tabler/icons-react";
import Link from "next/link";

export default function Navbar(props: any) {
    const {data} = props;
    // console.log('menu data from navbar', data);

    // const changeLink = (link: any) => {
    //     setActiveLink(link.label);
    //     if (!link.isLink && link.target) {
    //         const element = document.querySelector(.${link.target});
    //         if (element) {
    //             element.scrollIntoView({behavior: 'smooth', block: 'start'});
    //         }
    //     }
    // }

    const [toggle, setToggle] = useState(false);
    return (
        <>
            <nav className={'fixed lg:left-10 md:left-5 sm:left-3 left-2 z-50 min-h-full py-10 flex flex-col justify-between items-center'}>
                <div><Logo/></div>
                <div className={'relative'}>
                    <div className={`text-lg font-semibold py-7 px-4 bg-black/50 absolute 
                    ${toggle ? 
                        "motion-scale-in-[0.5] motion-translate-x-in-[-78%] motion-translate-y-in-[69%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate bottom-14 opacity-100" 
                        : 
                        "right-[490px]"
                    }
                `}>
                        {data?.map((v: any, key: number) => {
                            // const changeLink = v.route;
                            // console.log("changeLink", changeLink);
                            return (
                               <Link href={v.route} className={'flex flex-col px-4 py-1 my-2 rounded-lg text-white  hover:text-white hover:bg-gray-800/50 cursor-pointer'}>
                                   {v.title}
                               </Link>
                            )
                        })}
                    </div>
                    <div
                        onClick={() => setToggle(!toggle)}
                        className="text-3xl bg-white rounded-full border shadow-lg cursor-pointer text-center p-2 text-[#131313] hover:text-[#576cbc]"
                    >
                        {toggle ? <IconX/> : <IconMenu2/>}
                    </div>
                </div>
            </nav>
        </>
    )
}

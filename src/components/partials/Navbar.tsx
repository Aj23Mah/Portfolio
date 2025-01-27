"use client"
import Logo from "@/components/partials/logo";
import { useState} from "react";
import {IconMenu2, IconX} from "@tabler/icons-react";
import Link from "next/link";
// import {GetRequest} from "@/plugins/https";
// import useSWR from "swr";
import useStore from "@/store/store";
// import useStore from "@/store/store";

export default function Navbar() {
    // const {data: menuData} = props;
    const menuData = useStore((state:any) => state.menuData);
    // const {data: menuData, isLoading, error} =useSWR("/menu/group/1", getData);
    // const menuData = useStore((state: any) => state.menuData)
    // console.log('menu data from navbar', menuData);

    const [toggle, setToggle] = useState(false);

    // if (isLoading) return <div>Loading...</div>
    // if (error) return <div>Failed to load</div>


    // const {menuData, loadMenusData} = useStore();
    // console.log(menuData)

    return (
        <>
            <nav className={'fixed left-4 md:left-6 lg:left-8 z-50 min-h-full py-10 flex flex-col justify-between items-center'}>
                <div><Logo /></div>
               <div className={'relative'}>
                   {/*    <button className={'bg-blue-600 text-white py-1 px-4 hover:bg-blue-700 rounded'} onClick={loadMenusData}>Load menus</button>*/}
                   <div className={`text-lg font-semibold py-7 px-4 bg-black/50 absolute 
                    ${toggle ? 
                        "motion-scale-in-[0.5] motion-translate-x-in-[-78%] motion-translate-y-in-[69%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate bottom-14 opacity-100" 
                        : 
                        "right-[490px]"
                    }
                `}>
                        {menuData?.map((v: any, key: number) => {
                            return (
                               <Link key={key} href={v.route} className={'flex flex-col px-4 py-1 my-2 rounded-lg text-white  hover:text-white hover:bg-gray-800/50 cursor-pointer'}>
                                   {v.title}
                               </Link>
                            )
                        })}
                    </div>
                    <div
                        onClick={() => setToggle(!toggle)}
                        className="text-3xl bg-white rounded-full border shadow-lg cursor-pointer text-center p-2 text-orange-700 hover:text-[#576cbc]"
                    >
                        {toggle ? <IconX/> : <IconMenu2/>}
                    </div>
                </div>
            </nav>
        </>
    )
}

// export async function getData(url: string) {
//     let menuData = null;
//     try {
//         const response: any = await GetRequest(url);
//         menuData = response;
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
//
//     return menuData;
// }

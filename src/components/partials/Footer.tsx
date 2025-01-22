"use client"
import {
    IconBrandFacebookFilled, IconBrandGithubFilled,
    IconBrandInstagram, IconBrandLinkedin,
} from "@tabler/icons-react";
import {GetRequest} from "@/plugins/https";
import useSWR from "swr";

export default function Footer() {
    // const {data} = props;
    const {data: footerData, isLoading, error} =useSWR("/menu/group/2", getData);
    // console.log('Data from footer', data);

    if (error) return <div>Failed to load</div>
    if (!footerData) return <div>Loading...</div>
    const findByCode = (code: any) => footerData.find((item: any) => item.code === code);

    const facebook = findByCode("facebook");
    // console.log(facebook.route);
    const linkedin = findByCode("linkedin");
    // console.log(linkedin.route);
    const instagram = findByCode("instagram");
    // console.log(instagram.route);
    const github = findByCode("github");
    // console.log(github.route);

    return (
        <footer className="py-8 container mx-auto">
            <div className={'text-black grid justify-items-center'}>
                <div className="flex gap-4">
                    <a href={facebook.route} className="p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] hover:bg-[#0862F7] hover:text-white">
                        <IconBrandFacebookFilled stroke={2} style={{height: '100%', width: '100%'}}/>
                    </a>
                    <a href={instagram.route} className="p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] hover:bg-[#C13584] hover:text-white">
                        <IconBrandInstagram stroke={2} style={{height: '100%', width: '100%'}}/>
                    </a>
                    <a href={linkedin.route} className="p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] hover:bg-[#007AB5] hover:text-white">
                        <IconBrandLinkedin stroke={2} style={{height: '100%', width: '100%'}}/>
                    </a>
                    <a href={github.route} className="p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] hover:bg-[#000] hover:text-white">
                        <IconBrandGithubFilled stroke={2} style={{height: '100%', width: '100%'}}/>
                    </a>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1 text-gray-400 pt-4 border-t-2">
                    © 2021 <p className="text-black">Ajay Kumar Maharjan.</p> All Rights Reserved
                </div>
            </div>
        </footer>
    );
}
export async function getData(url: string) {
    let footerData = null;
    try {
        const response: any = await GetRequest(url);
        footerData = response;
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    return footerData;
}
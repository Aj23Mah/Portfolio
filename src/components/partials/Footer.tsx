"use client"
import {
    IconBrandFacebookFilled, IconBrandGithubFilled,
    IconBrandInstagram, IconBrandLinkedin,
} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Footer() {
    const [getFooter, setGetFooter] = useState([]);
    useEffect(() => {
        axios.get('https://api-cms.nxin.tech/menu/code/footer-privacy',
            {
                headers: {
                    organization: 'ajay'
                }
            })
            .then(response => {
                setGetFooter(response.data);
            });
    }, []);
    console.log('getFooter api', getFooter);
    return (
        <footer className="bg-white py-8 container mx-auto">
            <div className={'text-black grid justify-items-center'}>
                <div className="flex gap-4">
                    <a href={'https://www.facebook.com/Aj23Mah'} className="p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] hover:bg-[#0862F7] hover:text-white">
                        <IconBrandFacebookFilled stroke={2} style={{height: '100%', width: '100%'}}/>
                    </a>
                    <a href={'https://www.instagram.com/mah._.ajay/'} className="p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] hover:bg-[#C13584] hover:text-white">
                        <IconBrandInstagram stroke={2} style={{height: '100%', width: '100%'}}/>
                    </a>
                    <a href={'https://www.linkedin.com/in/ajaymaharjan/'} className="p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] hover:bg-[#007AB5] hover:text-white">
                        <IconBrandLinkedin stroke={2} style={{height: '100%', width: '100%'}}/>
                    </a>
                    <a href={'https://github.com/Aj23Mah'} className="p-2 rounded-full mb-2 cursor-pointer h-[42px] w-[42px] hover:bg-[#000] hover:text-white">
                        <IconBrandGithubFilled stroke={2} style={{height: '100%', width: '100%'}}/>
                    </a>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1 text-gray-400 pt-4 border-t-2">
                    © 2021 <p className="">Ajay Kumar Maharjan.</p> All Rights Reserved
                </div>
            </div>
        </footer>
    );
}
"use client"
import Link from "next/link";
import Logo from "@/components/partials/logo";
import {useEffect, useState} from "react";
import {IconMenu2, IconX, IconHome, IconVocabulary, IconSettings, IconBriefcase} from "@tabler/icons-react";
import axios from "axios";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
        {label: "Home", path: "#home", icon: <IconHome />},
        {label: "About", path: "#about", icon: <IconVocabulary />},
        {label: "Work", path: "#work", icon: <IconBriefcase />},
        {label: "Service", path: "#service", icon: <IconSettings />},
    ]

    const [getHeader, setGetHeader] = useState([]);
    useEffect(() => {
        axios.get('https://api-cms.nxin.tech/menu/code/header',
            {
                headers: {
                    organization: 'ajay'
                }
            })
            .then(response => {
                setGetHeader(response.data);
            });
    }, []);
    console.log('getHeader api', getHeader);

    return (
        <>
            <nav className="fixed py-[25vh] left-8 h-full z-50">
                <div
                    className="h-[500px] bg-black/55 backdrop-blur-150 text-white rounded-lg flex flex-col items-center justify-between py-7 px-4">
                    <div>
                        <Logo/>
                    </div>
                    <div>
                        {navLinks.map((v, key) => (
                            <div
                                key={key}
                                className="relative text-lg font-semibold md:my-0 my-7"
                            >
                                {/* Group around icon and tooltip */}
                                <div
                                    className="group flex items-center justify-center p-3 rounded-lg text-white hover:bg-[#1d1d1d]">
                                    <Link href={v.path} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                        {v.icon}
                                    </Link>

                                    {/* Tooltip */}
                                    <span
                                        className="absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-200 text-black text-sm py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                      {v.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </nav>


            {/*  <nav className="shadow-md w-full sticky top-0 left-0 z-50 bg-white">*/}
            {/*      <div className="md:flex items-center justify-between bg-[#ffff] py-2 container mx-auto">*/}
            {/*          <div><Logo/></div>*/}
            {/*          <div*/}
            {/*              onClick={() => setIsMenuOpen(!isMenuOpen)}*/}
            {/*              className="text-3xl absolute right-8 top-4 cursor-pointer md:hidden text-[#131313] hover:text-[#576cbc]"*/}
            {/*          >*/}
            {/*              {isMenuOpen ? <IconX/> : <IconMenu2/>}*/}
            {/*          </div>*/}
            {/*          <div*/}
            {/*              className={`cursor-pointer md:flex md:items-center absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto transition-all duration-500 ease-in gap-2*/}
            {/*${isMenuOpen ? "top-14 opacity-100 bg-gray-50" : "top-[-490px]"} md:opacity-100`}*/}
            {/*          >*/}
            {/*              {navLinks.map((v, key) => (*/}
          {/*                  <div*/}
          {/*                      key={key}*/}
          {/*                      className="text-lg font-semibold md:my-0 my-7"*/}
          {/*                  >*/}
          {/*                      <div*/}
          {/*                          className="flex items-center justify-center px-4 py-1 rounded-lg text-[#131313] hover:text-blue-800 hover:bg-blue-300 duration-500">*/}
          {/*                          <Link href={v.path} onClick={() => setIsMenuOpen((!isMenuOpen))}>{v.label}</Link>*/}
          {/*                      </div>*/}
          {/*                  </div>*/}
          {/*              ))}*/}
          {/*          </div>*/}
          {/*      </div>*/}
          {/*  </nav>*/}
        </>
    )
}

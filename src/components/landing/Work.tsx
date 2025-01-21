"use client"
import React from "react";
import Image from "next/image";
import useScrollPosition from "@/utils/hooks/useScrollPosition";
import {getImageUrl} from "@/utils/helpers/imageUrlHandler";

export default function Work(props: any) {
    const {data} = props;
    // console.log('Data from project', data);
    const scrollPosition = useScrollPosition();

    return (
        <section id="work" className={`py-10 px-[15vw] text-black project-bg ${scrollPosition > 2000 ? 'dark text-white' : ''}`}>
            <div className="text-2xl text-center mb-4">Explore Latest Work</div>
            <div className="md:text-[2.5rem] text-3xl font-bold text-center mb-6">Project</div>

            <div>
                {data?.map((v:any, key:number)=> (
                    <div
                        key={key}
                        className={`sticky top-36 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 rounded-3xl p-10   
                        ${scrollPosition > 2000 ? 'project-card' : 'bg-white text-black'}
                       `}
                    >
                        <div className={'col-span-1'}>
                            <div className="text-2xl font-bold mb-2">{v.title}</div>
                            <div className={'text-lg'} dangerouslySetInnerHTML={{ __html: v.description }} />
                            <div className={'mt-4'}>
                                <a
                                    href={v.liveDemo}
                                    className="bg-white text-black py-2 px-4 rounded-md hover:bg-gray-700 hover:text-gray-200 font-bold transition"
                                >
                                    View Demo
                                </a>
                            </div>
                        </div>

                        <div className="rounded-2xl overflow-hidden col-span-1">
                            <Image src={getImageUrl(v.image?.filename ?? "")} alt={v.title}
                                   width={800} height={800}
                                   style={{ width: "100%", backgroundSize: "cover" }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/*<div>*/}
            {/*    {myWork.map((item, index) => (*/}
            {/*        <div*/}
            {/*            key={index}*/}
            {/*            className={`sticky top-36 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 rounded-3xl p-10   */}
            {/*            ${scrollPosition > 2000 ? 'project-card' : 'bg-white text-black'}*/}
            {/*           `}*/}
            {/*        >*/}
            {/*            <div>*/}
            {/*                <div className="text-2xl font-bold mb-2">{item.title}</div>*/}
            {/*                <div className="text-lg">{item.description}</div>*/}
            {/*                <ul className="list-disc list-inside mb-4">*/}
            {/*                    {item.features.map((feature, index) => (*/}
            {/*                        <li key={index} className="">*/}
            {/*                            {feature}*/}
            {/*                        </li>*/}
            {/*                    ))}*/}
            {/*                </ul>*/}
            {/*                <p className="text-sm mb-4">*/}
            {/*                    <strong>Tech Stack:</strong> {item.techStack.join(", ")}*/}
            {/*                </p>*/}
            {/*                <a*/}
            {/*                    href={item.liveDemo}*/}
            {/*                    className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-700 hover:text-gray-200 font-bold transition"*/}
            {/*                >*/}
            {/*                    View Demo*/}
            {/*                </a>*/}
            {/*            </div>*/}
            {/*            <div className="rounded-2xl overflow-hidden">*/}
            {/*                <Image src={item.image[0]} alt={item.title} className="w-full" />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
        </section>
    );
}
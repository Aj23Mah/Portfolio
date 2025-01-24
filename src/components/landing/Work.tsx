"use client"
import React from "react";
import Image from "next/image";
import useScrollPosition from "@/utils/hooks/useScrollPosition";
import {getImageUrl} from "@/utils/helpers/imageUrlHandler";
import useStore from "@/store/store";
// import {GetRequest} from "@/plugins/https";
// import useSWR from "swr";

export default function Work() {
    // const {data: projectData} = props;
    const productData = useStore((state:any) => state.productData);
    const scrollPosition = useScrollPosition();

    // const {data: projectData, isLoading, error} =useSWR("/product", getData);
    console.log('project data from project page', productData);

    // if (error) return <div>Failed to load</div>
    // if (!projectData) return <div>Loading...</div>

    return (
        <section id="work" className={`py-10 px-[15vw] text-black project-bg ${scrollPosition > 2000 ? 'dark text-white' : ''}`}>
            <div className="text-2xl text-center mb-4">Explore Latest Work</div>
            <div className="md:text-[2.5rem] text-3xl font-bold text-center mb-6">Project</div>

            <div>
                {productData?.map((v:any, key:number)=> (
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
        </section>
    );
}

// export async function getData(url: string) {
//     let projectData = null;
//     try {
//         const response: any = await GetRequest(url);
//         projectData = response;
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
//
//     return projectData;
// }
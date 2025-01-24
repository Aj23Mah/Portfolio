"use client"
import React from "react";
import '@/assets/css/Service.css'
import {getImageUrl} from "@/utils/helpers/imageUrlHandler";
import Image from "next/image";
import useSWR from "swr";
import {GetRequest} from "@/plugins/https";
import useStore from "@/store/store";

export default function() {
    // const {data: serviceData} = props;
    const serviceData = useStore((state:any) => state.serviceData);
    // const {data: serviceData, isLoading, error} =useSWR("/service", getData);
    // console.log('service data from service page', serviceData);

    // if (error) return <div>Failed to load</div>
    // if (!serviceData) return <div>Loading...</div>

    return (
        <div id="service" className="container mx-auto py-10">
            <div className="md:text-[2.5rem] text-3xl font-bold text-center mb-2">Services</div>
            <p className="text-center md:px-0 px-5 text-gray-500 mb-6">
                What I Offer
            </p>
            <div className="parallex_setupItems">
                {serviceData?.map((v: any, key: number) => (
                    <div key={key} className="setUp_items">
                        <Image src={getImageUrl(v.image?.filename ?? "")} alt={v.title}
                               width={64} height={64}
                        />
                        <h4 className="mt-3 font-semibold text-xl">{v.title}</h4>
                        <div className={'mt-2 text-base"'} dangerouslySetInnerHTML={{ __html: v.description }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// export async function getData(url: string) {
//     let serviceData = null;
//     try {
//         const response: any = await GetRequest(url);
//         serviceData = response;
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
//
//     return serviceData;
// }
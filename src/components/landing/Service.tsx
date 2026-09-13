"use client";
import React from "react";
import "@/assets/css/Service.css";
import { getImageUrl } from "@/utils/helpers/imageUrlHandler";
import Image from "next/image";
import { serviceData } from "@/utils/constrants/data";

export default function () {
  return (
    <div id="services" className="container mx-auto py-10">
      <div className="md:text-[2.5rem] text-3xl font-bold text-center mb-2">
        Services
      </div>
      <p className="text-center md:px-0 px-5 text-gray-500 mb-6">
        What I Offer
      </p>
      <div className="parallex_setupItems">
        {serviceData?.map((v: any, key: number) => (
          <div key={key} className="setUp_items">
            <Image
              src={getImageUrl(v.image ?? "")}
              alt={v.title}
              width={64}
              height={64}
            />
            <h4 className="mt-3 font-semibold text-xl">{v.title}</h4>
            <div
              className={"mt-2 text-base"}
              dangerouslySetInnerHTML={{ __html: v.description }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

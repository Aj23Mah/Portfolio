"use client"
import '@/assets/css/Service.css'
import {
    IconBrandDatabricks,
    IconReplace,
    IconFingerprintScan,
    IconApi,
    IconDeviceImacCode,
    IconSettingsSearch
} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import axios from "axios";

export default function() {
    const parallaxItems = [
        {
            icon: <IconDeviceImacCode style={{ height: '100%', width: '100%' }} />,
            label: "Web Development",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        },
        {
            icon: <IconApi style={{ height: '100%', width: '100%' }} />,
            label: "API Development and Integration",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        },
        {
            icon: <IconBrandDatabricks style={{ height: '100%', width: '100%' }} />,
            label: "Database Design and Management",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        },
        {
            icon: <IconFingerprintScan style={{ height: '100%', width: '100%' }} />,
            label: "Authentication and Authorization",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        },
        {
            icon: <IconReplace style={{ height: '100%', width: '100%' }} />,
            label: "Deployment and Maintenance",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        },
        {
            icon: <IconSettingsSearch style={{ height: '100%', width: '100%' }} />,
            label: "Testing and Debugging",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        },
    ];
    const [getService, setGetService] = useState([]);
        useEffect(() => {
            axios.get('https://api-cms.nxin.tech/service', {
                headers: {
                    organization: 'ajay'
                }
            })
                .then(response => {
                    setGetService(response.data);
                });
        }, []);
    console.log('getService api', getService);

    return (
        <div id="service" className="container mx-auto py-10">
            <div className="md:text-[2.5rem] text-3xl font-bold text-center">Services</div>
            <p className="sub_header md:px-0 px-5 text-gray-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci aliquid
                    architecto asperiores commodi dignissimos enim eum excepturi exercitationem magnam odio, officia
                    quae quaerat qui quos tempore, ut vero voluptatibus!</p>
            <div className="parallex_setupItems">
                {parallaxItems.map((v, index) => (
                    <div key={index} className="setUp_items border shadow-xl">
                        <div className={'text-center  h-[64px] w-[64px]'}>{v.icon}</div>
                        <h4 className="mt-3 font-semibold text-xl">{v.label}</h4>
                        <p className="mt-2 text-base">{v.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
"use client"
import useStore from "@/store/store";
import {useEffect} from "react";

export const ContentProvider = ({children, menuData, productData, serviceData, footerData, loading, error}: any) => {
    const setMenuData= useStore((state:any)=>state.setMenuData);
    const setProductData= useStore((state:any)=>state.setProductData);
    const setServiceData= useStore((state:any)=>state.setServiceData);
    const setFooterData= useStore((state:any)=>state.setFooterData);

    // Fetch the project data when the component mounts

    useEffect(() => {
    if(menuData) {
        setMenuData(menuData)
    }
    if(productData) {
        setProductData(productData)
    }
    if(serviceData) {
        setServiceData(serviceData)
    }
    if(footerData) {
        setFooterData(footerData)
    }
    }, [menuData, productData, serviceData, footerData]);

    // Pass the data, loading, and error states as props to the Project component
    return children;
}

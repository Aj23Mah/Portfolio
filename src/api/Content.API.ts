import {GetRequest} from "@/plugins/https";

export const getMenu=async ()=> {
    let menuData = null;
    try {
        const response: any = await GetRequest("/menu/group/1");
        menuData = response;
        // console.log('content api - menu data', menuData)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return menuData;
}

export const getProduct=async ()=> {
    let productData = null;
    try {
        const response: any = await GetRequest("/product");
        productData = response;
        // console.log('content api - product data', productData)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return productData;
}

export const getService=async ()=> {
    let serviceData = null;
    try {
        const response: any = await GetRequest("/service");
        serviceData = response;
        // console.log('content api - service data', serviceData)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return serviceData;
}

export const getFooter= async ()=> {
    let footerData = null;
    try {
        const response: any = await GetRequest("/menu/group/2");
        footerData = response;
        // console.log('content api - foooter data', footerData)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return footerData;
}

// export const fetchData = async () => {
//     const menu = await getMenu();
//     const product = await getProduct();
//     const service = await getService();
//     const footer = await getFooter();
//     return { menu, product, service, footer };
// };


export const fetchData = async () => {
    const [ menu, product, service, footer ]:any= await Promise.all([
        getMenu(),
        getProduct(),
        getService(),
        getFooter()])
    return { menu, product, service, footer };
};

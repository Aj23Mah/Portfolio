import {create} from 'zustand'
// import {APIGetMenu} from "@/api/APIMenu";

const useStore = create((set)=>({
    menuData: [],
    productData: [],
    serviceData: [],
    footerData: [],
    loading: false,
    error: null,
    setMenuData: (menuData:any)=>set((state:any)=>({menuData:menuData})),
    setProductData: (productData:any)=>set((state:any)=>({productData:productData})),
    setServiceData: (serviceData:any)=>set((state:any)=>({serviceData:serviceData})),
    setFooterData: (footerData:any)=>set((state:any)=>({footerData:footerData})),

    // fetch data function

    // setMenuData: async () => {
    //     const menuData = await APIGetMenu();
    //     return set((state: any) => ({...state, menuData}))
    // },

}))

export default useStore;

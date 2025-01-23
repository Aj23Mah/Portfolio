import {create} from 'zustand'
import {APIGetMenu, fetchMenuData} from "@/api/APIMenu";

const useStore = create((set)=>({
    menuData: [],
    loading: false,
    error: null,

    // fetch data function

    loadMenusData: async () => {
        const menuData = await APIGetMenu();
        return set(state => ({...state, menuData}))
    }

}))

export default useStore;
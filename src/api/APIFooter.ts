import { GetRequest } from "@/plugins/https"

export const APIGetFooter = () => {
    console.log("test");
    
    return GetRequest("/menu/group/2")
}
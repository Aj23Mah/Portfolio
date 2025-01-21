import { GetRequest } from "@/plugins/https"

export const APIGetFooter = () => {
    return GetRequest("/menu/group/2")
}
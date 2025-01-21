import { GetRequest } from "@/plugins/https"

export const APIGetMenu = () => {
    return GetRequest("/menu/group/1")
}
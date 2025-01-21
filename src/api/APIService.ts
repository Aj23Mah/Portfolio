import { GetRequest } from "@/plugins/https"

export const APIGetService = () => {
    return GetRequest("/service")
}

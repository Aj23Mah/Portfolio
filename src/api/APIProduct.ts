import {GetRequest, PostRequest} from "@/plugins/https"

export const APIGetProject = () => {
    return GetRequest("/product")
}


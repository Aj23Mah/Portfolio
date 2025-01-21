
import baseAxios from './axios'

export const GetRequest = (url = '', config = {}) => {
    return baseAxios.get(url, config)
}
export const PostRequest = (url = '', body: any, config: any = {}) => {
    return baseAxios.post(url, body, config)
}

export const PutRequest = (url = '', body: any, config: any = {}) => {
    return baseAxios.put(url, body, config)
}

export const DeleteRequest = (url = '', config: any = {}) => {
    return baseAxios.delete(url, config)
}

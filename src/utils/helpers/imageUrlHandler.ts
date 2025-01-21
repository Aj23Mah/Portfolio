
import placeholderImg from '../../../public/image/placement.jpg'

import {BASE_URL, image_BASE_URL} from "@/config/baseURL";

export const getImageUrl = (img: string) => {
    if (img?.includes('http')) {
        return img
    } else {
        return image_BASE_URL + `${img}`
    }
}



export const onErrorImage = (event: any) => {
    event.target.src = placeholderImg
}

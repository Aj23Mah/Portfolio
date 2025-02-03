"use client"
import Image from "next/image";
import errorImg from '../../public/image/scribbbles/error.jpg'

export default function error() {
    return (
        <div className={'h-screen w-full'}>
            <Image src={errorImg} alt={'error Image'} className={'w-full h-full'} />
        </div>
    )
}
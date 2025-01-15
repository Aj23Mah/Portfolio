import htmlLogo from '@/assets/image/html-logo.png'
import cssLogo from '@/assets/image/css-logo.png'
import reactLogo from '@/assets/image/React_logo.webp'
import jsLogo from '@/assets/image/JS-logo.png'
import nodeLogo from '@/assets/image/node-logo.png'
import mysqlLogo from '@/assets/image/mysql-logo.png'
import xamppLogo from '@/assets/image/xampp-logo.png'
import nestLogo from '@/assets/image/Nest-logo.webp'
import nextLogo from '@/assets/image/Next-logo.webp'
import postgreLogo from '@/assets/image/postgresql-logo.png'
import Image from "next/image";

export default function Tools() {
    const items = [
        {img: htmlLogo},
        {img: cssLogo},
        {img: jsLogo},
        {img: reactLogo},
        {img: nextLogo},
        {img: nodeLogo},
        {img: nestLogo},
        // {img: mysqlLogo},
        // {img: xamppLogo},
        {img: postgreLogo},
    ]
    return(
        <section className={'container mx-auto py-10 sm:px-0 px-5'}>
            <div className={'md:text-[2.5rem] text-3xl font-bold text-center mb-6'}>Tools and Technique</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8">
                {items.map((v, key) => (
                    <div key={key} className={'shadow-xl p-6 bg-gray-200 rounded-xl'}>
                        <Image src={v.img} alt="logo images" />
                    </div>
                ))}
            </div>
        </section>
    )
}
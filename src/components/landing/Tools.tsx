import htmlLogo from '../../../public/image/html-logo.png'
import cssLogo from '../../../public/image/css-logo.png'
import reactLogo from '../../../public/image/React_logo.webp'
import jsLogo from '../../../public/image/JS-logo.png'
import nodeLogo from '../../../public/image/node-logo.png'
import nestLogo from '../../../public/image/Nest-logo.webp'
import nextLogo from '../../../public/image/Next-logo.webp'
import postgreLogo from '../../../public/image/postgresql-logo.png'
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
        {img: postgreLogo},
    ]
    return(
        <section className={'container mx-auto py-10 sm:px-0 px-5'}>
            <div className={'md:text-[2.5rem] text-3xl font-bold text-center mb-6'}>Tools and Technique</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 justify-center gap-8">
                {items.map((v, key) => (
                    <div key={key} className={'p-6 rounded-xl saturate-0 hover:saturate-100 cursor-pointer'}>
                        <Image src={v.img} alt="logo images" />
                    </div>
                ))}
            </div>
        </section>
    )
}
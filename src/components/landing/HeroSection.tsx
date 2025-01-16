import Image from "next/image";
import vector1 from "../../../public/image/scribbbles/Vector (1).png"
import vector2 from "../../../public/image/scribbbles/Vector (2).png"
import vector3 from "../../../public/image/scribbbles/Vector (3).png"
import '@/assets/css/TypingAnimation.css'

export default function HeroSection() {
    return (
        < section
            id="home"
            className = "w-[100dvw] container mx-auto " >
            <div className="w-full h-[80dvh] flex flex-col justify-center items-center">
                <div className='font-medium text-2xl sm:text-3xl'>HELLO I'm</div> {/* text-[30px] */}
                <div className="text-6xl sm:text-8xl font-medium text-center my-4">Ajay Kumar Maharjan</div> {/*text-[90px]*/}
                <div className='flex gap-2 items-center'>
                    <p className={'font-medium text-2xl sm:text-3xl'}>A Pasionate</p>{/*text-[30px]*/}
                    <span className={'text-4xl sm:text-5xl font-semibold'}>Developer</span>{/*text-[48px]*/}
                </div>
            </div>
            <div className={'absolute md:block hidden md:bottom-[30vh] md:left-[30vw]  lg:bottom-[40vh] lg:left-[20vw]'}><Image src={vector1} alt='vector' width={64} height={64} /></div>
            <div className={'absolute md:block hidden md:bottom-[30vh] md:right-[30vw] lg:bottom-[40vh]  lg:right-[20vw]'}><Image src={vector2} alt='vector' width={64} height={64} /></div>
            <div className={'absolute md:block hidden md:top-[16vh] md:left-[50vw] lg:top-[32vh] lg:left-[26vw]'}><Image src={vector3} alt='vector' width={64} height={64} /></div>
        </section>
    )
}

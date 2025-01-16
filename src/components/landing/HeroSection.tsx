import Image from "next/image";
import heroImg from "../../../public/image/me.webp"
import '@/assets/css/TypingAnimation.css'

export default function HeroSection() {
    return (
        < section
            className = "w-[100dvw] container mx-auto " >
            <div className="w-full h-[80dvh] flex flex-col justify-center items-center">
                {/*<div className="">*/}
                {/*    <h1 className="text-6xl font-medium rancho-regular">Ajay Kumar Maharjan</h1>*/}
                {/*    <div className="hero-txt">*/}
                {/*        <div className='static-txt font-medium lg:text-6xl md:text-4xl sm:text-2xl text-xl'>I'm a</div>*/}
                {/*        <div className='dynamic-txt font-bold md:text-6xl sm:text-4xl text-2xl'>*/}
                {/*            <li><span>Developer</span></li>*/}
                {/*            <li><span>Enthusiast</span></li>*/}
                {/*            <li><span>Designer</span></li>*/}
                {/*            <li><span>Freelancer</span></li>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className='font-medium text-[30px]'>HELLO I'm</div>
                <div className="text-[125px] font-medium rancho-regular">Ajay Kumar Maharjan</div>
                <div className='flex gap-2 items-center'>
                    <p className={'font-medium text-[30px]'}>A Pasionate</p>
                    <span className={'text-[48px] font-semibold'}>Developer</span>
                </div>
            </div>
        </section>
    )
}

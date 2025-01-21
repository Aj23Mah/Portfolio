"use client"
import Image from "next/image";
import vector1 from "../../../public/image/scribbbles/Vector (1).png"
import vector2 from "../../../public/image/scribbbles/Vector (2).png"
import vector3 from "../../../public/image/scribbbles/Vector (3).png"
import '@/assets/css/TypingAnimation.css'
import {motion} from 'framer-motion'
import {TypeAnimation} from "react-type-animation";

export default function HeroSection() {
    return (
        <section
            id="home"
            className = "w-[100dvw] container mx-auto" >
            <div className="w-full h-[80dvh] flex justify-center items-center">
                <div className={'scale-150 text-center'}>
                    <div className='font-medium text-center text-2xl sm:text-3xl'>
                        <span className={'motion-translate-x-in-[1%] motion-translate-y-in-[-150%] motion-blur-in-[15px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate'}>
                            Hello!
                        </span>
                        <span className={'ml-2'}>I am</span>
                    </div> {/* text-[30px] */}
                    <div className="text-6xl sm:text-8xl text-center font-medium text-center my-4 motion-preset-pop">
                        <div className={'relative z-10 smooch'}> Ajay Kumar </div>
                        <div className={'relative text-4xl text-orange-700 uppercase mt-[-8px] tracking-widest'}> Maharjan</div>
                    </div> {/*text-[90px]*/}
                    <div className='flex gap-2 items-center justify-center'>
                        {/*<p className={'font-medium text-2xl sm:text-3xl'}>A Pasionate</p>/!*text-[30px]*!/*/}
                        {/*<span className={'text-4xl sm:text-5xl font-semibold'}>Developer</span>/!*text-[48px]*!/*/}
                        <TypeAnimation
                            sequence={[
                                'Developer',
                                1000,
                                'FreeLancer',
                                1000
                            ]}
                            wrapper="span"
                            speed={20}
                            style={{ fontSize: '2em', display: 'inline-block' }}
                            repeat={Infinity}
                            // className={'text-4xl sm:text-5xl font-semibold'}
                        />
                    </div>
                </div>
            </div>
            {/*<div className={'absolute md:block hidden md:bottom-[30vh] md:left-[30vw]  lg:bottom-[40vh] lg:left-[20vw]'}><Image src={vector1} alt='vector' width={64} height={64} /></div>*/}
            {/*<div className={'absolute md:block hidden md:bottom-[30vh] md:right-[30vw] lg:bottom-[40vh]  lg:right-[20vw]'}><Image src={vector2} alt='vector' width={64} height={64} /></div>*/}
            {/*<div className={'absolute md:block hidden md:top-[16vh] md:left-[50vw] lg:top-[32vh] lg:left-[26vw]'}><Image src={vector3} alt='vector' width={64} height={64} /></div>*/}
        </section>
    )
}

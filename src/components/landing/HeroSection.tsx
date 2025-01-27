"use client"
import '@/assets/css/TypingAnimation.css'
import {TypeAnimation} from "react-type-animation";

export default function HeroSection() {
    return (
        <section
            id="home"
            className = "w-[100dvw] container mx-auto" >
            <div className="w-full h-[80dvh] flex justify-center items-center">
                <div className={'scale-150 text-center'}>
                    <div className='font-medium text-center text-2xl sm:text-3xl'>
                        <span className={'motion-blur-in-[15px] motion-duration-[1s] motion-duration-[1s]/translate'}>
                            Hello!
                        </span>
                        <span className={'ml-2'}>I am</span>
                    </div>
                    <div className="text-4xl sm:text-6xl md:text-8xl text-center font-medium my-4 motion-preset-pop motion-blur-in-[15px] motion-duration-[1s] motion-duration-[1s]/translate">
                        <div className={'relative z-10 smooch'}> Ajay Kumar </div>
                        <div className={'relative text-3xl sm:text-4xl text-orange-700 uppercase mt-[-8px] tracking-widest'}> Maharjan</div>
                    </div>
                    <div className='flex gap-2 items-center justify-center'>
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
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

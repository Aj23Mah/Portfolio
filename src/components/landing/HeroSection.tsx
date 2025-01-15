import Image from "next/image";
import heroImg from "@/assets/image/me.webp"
import '@/assets/css/TypingAnimation.css'
// import '@/assets/css/Flip.css'

export default function HeroSection() {
    return (
        < section
            className = "w-[100dvw] container mx-auto " > {/*  bg-[#ddd] h-[calc((100dvh-64px))] */}
            <div className="relative w-full">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center">
                    <h1 className="text-4xl font-medium rancho-regular text-center">Ajay Kumar Maharjan</h1>
                    <div className="hero-txt">
                        <div className='static-txt lg:text-6xl md:text-4xl sm:text-2xl text-xl'>I'm a</div>
                        <div className='dynamic-txt md:text-6xl sm:text-4xl text-2xl'>
                            <li><span>Developer</span></li>
                            <li><span>Enthusiast</span></li>
                            <li><span>Designer</span></li>
                            <li><span>Freelancer</span></li>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center opacity-15"><Image src={heroImg} alt="image"/></div>
            </div>
        </section>
    )
}

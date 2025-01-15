import HeroSection from '@/components/landing/HeroSection'
import Work from '@/components/landing/Work'
import About from '@/components/landing/About'
import InfiniteScroll from "@/components/landing/InfiniteScroll";
import Service from "@/components/landing/Service";
import Tools from "@/components/landing/Tools";
import Portfolio from "@/components/landing/Portfolio";

export default function Page() {
    return (
        <>
            <HeroSection />
            <About />
            <InfiniteScroll />
            {/*<Portfolio />*/}
            <Work />
            <Service />
            <Tools />
        </>
    )
}

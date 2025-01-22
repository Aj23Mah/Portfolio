import HeroSection from '@/components/landing/HeroSection'
import Work from '@/components/landing/Work'
import About from '@/components/landing/About'
import InfiniteScroll from "@/components/landing/InfiniteScroll";
import Service from "@/components/landing/Service";
import Tools from "@/components/landing/Tools";
import Footer from "@/components/partials/Footer";
import Navbar from "@/components/partials/Navbar";

export default async function Page() {
    return (
        <div className={''}>
            <Navbar />
            <HeroSection />
            <About />
            <InfiniteScroll />
            <Work />
            <Service />
            <Tools />
            <Footer />
        </div>
    )
}

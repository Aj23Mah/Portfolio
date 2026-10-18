import HeroSection from '@/components/landing/HeroSection';
import ClassicSections from '@/components/landing/ClassicSections';
import Footer from "@/components/partials/Footer";
import Navbar from "@/components/partials/Navbar";

export default async function Page() {
    return (
        <main id="main-content">
            <Navbar />
            <HeroSection />
            <ClassicSections />
            <Footer />
        </main>
    );
}

import HeroSection from "@/components/landing/HeroSection";
import About from "@/components/landing/About";
import Service from "@/components/landing/Service";
import Work from "@/components/landing/Work";
import Tools from "@/components/landing/Tools";

const componentMap: { [key: string]: React.ComponentType<any> } = {
    'hero-section': HeroSection,
    'hero-About': About,
    'hero-rooms': Work,
    'hero-services': Service,
    'hero-features': Tools,
};

export default componentMap;

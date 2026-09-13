import HeroSection from '@/components/landing/HeroSection'
import Work from '@/components/landing/Work'
import About from '@/components/landing/About'
import InfiniteScroll from "@/components/landing/InfiniteScroll";
import Service from "@/components/landing/Service";
import Tools from "@/components/landing/Tools";
import Footer from "@/components/partials/Footer";
import Navbar from "@/components/partials/Navbar";
import {fetchData} from "@/api/Content.API";
import {ContentProvider} from "@/utils/hooks/ContentProvider";

export default async function Page() {
    // const { menu, product, service, footer } = await fetch('https://api-cms.nxin.tech',
    //     {
    //         next: { revalidate: 3}, // Revalidate every 30 seconds
    //     }
    // ).then(() => fetchData());

    // console.log('pages - product', product);

    return (
        <main>
            {/* <ContentProvider menuData={menu} productData={product} serviceData={service} footerData={footer}> */}
                <Navbar />
                <HeroSection />
                <About />
                <InfiniteScroll />
                <Work />
                <Service />
                <Tools />
                <Footer />
            {/* </ContentProvider> */}
        </main>
    )
}

import HeroSection from '@/components/landing/HeroSection'
import Work from '@/components/landing/Work'
import About from '@/components/landing/About'
import InfiniteScroll from "@/components/landing/InfiniteScroll";
import Service from "@/components/landing/Service";
import Tools from "@/components/landing/Tools";
import Footer from "@/components/partials/Footer";
import Navbar from "@/components/partials/Navbar";
import {APIGetMenu} from "@/api/APIMenu";
import {APIGetProject} from "@/api/APIProduct";
import {APIGetService} from "@/api/APIService";
import {APIGetFooter} from "@/api/APIFooter";

export default async function Page() {
    const menuData: any = await getMenuData();
    const projectData: any = await getProjectData();
    const serviceData: any = await getServiceData();
    const footerData: any = await getFooterData();
    return (
        <div className={'bg-paper-texture'}>
            <Navbar data={menuData} />
            <HeroSection />
            <About />
            <InfiniteScroll />
            <Work data={projectData} />
            <Service data={serviceData} />
            <Tools />
            <Footer data={footerData} />
        </div>
    )
}

async function getMenuData() {
    let menuData: any = null;
    try {
        const response: any = await APIGetMenu()
        // console.log('Get API for menu response', response)
        menuData = response;
    } catch (error: any) {
        console.log('Error fetching menu data:', error);
    }
    return menuData;
}

async function getProjectData() {
    let projectData: any = null;
    try {
        const response: any = await APIGetProject()
        // console.log('Get API for project response', response)
        projectData = response;
    } catch (error: any) {
        console.log('Error fetching project data:', error);
    }
    return projectData;
}

async function getServiceData() {
    let serviceData: any = null;
    try {
        const response: any = await APIGetService()
        // console.log('Get API for service response', response)
        serviceData = response;
    } catch (error: any) {
        console.log('Error fetching service data:', error);
    }
    return serviceData;
}

async function getFooterData() {
    let footerData: any = null;
    try {
        const response: any = await APIGetFooter()
        // console.log('Get API for service response', response)
        footerData = response;
    } catch (error: any) {
        console.log('Error fetching footer data:', error);
    }
    return footerData;
}


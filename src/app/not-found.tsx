import Link from "next/link";
import Image from "next/image";
import errorImg from "../../public/image/scribbbles/error.jpg";

export default function NotFound() {
    return(
        <div className={'h-screen w-full relative'}>
            <Image src={errorImg} alt={'error Image'} className={'w-full h-full'} />
            <Link href='/' className={'absolute top-1/2 left-1/2 bg-orange-600 hover:bg-orange-700 text-white border-2 border-white py-2 px-6 font-bold'}>Go Back</Link>
        </div>
    )
}

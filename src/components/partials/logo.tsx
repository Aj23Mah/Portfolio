import logoImg from "../../../public/image/logo.png"
import Image from "next/image";

export default function Logo() {
    return(
        <div className="w-full h-full">
            <Image src={logoImg} alt="logo image" height={54} width={54} />
        </div>
    )
}
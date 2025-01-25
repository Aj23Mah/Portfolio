import logoImg from "../../../public/image/logo.png"
import Image from "next/image";

export default function Logo() {
    return(
        <div className="">
            <Image src={logoImg} alt="logo image" height={250} width={250} />
        </div>
    )
}
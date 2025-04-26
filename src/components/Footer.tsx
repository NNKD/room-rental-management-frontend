import Logo from "./Logo.tsx";
import Menu from "./Menu.tsx";

export default function Footer() {
    return (
        <div className="h-[100px] p-8 md:p-12 bg-lightGreen flex flex-col lg:flex-row lg:items-center gap-4 justify-center lg:justify-between">
            <Logo textColor={"text-white"}/>
            <Menu showLogin={false} textColor={"text-white"} underlineColor={"lg:before:bg-white"} />
        </div>
    )
}
import {PiBuildingApartmentBold} from "react-icons/pi";
import Menu from "./Menu.tsx";
import {IoMenu} from "react-icons/io5";
import {IoIosClose} from "react-icons/io";
import {useState} from "react";

export default function Header() {
    const [showSideBar, setShowSideBar] = useState(false)


    return (
        <div className="flex items-center justify-between select-none">
            <div className="flex items-center gap-4">
                <PiBuildingApartmentBold className="w-8 h-8 md:w-10 md:h-10"/>
                <h1 className="text-xl md:text-2xl font-semibold">Name site</h1>
            </div>

            {/*mobile show sidebar, desktop hide*/}
            <div className="p-2 cursor-pointer" onClick={() => setShowSideBar(!showSideBar)}>
                <IoMenu className="lg:hidden text-3xl md:text-4xl" />
            </div>

            {showSideBar ? (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.3)] lg:hidden" onClick={() => setShowSideBar(!showSideBar)}>
                    <div className="w-2/5 h-full ml-auto bg-white animate-slide-right-to-left-500" onClick={(e) => e.stopPropagation()}>
                        <div className="p-2 ml-auto w-fit cursor-pointer" onClick={() => setShowSideBar(!showSideBar)}>
                            <IoIosClose className="text-4xl" />
                        </div>
                        <Menu showLogin={true}/>
                    </div>
                </div>
            ) : ("")}


            {/*desktop show menu*/}
            <div className="hidden lg:block">
                <Menu showLogin={true}/>
            </div>
        </div>
    )
}
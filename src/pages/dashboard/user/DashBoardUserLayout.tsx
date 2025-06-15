import {Outlet} from "react-router-dom";
import SidebarUser from "./SidebarUser.tsx";
import {useEffect, useState} from "react";
import {FaBars} from "react-icons/fa";
import {IoClose} from "react-icons/io5";

export default function DashBoardUserLayout() {
    const [showSidebar, setShowSidebar] = useState(false)
    const [isDesktop, setIsDesktop] = useState(true)

    useEffect(() => {
        window.addEventListener("resize", handleCheckDesktop);
        handleCheckDesktop()
        return () => {
            window.removeEventListener("resize", handleCheckDesktop);
        }
    }, []);

    const handleCheckDesktop = () => {
        if (window.innerWidth < 1024) {
            setIsDesktop(false);
        }else {
            setIsDesktop(true);
        }
    }

    return (
        <div className="flex h-screen">
            {!isDesktop ? (
                <div>
                    {!showSidebar ? (
                        <div className="absolute top-0 right-0 p-6" onClick={() => setShowSidebar(!showSidebar)}>
                            <FaBars className="text-4xl"/>
                        </div>
                    ) : ""}


                    {showSidebar ? (
                        <div className="lg:hidden absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 z-[60]" onClick={() => setShowSidebar(!showSidebar)}>
                            <div className="absolute bg-white top-0 right-0 bottom-0" onClick={(e) => e.stopPropagation()}>
                                <div className="ml-auto p-2 w-fit" onClick={() => setShowSidebar(!showSidebar)}>
                                    <IoClose className="text-2xl"/>
                                </div>
                                <SidebarUser/>
                            </div>
                        </div>
                    ) : ""}
                </div>
            ) : (
                <SidebarUser/>
            )}

            <div className="w-full lg:w-4/5 p-6 text-center bg-[#f6f6f6]">
                <Outlet/>
            </div>
        </div>
    )
}
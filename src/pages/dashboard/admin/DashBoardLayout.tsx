import Sidebar from "./Sidebar.tsx";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export default function DashBoardLayout() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const handleCheckDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024);
            if (window.innerWidth >= 1024) {
                setShowSidebar(false); // Đóng sidebar trên desktop
            }
        };

        handleCheckDesktop();
        window.addEventListener("resize", handleCheckDesktop);
        return () => window.removeEventListener("resize", handleCheckDesktop);
    }, []);

    return (
        <div className="flex h-screen">
            {isDesktop ? (
                <Sidebar />
            ) : (
                <div>
                    {!showSidebar && (
                        <div className="absolute top-0 right-0 p-6" onClick={() => setShowSidebar(true)}>
                            <FaBars className="text-4xl" />
                        </div>
                    )}
                    {showSidebar && (
                        <div
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-30 z-[60]"
                            onClick={() => setShowSidebar(false)}
                        >
                            <div
                                className="absolute bg-white top-0 right-0 bottom-0 w-64"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="ml-auto p-2 w-fit" onClick={() => setShowSidebar(false)}>
                                    <IoClose className="text-2xl" />
                                </div>
                                <Sidebar />
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="w-full lg:w-4/5 p-6 text-center bg-[#f6f6f6] overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}
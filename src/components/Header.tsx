import Menu from "./Menu.tsx";
import { IoMenu, IoClose } from "react-icons/io5";
import { useState } from "react";
import Logo from "./Logo.tsx";
import { useTranslation } from "react-i18next";

export default function Header() {
    const [showSideBar, setShowSideBar] = useState(false);
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === "vi" ? "en" : "vi";
        console.log("Changing language to:", newLang); // Debug
        i18n.changeLanguage(newLang, (err) => {
            if (err) console.error("Error changing language:", err); // Debug lỗi
        });
    };

    return (
        <div className="flex items-center justify-between select-none h-[120px] p-8 md:p-12">
            <Logo textColor={"text-black"} />
            <div className="flex items-center gap-6">
                <div className="hidden lg:block">
                    <Menu
                        showLogin={true}
                        textColor={"text-black"}
                        underlineColor={"lg:before:bg-black"}
                    />
                </div>
                <div
                    className="p-2 pr-0 cursor-pointer lg:hidden"
                    onClick={() => setShowSideBar(!showSideBar)}
                >
                    <IoMenu className="text-3xl md:text-4xl" />
                </div>
                <button
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-200 shadow-md"
                    onClick={toggleLanguage}
                >
                    {i18n.language === "vi" ? "VN" : "EN"}
                </button>
            </div>
            {showSideBar ? (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.3)] lg:hidden"
                    onClick={() => setShowSideBar(!showSideBar)}
                >
                    <div
                        className="w-2/5 h-full ml-auto text-center bg-white animate-slide-right-to-left-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="p-2 ml-auto w-fit cursor-pointer"
                            onClick={() => setShowSideBar(!showSideBar)}
                        >
                            <IoClose className="text-4xl" />
                        </div>
                        <Menu
                            showLogin={true}
                            textColor={"text-black"}
                            underlineColor={"lg:before:bg-black"}
                        />
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
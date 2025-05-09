import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import {IconType} from "react-icons";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

/*
    Using in Sidebar Component
    title: name of the element ("Quản lý căn hộ", "Phòng", "Loại Phòng",...)
    Icon: name of icon from react-icon (FaHome, MdOutlineWorkspacePremium, FaUsersBetweenLines, ...)
    isShowSubMenu: if has this prop show icon up or down (for dropdown menu). True => Up icon | False => Down icon
    path: is a path of page. Ex: apartment-management, apartment-type-management,...
 */

export default function SidebarItem({title, Icon, isShowSubMenu, path}: {title: string, Icon?: IconType, isShowSubMenu?: boolean, path?: string}) {

    // Object has pathname. Ex(pathname): /dashboard/apartment-management, /dashboard/apartment-type-management
    const location = useLocation();

    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        handleActive()
    }, [location])

    const handleActive = () => {
        // Get last section of path by /. Ex: apartment-management, apartment-type-management
        const pathFromUrl = location.pathname.split("/")[2];
        if (path != null && path != undefined) {
            setIsActive(pathFromUrl == path);
        }
    }

    return (
        <div className={`relative p-2 rounded-lg my-2 
                         ${isActive ? "bg-lightGreen" : "hover:bg-lightGreen transition-all duration-300 ease-in-out cursor-pointer"}`}>

            {/* Show icon if item has icon */}
            {Icon ? (
                    <div className="absolute top-0 left-2 translate-y-1/2 text-xl">
                        <Icon/>
                    </div>
                ) : ""}

            <p className="text-base ml-9">{title}</p>

            {/* If true => up icon, false => down icon. else not show*/}
            {isShowSubMenu == true ? (
                <MdKeyboardArrowUp className="absolute top-0 right-2 translate-y-1/2 text-xl"/>
            ) : (
                isShowSubMenu == false ? (
                    <MdKeyboardArrowDown className="absolute top-0 right-2 translate-y-1/2 text-xl"/>
                ) : ""
            )}

        </div>
    )
}
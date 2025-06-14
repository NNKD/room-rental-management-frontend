import {Outlet} from "react-router-dom";
import SidebarUser from "./SidebarUser.tsx";

export default function DashBoardUserLayout() {
    return (
        <div className="flex h-screen">
            <SidebarUser/>
            <div className="w-full lg:w-4/5 p-6 text-center bg-[#f6f6f6]">
                <Outlet/>
            </div>
        </div>
    )
}
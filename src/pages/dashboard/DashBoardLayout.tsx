import Sidebar from "./admin/Sidebar.tsx";
import {Outlet} from "react-router-dom";

export default function DashBoardLayout() {
    return (
        <div className="flex h-screen">
            <Sidebar/>
            <div className="w-full lg:w-4/5 p-6 text-center bg-[#f6f6f6]">
                <Outlet/>
            </div>
        </div>
    )
}
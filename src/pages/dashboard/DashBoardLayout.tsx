import Sidebar from "../../components/Sidebar.tsx";
import {Outlet} from "react-router-dom";

export default function DashBoardLayout() {
    return (
        <div className="flex h-screen">
            <Sidebar/>
            <div className="w-4/5 p-6 text-center bg-[#f6f6f6]">
                <Outlet/>
            </div>
        </div>
    )
}
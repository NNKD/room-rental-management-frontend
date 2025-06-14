import SidebarItem from "../../../components/SidebarItem.tsx";
import {
    FaChartLine,
    FaFileContract,
    FaFileInvoiceDollar,
    FaHome,
    FaSignOutAlt,
} from "react-icons/fa";
import {MdOutlineWorkspacePremium} from "react-icons/md";
import {FaGear} from "react-icons/fa6";
import {useAuth} from "../../../hook/useAuth.ts";


export default function SidebarUser() {
    const {logout} = useAuth()


    return (
        <div className="w-full lg:w-1/5 lg:h-screen p-1 select-none overflow-y-auto">
            <SidebarItem title={"Căn hộ"} Icon={FaHome}/>
            <SidebarItem title={"Dịch vụ"} Icon={MdOutlineWorkspacePremium}/>
            <SidebarItem title={"Hợp đồng thuê"} Icon={FaFileContract} />
            <SidebarItem title={"Quản lý hoá đơn"} Icon={FaFileInvoiceDollar}/>
            <SidebarItem title={"Báo cáo & Thống kê"} Icon={FaChartLine} />
            <SidebarItem title={"Quản lý tài khoản"} Icon={FaGear}/>

            <div onClick={logout}>
                <SidebarItem title={"Đăng xuất"} Icon={FaSignOutAlt} />
            </div>
        </div>
    )
}
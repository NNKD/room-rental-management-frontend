import SidebarItem from "./SidebarItem.tsx";
import {FaChartLine, FaFileContract, FaFileInvoiceDollar, FaHome, FaRegSmile} from "react-icons/fa";
import {MdOutlineWorkspacePremium} from "react-icons/md";
import {FaGear, FaUsersBetweenLines} from "react-icons/fa6";
import {useState} from "react";


export default function Sidebar() {
    const [showApartmentSubMenu, setShowApartmentSubMenu] = useState(false)
    const [showServiceSubMenu, setShowServiceSubMenu] = useState(false)
    const [showUpdateSubMenu, setShowUpdateSubMenu] = useState(false)
    const [showBillSubMenu, setShowBillSubMenu] = useState(false)

    return (
        <div className="w-1/5 h-screen p-1 select-none overflow-y-auto">
            <div onClick={() => setShowApartmentSubMenu(!showApartmentSubMenu)}>
                <SidebarItem title={"Quản lý căn hộ"} Icon={FaHome} isShowSubMenu={showApartmentSubMenu} />
            </div>

            {showApartmentSubMenu ? (
                <div className="animate-slide-top-to-bottom-400">
                    <SidebarItem title={"Căn hộ"} />
                    <SidebarItem title={"Loại căn hộ"} />
                </div>
            ) : ""}


            <div onClick={() => setShowServiceSubMenu(!showServiceSubMenu)}>
                <SidebarItem title={"Quản lý dịch vụ"} Icon={MdOutlineWorkspacePremium} isShowSubMenu={showServiceSubMenu} />
            </div>

            {showServiceSubMenu ? (
                <div className="animate-slide-top-to-bottom-400">
                    <SidebarItem title={"Bảng giá dịch vụ"} />
                    <SidebarItem title={"Nợ mua hàng"} />

                    <div onClick={() => setShowUpdateSubMenu(!showUpdateSubMenu)}>
                        <SidebarItem title={"Cập nhật chỉ số"} isShowSubMenu={showUpdateSubMenu} />
                    </div>

                    {showUpdateSubMenu ? (
                        <div className="animate-slide-top-to-bottom-400">
                            <SidebarItem title={"Điện"} />
                            <SidebarItem title={"Nước"} />
                            <SidebarItem title={"Giặt là"} />
                        </div>
                    ) : ""}

                </div>
            ) : ""}

            <SidebarItem title={"Quản lý cư dân"} Icon={FaUsersBetweenLines} />
            <SidebarItem title={"Hợp đồng thuê"} Icon={FaFileContract} />

            <div onClick={() => setShowBillSubMenu(!showBillSubMenu)}>
                <SidebarItem title={"Quản lý hoá đơn"} Icon={FaFileInvoiceDollar} isShowSubMenu={showBillSubMenu}/>
            </div>

            {showBillSubMenu ? (
                <div className="animate-slide-top-to-bottom-400">
                    <SidebarItem title={"Tạo hoá đơn hàng tháng"} />
                    <SidebarItem title={"Hoá đơn"} />
                </div>
            ) : ""}


            <SidebarItem title={"Báo cáo & Thống kê"} Icon={FaChartLine} />
            <SidebarItem title={"Phản hồi cư dân"} Icon={FaRegSmile} />
            <SidebarItem title={"Quản lý tài khoản"} Icon={FaGear} />


        </div>
    )
}
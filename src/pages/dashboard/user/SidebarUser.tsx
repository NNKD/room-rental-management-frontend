import SidebarItem from "../../../components/SidebarItem.tsx";
import {
    FaFileContract,
    FaHome,
    FaSignOutAlt,
} from "react-icons/fa";
import {FaGear} from "react-icons/fa6";
import {useAuth} from "../../../hook/useAuth.ts";
import {useNavigate} from "react-router-dom";


export default function SidebarUser() {
    const {logout} = useAuth()
    const navigate = useNavigate()


    return (
        <div className="w-full lg:w-1/5 lg:h-screen p-1 select-none overflow-y-auto">
            <div onClick={() => navigate("apartments")}>
                <SidebarItem title={"Căn hộ"} Icon={FaHome} path={"apartments"}/>
            </div>
            <div onClick={() => navigate("billings")}>
                <SidebarItem title={"Hoá đơn"} Icon={FaFileContract} path={"billings"}/>

            </div>
            <div onClick={() => navigate("account")}>
                <SidebarItem title={"Quản lý tài khoản"} Icon={FaGear} path={"account"}/>
            </div>
            <div onClick={() => navigate("change-pass")}>
                <SidebarItem title={"Đổi mật khẩu"} Icon={FaGear} path={"change-pass"}/>
            </div>

            <div onClick={logout}>
                <SidebarItem title={"Đăng xuất"} Icon={FaSignOutAlt} />
            </div>
        </div>
    )
}
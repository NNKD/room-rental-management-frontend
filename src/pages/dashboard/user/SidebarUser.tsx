import SidebarItem from "../../../components/SidebarItem.tsx";
import {
    FaFileInvoiceDollar,
    FaHome,
    FaSignOutAlt,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useAuth } from "../../../hook/useAuth.ts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SidebarUser() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="w-full lg:w-1/5 lg:h-screen p-1 select-none overflow-y-auto">
            <div onClick={() => navigate("apartments")}>
                <SidebarItem title={t("apartments")} Icon={FaHome} path={"apartments"} />
            </div>
            <div onClick={() => navigate("billings")}>
                <SidebarItem title={t("bills")} Icon={FaFileInvoiceDollar} path={"billings"} />
            </div>
            <div onClick={() => navigate("account")}>
                <SidebarItem title={t("account_management")} Icon={FaGear} path={"account"} />
            </div>
            <div onClick={() => navigate("change-pass")}>
                <SidebarItem title={t("change_password")} Icon={FaGear} path={"change-pass"} />
            </div>

            <div onClick={logout}>
                <SidebarItem title={t("logout")} Icon={FaSignOutAlt} />
            </div>
        </div>
    );
}
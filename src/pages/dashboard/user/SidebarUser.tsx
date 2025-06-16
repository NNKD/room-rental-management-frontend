import SidebarItem from "../../../components/SidebarItem.tsx";
import {
    FaChartLine,
    FaFileContract,
    FaFileInvoiceDollar,
    FaHome,
    FaSignOutAlt,
} from "react-icons/fa";
import { MdOutlineWorkspacePremium } from "react-icons/md";
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
            <div onClick={() => navigate("services")}>
                <SidebarItem title={t("service_management")} Icon={MdOutlineWorkspacePremium} path={"services"} />
            </div>
            <div onClick={() => navigate("rental-contract")}>
                <SidebarItem title={t("rental_contract")} Icon={FaFileContract} path={"rental-contract"} />
            </div>
            <div onClick={() => navigate("billings")}>
                <SidebarItem title={t("bills")} Icon={FaFileInvoiceDollar} path={"billings"} />
            </div>
            <div onClick={() => navigate("bill-management")}>
                <SidebarItem title={t("bill_management")} Icon={FaFileInvoiceDollar} path={"bill-management"} />
            </div>
            <div onClick={() => navigate("reports")}>
                <SidebarItem title={t("reports_statistics")} Icon={FaChartLine} path={"reports"} />
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
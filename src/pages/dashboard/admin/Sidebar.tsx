import SidebarItem from "../../../components/SidebarItem.tsx";
import {
    FaFileContract,
    FaFileInvoiceDollar,
    FaHome,
    FaSignOutAlt,
} from "react-icons/fa";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hook/useAuth.ts";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
    const [showApartmentSubMenu, setShowApartmentSubMenu] = useState(false);
    const [showBillSubMenu, setShowBillSubMenu] = useState(false);
    const [showUserManagement, setShowUserManagement] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="w-full lg:w-1/5 h-screen p-1 select-none overflow-y-auto">
            <div onClick={() => setShowApartmentSubMenu(!showApartmentSubMenu)}>
                <SidebarItem title={t("apartment_management")} Icon={FaHome} isShowSubMenu={showApartmentSubMenu} />
            </div>
            {showApartmentSubMenu && (
                <div className="animate-slide-top-to-bottom-400">
                    <div onClick={() => navigate("apartment-management")}>
                        <SidebarItem title={t("apartment")} path="apartment-management" />
                    </div>
                    <div onClick={() => navigate("apartment-type-management")}>
                        <SidebarItem title={t("apartment_type")} path="apartment-type-management" />
                    </div>
                </div>
            )}

            <div onClick={() => navigate("/dashboard/apartment-price-service")}>
                <SidebarItem title={t("service_management")} Icon={MdOutlineWorkspacePremium} path={"apartment-price-service"} />
            </div>


            <div onClick={() => navigate("/dashboard/rental-contract")}>
                <SidebarItem title={t("rental_contract")} Icon={FaFileContract} path={"rental-contract"} />
            </div>

            <div onClick={() => setShowBillSubMenu(!showBillSubMenu)}>
                <SidebarItem title={t("bill_management")} Icon={FaFileInvoiceDollar} isShowSubMenu={showBillSubMenu} />
            </div>
            {showBillSubMenu && (
                <div className="animate-slide-top-to-bottom-400">
                    <div onClick={() => navigate("/dashboard/bill-list")}>
                        <SidebarItem title={t("bills")} path="bill-list" />
                    </div>
                    <div onClick={() => navigate("/dashboard/bill-create")}>
                        <SidebarItem title={t("create_monthly_bill")} path="bill-create" />
                    </div>
                </div>
            )}



            <div onClick={() => setShowUserManagement(!showUserManagement)}>
                <SidebarItem title={t("account_management")} Icon={FaGear} isShowSubMenu={showUserManagement} />
            </div>
            {showUserManagement && (
                <div className="animate-slide-top-to-bottom-400">
                    <div onClick={() => navigate("/dashboard/user-management")}>
                        <SidebarItem title={t("user_list")} path="user-management" />
                    </div>
                    <div onClick={() => navigate("/dashboard/admin-management")}>
                        <SidebarItem title={t("admin_list")} path="admin-management" />
                    </div>
                </div>
            )}

            <div onClick={logout}>
                <SidebarItem title={t("logout")} Icon={FaSignOutAlt} />
            </div>
        </div>
    );
}

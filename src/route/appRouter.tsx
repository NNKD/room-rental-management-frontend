import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import ApartmentList from "../pages/ApartmentList.tsx";
import ApartmentDetail from "../pages/ApartmentDetail.tsx";
import Login from "../pages/Login.tsx";
import Amenities from "../pages/Amenities.tsx";
import DashBoardLayout from "../pages/dashboard/admin/DashBoardLayout.tsx";
import DashBoardContent from "../pages/dashboard/DashBoardContent.tsx";
import ApartmentManagement from "../pages/dashboard/admin/apartment/ApartmentManagement.tsx";
import ApartmentTypeManagement from "../pages/dashboard/admin/apartment/ApartmentTypeManagement.tsx";
import ApartmentPriceService from "../pages/dashboard/admin/apartment/ApartmentPriceService.tsx";
import ApartmentDetailDashboard from "../pages/dashboard/admin/apartment/ApartmentDetailDashboard.tsx";
import ForgotPassword from "../pages/FotgotPassword.tsx";
import Contact from "../pages/Contact.tsx";
import UserManagement from "../pages/dashboard/admin/userManagement/UserManagement.tsx";
import AdminManagement from "../pages/dashboard/admin/userManagement/AdminManagement.tsx";
import RentalContract from "../pages/dashboard/admin/RentalContract.tsx";
import BillList from "../pages/dashboard/admin/billing/BillList.tsx";
import BillCreate from "../pages/dashboard/admin/billing/BillCreate.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import DashBoardUserLayout from "../pages/dashboard/user/DashBoardUserLayout.tsx";
import UserApartmentManagement from "../pages/dashboard/user/UserApartmentManagement.tsx";
import UserApartmentDetail from "../pages/dashboard/user/UserApartmentDetail.tsx";
import UserBillManagement from "../pages/dashboard/user/UserBillManagement.tsx";
import UserAccountManagement from "../pages/dashboard/user/UserAccountManagement.tsx";
import ChangePass from "../pages/dashboard/user/ChangePass.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/home" replace />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "home",
                element: <Home />,
            },
            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "apartments",
                element: <ApartmentList />,
            },
            {
                path: "amenities",
                element: <Amenities />,
            },
            {
                path: "apartments/:slug",
                element: <ApartmentDetail />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "dashboard",
                element: (
                    <ProtectedRoute>
                        <DashBoardLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <DashBoardContent />,
                    },
                    {
                        path: "apartment-management",
                        element: <ApartmentManagement />,
                    },
                    {
                        path: "apartment-management/:slug",
                        element: <ApartmentDetailDashboard />,
                    },
                    {
                        path: "apartment-type-management",
                        element: <ApartmentTypeManagement />,
                    },
                    {
                        path: "apartment-price-service",
                        element: <ApartmentPriceService />,
                    },
                    {
                        path: "user-management",
                        element: <UserManagement />,
                    },
                    {
                        path: "admin-management",
                        element: <AdminManagement />,
                    },
                    {
                        path: "rental-contract",
                        element: <RentalContract />,
                    },
                    {
                        path: "bill-list",
                        element: <BillList />,
                    },
                    {
                        path: "bill-create",
                        element: <BillCreate />,
                    },
                ],
            },
            {
                path: "dashboard-user",
                element: (
                    <ProtectedRoute>
                        <DashBoardUserLayout/>
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <DashBoardContent />,
                    },
                    {
                        path: "apartments",
                        element: <UserApartmentManagement />,
                    },
                    {
                        path: "apartments/:slug",
                        element: <UserApartmentDetail />,
                    },
                    {
                        path: "billings",
                        element: <UserBillManagement />,
                    },
                    {
                        path: "account",
                        element: <UserAccountManagement />,
                    },
                    {
                        path: "change-pass",
                        element: <ChangePass />,
                    },
                ],
            },
        ],
    },

]);
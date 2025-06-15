import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import ApartmentList from "../pages/ApartmentList.tsx";
import ApartmentDetail from "../pages/ApartmentDetail.tsx";
import Login from "../pages/Login.tsx";
import Amenities from "../pages/Amenities.tsx";
import DashBoardLayout from "../pages/dashboard/admin/DashBoardLayout.tsx";
import DashBoardContent from "../pages/dashboard/admin/DashBoardContent.tsx";
import ApartmentManagement from "../pages/dashboard/admin/apartment/ApartmentManagement.tsx";
import ApartmentTypeManagement from "../pages/dashboard/admin/apartment/ApartmentTypeManagement.tsx";
import ApartmentPriceService from "../pages/dashboard/admin/apartment/ApartmentPriceService.tsx";
import ApartmentDetailDashboard from "../pages/dashboard/admin/apartment/ApartmentDetailDashboard.tsx";
import ForgotPassword from "../pages/FotgotPassword.tsx";
import Contact from "../pages/Contact.tsx";
import UserManagement from "../pages/dashboard/userManagement/UserManagement.tsx";
import AdminManagement from "../pages/dashboard/userManagement/AdminManagement.tsx";
import RentalContract from "../pages/dashboard/admin/RentalContract.tsx";
import BillList from "../pages/dashboard/admin/billing/BillList.tsx"; // Thêm file mới
import BillCreate from "../pages/dashboard/admin/billing/BillCreate.tsx"; // Thêm file mới

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
                    // <ProtectedRoute>
                    <DashBoardLayout />
                    // </ProtectedRoute>
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
                        element: <BillList />, // Thêm route cho danh sách hóa đơn
                    },
                    {
                        path: "bill-create",
                        element: <BillCreate />, // Thêm route cho tạo hóa đơn
                    },
                ],
            },
        ],
    },
]);
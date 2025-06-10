import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import ApartmentList from "../pages/ApartmentList.tsx";
import ApartmentDetail from "../pages/ApartmentDetail.tsx";
import Login from "../pages/Login.tsx";
import Amenities from "../pages/Amenities.tsx";
import DashBoardLayout from "../pages/dashboard/DashBoardLayout.tsx";
import DashBoardContent from "../pages/dashboard/DashBoardContent.tsx";
import ApartmentManagement from "../pages/dashboard/apartment/ApartmentManagement.tsx";
import ApartmentTypeManagement from "../pages/dashboard/apartment/ApartmentTypeManagement.tsx";
import ApartmentPriceService from "../pages/dashboard/apartment/ApartmentPriceService.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import ApartmentDetailDashboard from "../pages/dashboard/apartment/ApartmentDetailDashboard.tsx";
import ForgotPassword from "../pages/FotgotPassword.tsx";
import Contact from "../pages/Contact.tsx";

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
                ],
            },
        ],
    },

]);
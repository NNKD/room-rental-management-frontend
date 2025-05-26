// router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import ApartmentList from "../pages/ApartmentList.tsx";
import ApartmentDetail from "../pages/ApartmentDetail.tsx";
import Login from "../pages/Login.tsx";
import Amenities from "../pages/Amenities.tsx";
import DashBoardLayout from "../pages/dashboard/DashBoardLayout.tsx";
import DashBoardContent from "../pages/dashboard/DashBoardContent.tsx";
import ApartmentManagement from "../pages/dashboard/ApartmentManagement.tsx";
import ApartmentTypeManagement from "../pages/dashboard/ApartmentTypeManagement.tsx";
import ApartmentPriceService from "../pages/dashboard/ApartmentPriceService.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/login" replace />, // Redirect về login mặc định
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "home",
                element: (
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                ),
            },
            {
                path: "apartments",
                element: (
                    <ProtectedRoute>
                        <ApartmentList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "amenities",
                element: (
                    <ProtectedRoute>
                        <Amenities />
                    </ProtectedRoute>
                ),
            },
            {
                path: "apartment/:slug",
                element: (
                    <ProtectedRoute>
                        <ApartmentDetail />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/dashboard",
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
                path: "apartment-type-management",
                element: <ApartmentTypeManagement />,
            },
            {
                path: "apartment-price-service",
                element: <ApartmentPriceService />,
            },
        ],
    },
]);
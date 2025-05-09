import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import ApartmentList from "../pages/ApartmentList.tsx";
import ApartmentDetail from "../pages/ApartmentDetail.tsx";
import Login from "../pages/Login.tsx";
import Amenities from "../pages/Amenities.tsx";
import DashBoardLayout from "../pages/dashboard/DashBoardLayout.tsx";
import ApartmentManagement from "../pages/dashboard/ApartmentManagement.tsx";
import DashBoardContent from "../pages/dashboard/DashBoardContent.tsx";
import ApartmentTypeManagement from "../pages/dashboard/ApartmentTypeManagement.tsx";
import Contact from "../pages/dashboard/Contact.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "apartments",
                element: <ApartmentList/>
            },
            {
                path: "amenities",
                element: <Amenities/>
            },
            {
                path: "apartment/:slug",
                element: <ApartmentDetail/>
            }
        ]
    },
    {
        path: "/dashboard",
        element: <DashBoardLayout/>,
        children: [
            {
                index: true,
                element: <DashBoardContent/>
            },
            {
              path: "apartment-management",
              element: <ApartmentManagement/>
            },
            {
              path: "apartment-type-management",
              element: <ApartmentTypeManagement/>
            },
            {
                path: "contact",
                element: <Contact></Contact>
            }
        ]
    }
])
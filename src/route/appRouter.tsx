import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import ApartmentList from "../pages/ApartmentList.tsx";
import ApartmentDetail from "../pages/ApartmentDetail.tsx";

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
                path: "apartments",
                element: <ApartmentList/>
            },
            {
                path: "apartment/:slug",
                element: <ApartmentDetail/>
            }
        ]
    }
])
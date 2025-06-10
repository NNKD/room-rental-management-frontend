import { Outlet } from "react-router-dom";
import { NoticeProvider } from "./contexts/NoticeContext.tsx";
import NoticeUI from "./components/NoticeUI.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext.tsx";
import LoadingApi from "./components/LoadingApi.tsx";

export default function App() {
    return (
        <AuthProvider>
            <NoticeProvider>
                <LoadingProvider>
                    <Outlet />
                    <NoticeUI />
                    <LoadingApi />
                </LoadingProvider>
            </NoticeProvider>
        </AuthProvider>
    );
}
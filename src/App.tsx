import { Outlet } from "react-router-dom";
import { NoticeProvider } from "./contexts/NoticeContext.tsx";
import NoticeUI from "./components/NoticeUI.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext.tsx";
import LoadingApi from "./components/LoadingApi.tsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

export default function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <NoticeProvider>
                    <LoadingProvider>
                        <Outlet />
                        <NoticeUI />
                        <LoadingApi />
                    </LoadingProvider>
                </NoticeProvider>
            </AuthProvider>
        </I18nextProvider>
    );
}
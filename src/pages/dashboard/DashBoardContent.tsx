import { useTranslation } from "react-i18next";

export default function DashBoardContent() {
    const { t } = useTranslation();

    return (
        <div className="h-full flex items-center justify-center">
            <p className="text-2xl font-bold">{t("welcome_back")}</p>
        </div>
    );
}
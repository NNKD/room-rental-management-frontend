import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface MenuProps {
    showLogin: boolean;
    textColor: string;
    underlineColor: string;
}

export default function Menu({ showLogin, textColor, underlineColor }: MenuProps) {
    const { t } = useTranslation();

    return (
        <div className={`flex flex-col lg:flex-row md:items-center md:gap-8 lg:gap-12`}>
            <Link
                to="/"
                className={`relative lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2 lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full ${underlineColor} lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out text-base ${textColor} py-2`}
            >
                {t("home")}
            </Link>
            <Link
                to="/apartments"
                className={`relative lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2 lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full ${underlineColor} lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out text-base ${textColor} py-2`}
            >
                {t("apartments")}
            </Link>
            <Link
                to="/amenities"
                className={`relative lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2 lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full ${underlineColor} lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out text-base ${textColor} py-2`}
            >
                {t("amenities")}
            </Link>
            <Link
                to="/contact"
                className={`relative lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2 lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full ${underlineColor} lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out text-base ${textColor} py-2`}
            >
                {t("contact")}
            </Link>
            {showLogin ? (
                <Link
                    to="/login"
                    className={`relative lg:before:absolute lg:before:bottom-0 lg:before:left-1/2 lg:before:-translate-x-1/2 lg:before:w-0 lg:before:h-0.5 lg:hover:before:w-full ${underlineColor} lg:before:transition-all lg:before:duration-300 lg:before:ease-in-out text-base ${textColor} py-2`}
                >
                    {t("login")}
                </Link>
            ) : (
                ""
            )}
        </div>
    );
}
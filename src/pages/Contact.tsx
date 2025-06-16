import React from "react";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { useTranslation } from "react-i18next";

const Contact: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Banner */}
            <div className="bg-teal-500 text-white py-16 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">{t("contact_management_title")}</h1>
                    <p className="text-xl">{t("contact_management_support")}</p>
                </div>
            </div>

            {/* Map and Contact Info */}
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Section */}
                <div className="lg:col-span-2 bg-white rounded shadow">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.363918748872!2d106.71222587485614!3d10.786840259001526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528c0b6fda0fd%3A0x3a9e09f92df34ecb!2sVinhomes%20Central%20Park!5e0!3m2!1sen!2s!4v1748000000000!5m2!1sen!2s"
                        width="100%"
                        height="500"
                        title="GreenHome Apartment Map"
                        className="border-0"
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>

                {/* Contact Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded shadow p-6">
                        <h2 className="text-lg font-medium text-blue-600 mb-4">{t("building_info")}</h2>

                        <div className="mb-6">
                            <h3 className="font-medium mb-2">{t("address")}</h3>
                            <p className="text-sm text-gray-600">
                                Tòa chung cư Green Home, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium mb-2">{t("working_hours")}</h3>
                            <p className="text-sm text-gray-600">{t("monday_to_saturday")}: 08:00 - 17:00</p>
                            <p className="text-sm text-gray-600">{t("sunday")}: {t("off")}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium mb-2">{t("managed_area")}</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• {t("basement_parking")}</li>
                                <li>• {t("reception_lobby")}</li>
                                <li>• {t("apartments_floors_2_to_35")}</li>
                                <li>• {t("pool_and_sports_area")}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Methods */}
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-blue-800 mb-10">{t("management_contact_info")}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Email */}
                    <div className="flex flex-col items-center">
                        <div className="bg-green-500 rounded-full p-4 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="font-medium mb-2">lienhe@greenhome.vn</p>
                        <p className="text-gray-600 text-sm">{t("email")}</p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col items-center">
                        <div className="bg-blue-500 rounded-full p-4 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                        </div>
                        <p className="font-medium mb-2">028 1234 5678</p>
                        <p className="text-gray-600 text-sm">{t("management_phone")}</p>
                    </div>

                    {/* Website */}
                    <div className="flex flex-col items-center">
                        <div className="bg-orange-500 rounded-full p-4 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                                />
                            </svg>
                        </div>
                        <p className="font-medium mb-2">www.greenhome.vn</p>
                        <p className="text-gray-600 text-sm">{t("resident_website")}</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
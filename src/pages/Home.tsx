import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import ApartmentItem from "../components/ApartmentItem.tsx";
import Search from "../components/Search.tsx";
import { useEffect, useState } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { ApartmentListItem } from "../types/Apartment.ts";
import { useNotice } from "../hook/useNotice.ts";
import { NoticeType } from "../types/Context.ts";
import SkeletonApartmentItem from "../components/skeleton-loading/SkeletonApartmentItem.tsx";
import { envVar } from "../utils/EnvironmentVariables.ts";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Thêm import useTranslation

export default function Home() {
    const [name, setName] = useState("");
    const [typeSearch, setTypeSearch] = useState("");
    const [indexCarousel, setIndexCarousel] = useState(0);
    const [visibleAmount, setVisibleAmount] = useState(4);
    const [topOffers, setTopOffers] = useState<ApartmentListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { setMessage, setType } = useNotice();
    const navigate = useNavigate();
    const { t } = useTranslation(); // Sử dụng useTranslation để lấy hàm t

    useEffect(() => {
        console.log(name, typeSearch);
    }, [name, typeSearch]);

    useEffect(() => {
        if (topOffers) {
            setLoading(false);
        }
    }, [topOffers]);

    const handleSearch = () => {
        console.log("Search button clicked");
        navigate(`/apartments?name=${name}&type=${typeSearch}`);
    };

    const handleCallAPI = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${envVar.API_URL}/apartments/hot`);

            if (response.data.status === "success" && response.data.statusCode === 200) {
                setTopOffers(response.data.data);
            }
        } catch (error) {
            setType(NoticeType.ERROR);
            setMessage(`${t("error_occurred")}: ${error}`); // Dịch lỗi
        }
    };

    useEffect(() => {
        handleCallAPI();
        window.addEventListener("resize", handleGetAmount);
        handleGetAmount();
        return () => {
            window.removeEventListener("resize", handleGetAmount);
        };
    }, []);

    const handleGetAmount = () => {
        if (window.innerWidth < 760) {
            setVisibleAmount(1);
        } else if (window.innerWidth < 1024) {
            setVisibleAmount(2);
        } else {
            setVisibleAmount(4);
        }
    };

    const handleCarousel = (type: number) => {
        if (type === 1) {
            setIndexCarousel(Math.min(indexCarousel + 1, topOffers.length - visibleAmount));
        } else if (type === -1) {
            setIndexCarousel(Math.max(0, indexCarousel - 1));
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="bg-[#CCFFCC]">
                <div className="mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="lg:w-1/2 mb-8 md:mb-0 md:mt-28">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 my-4">
                                {t("modern_living")}
                            </h1>
                            <p className="text-gray-700 mb-10">
                                {t("comprehensive_service")}
                            </p>
                            <div className="text-center mb-6">
                                <Search setName={setName} setType={setTypeSearch} searchBtn={handleSearch} />
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/053/649/515/non_2x/isolated-office-building-symbol-on-for-architectural-designs-and-business-concepts-free-png.png"
                                alt={t("modern_apartment_alt")}
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-blue-50 py-12">
                <div className="mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("featured_apartments")}</h2>
                            <p className="text-gray-700">
                                {t("fulfill_dreams")}
                            </p>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0 select-none">
                            <div className="mr-1 cursor-pointer" onClick={() => handleCarousel(-1)}>
                                <IoIosArrowDropleft className="text-4xl hover:text-lightGreenHover transition-all duration-300 ease-in-out" />
                            </div>
                            <div className="ml-1 cursor-pointer" onClick={() => handleCarousel(1)}>
                                <IoIosArrowDropright className="text-4xl hover:text-lightGreenHover transition-all duration-300 ease-in-out" />
                            </div>
                            <Link to="/apartments" className="text-xl ml-4 text-teal-500 hover:underline">
                                {t("view_all")}
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            Array(visibleAmount)
                                .fill(0)
                                .map((_, index) => <SkeletonApartmentItem key={index} />)
                        ) : topOffers.length > 0 ? (
                            topOffers
                                .slice(indexCarousel, indexCarousel + visibleAmount)
                                .map((offer) => <ApartmentItem key={offer.id} apartment={offer} />)
                        ) : (
                            <p>{t("no_featured_apartments")}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Phần About Us */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
                </div>

                <div className="relative mx-auto px-6 md:px-12 max-w-7xl space-y-32">
                    {/* Section 1 - Về chúng tôi */}
                    <div className="flex flex-col lg:flex-row items-center justify-between group">
                        <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-16">
                            <div className="space-y-6">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full text-sm font-medium text-teal-700 mb-4">
                                    ✨ {t("experience_15_years")}
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    {t("about_us")}
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {t("about_us_description")}
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {t("team_support")}
                                </p>
                                <div className="flex items-center space-x-6 pt-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-teal-600">{t("satisfied_customers")}</div>
                                        <div className="text-sm text-gray-500">{t("satisfied_customers")}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">{t("completed_projects")}</div>
                                        <div className="text-sm text-gray-500">{t("completed_projects")}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-indigo-600">{t("years_experience")}</div>
                                        <div className="text-sm text-gray-500">{t("years_experience")}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="relative group-hover:scale-105 transition-transform duration-700 ease-out">
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <img
                                    src="https://www.pwc.com/gx/en/issues/esg/sustainable-by-design-hero.jpg"
                                    alt={t("company_intro_alt")}
                                    className="relative w-full h-auto rounded-3xl shadow-2xl border border-white/20"
                                />
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-teal-600">{t("rating")}</div>
                                        <div className="text-xs text-gray-500">{t("rating")}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 - Tầm nhìn & Sứ mệnh */}
                    <div className="flex flex-col lg:flex-row-reverse items-center justify-between group">
                        <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pl-16">
                            <div className="space-y-6">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-sm font-medium text-indigo-700 mb-4">
                                    🎯 {t("vision_tag")}
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    {t("vision_mission")}
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {t("vision_description")}
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {t("mission_description")}
                                </p>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                        <div className="text-2xl mb-2">🌱</div>
                                        <div className="font-semibold text-gray-800">{t("sustainable")}</div>
                                        <div className="text-sm text-gray-600">{t("eco_friendly")}</div>
                                    </div>
                                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                        <div className="text-2xl mb-2">💡</div>
                                        <div className="font-semibold text-gray-800">{t("creative")}</div>
                                        <div className="text-sm text-gray-600">{t("unique_solutions")}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="relative group-hover:scale-105 transition-transform duration-700 ease-out">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <img
                                    src="https://img.freepik.com/free-photo/successful-business-team-having-meeting-modern-office_1303-21178.jpg"
                                    alt={t("vision_mission_alt")}
                                    className="relative w-full h-auto rounded-3xl shadow-2xl border border-white/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3 - Giá trị cốt lõi */}
                    <div className="flex flex-col lg:flex-row items-center justify-between group">
                        <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-16">
                            <div className="space-y-6">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full text-sm font-medium text-emerald-700 mb-4">
                                    💎 {t("core_values_tag")}
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    {t("core_values")}
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl">
                                            🤝
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 mb-1">{t("transparency_commitment")}</div>
                                            <div className="text-gray-600">{t("transparency_description")}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl">
                                            🌟
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 mb-1">{t("customer_centric")}</div>
                                            <div className="text-gray-600">{t("customer_centric_description")}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-xl">
                                            🚀
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 mb-1">{t("continuous_innovation")}</div>
                                            <div className="text-gray-600">{t("innovation_description")}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl">
                                            💼
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 mb-1">{t("professional_team")}</div>
                                            <div className="text-gray-600">{t("team_description")}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="relative group-hover:scale-105 transition-transform duration-700 ease-out">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <img
                                    src="https://i.ex-cdn.com/nongnghiepmoitruong.vn/files/content/2025/05/07/ttc-agris-cam-ket-phat-trien-ben-vung-qua-moi-hoat-dong-cua-doanh-nghiep-190444_353.jpg"
                                    alt={t("core_values_alt")}
                                    className="relative w-full h-auto rounded-3xl shadow-2xl border border-white/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center py-16">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full text-sm font-medium text-rose-700 mb-6">
                                🏠 {t("find_ideal_space")}
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                {t("ready_to_start")}
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                                {t("cta_description")}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                                <Link
                                    to="/contact"
                                    className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    <span className="relative z-10">{t("contact_now")}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <Link
                                    to="/apartments"
                                    className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-teal-500 hover:text-teal-600 transition-all duration-300"
                                >
                                    {t("view_projects")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
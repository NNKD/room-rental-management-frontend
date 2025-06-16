import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { PiBuildings, PiLifebuoyFill, PiTowel } from "react-icons/pi";
import { IoFastFoodOutline } from "react-icons/io5";
import { GrHostMaintenance } from "react-icons/gr";
import { BsCarFront } from "react-icons/bs";
import { FaChargingStation, FaSpa, FaStore, FaWifi } from "react-icons/fa6";
import { FaSwimmingPool } from "react-icons/fa";
import { LuCctv } from "react-icons/lu";
import { TbBulb, TbHorseToy, TbMonkeybar } from "react-icons/tb";
import {
    MdOutlineBedroomParent,
    MdOutlineDeck,
    MdOutlineDesignServices,
    MdOutlineLocalLaundryService,
    MdOutlineWorkspacePremium,
} from "react-icons/md";
import { GiTreeSwing, GiUnbalanced } from "react-icons/gi";
import { formatCurrency } from "../utils/NumberCalculate.ts";
import { ServiceType, TableHeader } from "../types/Dashboard.ts";
import DynamicTable from "../components/DynamicTable.tsx";
import { useEffect, useState } from "react";
import { NoticeType } from "../types/Context.ts";
import { useNotice } from "../hook/useNotice.ts";
import axios from "axios";
import { envVar } from "../utils/EnvironmentVariables.ts";
import { useTranslation } from "react-i18next";

export default function Amenities() {
    const [services, setServices] = useState<ServiceType[]>([]);
    const { setMessage, setType } = useNotice();
    const { t } = useTranslation();

    const headers: TableHeader<ServiceType>[] = [
        { name: t("service_name"), slug: "name", center: true },
        { name: t("description"), slug: "description", center: true },
        { name: t("price_vnd"), slug: "price", center: true },
        { name: t("unit"), slug: "unit", center: true },
    ];

    useEffect(() => {
        handleGetServices();
    }, []);

    const handleGetServices = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/services`);

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                const serviceNormalizePrice = response.data.data.map((service: ServiceType) => ({
                    ...service,
                    price: formatCurrency(Number(service.price)),
                }));
                setServices(serviceNormalizePrice);
            }
        } catch (error) {
            console.log(error);
            setMessage(t("error_occurred") + ": " + error);
            setType(NoticeType.ERROR);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex-grow mx-auto my-10 px-6 md:px-12 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
                    <div className="w-full lg:w-2/5">
                        <h3 className="text-2xl md:text-4xl font-bold">{t("swimming_pool")}</h3>
                        <p className="text-sm md:text-base mt-4 mb-10">
                            {t("swimming_pool_description")}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 items-center gap-8">
                            <div className="flex items-center gap-3">
                                <PiTowel className="text-xl" />
                                <span className="text-base font-bold">{t("daily_towel")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <IoFastFoodOutline className="text-xl" />
                                <span className="text-base font-bold">{t("snacks")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <PiLifebuoyFill className="text-xl" />
                                <span className="text-base font-bold">{t("lifeguard_on_duty")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <GrHostMaintenance className="text-xl" />
                                <span className="text-base font-bold">{t("regular_maintenance")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-3/5 flex items-center justify-between gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1750077689/sp1_x0in31.png" />
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1750077688/sp2_neyzjv.png" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 my-20">
                    <div className="w-full lg:w-2/5">
                        <h3 className="text-2xl md:text-4xl font-bold">{t("premium_furniture")}</h3>
                        <p className="text-sm md:text-base mt-4 mb-10">
                            {t("premium_furniture_description")}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <PiBuildings className="text-xl" />
                                <span className="text-base font-bold">{t("elegant_design")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TbBulb className="text-xl" />
                                <span className="text-base font-bold">{t("modern_technology")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineDesignServices className="text-xl" />
                                <span className="text-base font-bold">{t("smart_architecture")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineWorkspacePremium className="text-xl" />
                                <span className="text-base font-bold">{t("premium_materials")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/5 flex items-center justify-between gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998143/bi1_zoiemo.png" />
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998141/bi2_qymoys.png" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
                    <div className="w-full lg:w-2/5">
                        <h3 className="text-2xl md:text-4xl font-bold">{t("modern_apartment")}</h3>
                        <p className="text-sm md:text-base mt-4 mb-10">
                            {t("modern_apartment_description")}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <MdOutlineLocalLaundryService className="text-xl" />
                                <span className="text-base font-bold">{t("convenient_laundry")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineDeck className="text-xl" />
                                <span className="text-base font-bold">{t("relaxing_terrace")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineBedroomParent className="text-xl" />
                                <span className="text-base font-bold">{t("family_room")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaChargingStation className="text-xl" />
                                <span className="text-base font-bold">{t("charging_station")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/5 flex items-center justify-between gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998162/ml1_kzqoxm.png" />
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998153/ml2_kg5zvn.png" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 my-20">
                    <div className="w-full lg:w-2/5">
                        <h3 className="text-2xl md:text-4xl font-bold">{t("children_play_area")}</h3>
                        <p className="text-sm md:text-base mt-4 mb-10">
                            {t("children_play_area_description")}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <GiTreeSwing className="text-xl" />
                                <span className="text-base font-bold">{t("swing")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <GiUnbalanced className="text-xl" />
                                <span className="text-base font-bold">{t("seesaw")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TbMonkeybar className="text-xl" />
                                <span className="text-base font-bold">{t("slide")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TbHorseToy className="text-xl" />
                                <span className="text-base font-bold">{t("rocking_toy")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/5 flex items-center justify-between gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998142/k1_mhnewb.png" />
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998173/k2_uyjsya.png" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20">
                    <div className="flex justify-center items-center gap-4 p-2 md:p-6 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <BsCarFront className="text-5xl w-1/5" />
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">{t("parking_lot")}</h4>
                            <p className="text-sm">{t("parking_lot_description")}</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaSpa className="text-5xl w-1/5" />
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">{t("spa_massage")}</h4>
                            <p className="text-sm">{t("spa_massage_description")}</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaWifi className="text-5xl w-1/5" />
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">{t("free_wifi")}</h4>
                            <p className="text-sm">{t("free_wifi_description")}</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaStore className="text-5xl w-1/5" />
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">{t("supermarket")}</h4>
                            <p className="text-sm">{t("supermarket_description")}</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaSwimmingPool className="text-5xl w-1/5" />
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">{t("outdoor_pool")}</h4>
                            <p className="text-sm">{t("outdoor_pool_description")}</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <LuCctv className="text-5xl w-1/5" />
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">{t("security_camera")}</h4>
                            <p className="text-sm">{t("security_camera_description")}</p>
                        </div>
                    </div>
                </div>

                <div className="my-20">
                    <h3 className="text-3xl mb-14 md:text-4xl font-bold text-center">{t("price_list")}</h3>
                    <div className="h-[400px]">
                        <DynamicTable headers={headers} data={services} hasActionColumn={false} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
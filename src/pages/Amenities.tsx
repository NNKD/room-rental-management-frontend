import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {PiBuildings, PiLifebuoyFill, PiTowel} from "react-icons/pi";
import {IoFastFoodOutline} from "react-icons/io5";
import {GrHostMaintenance} from "react-icons/gr";
import {BsCarFront} from "react-icons/bs";
import {FaChargingStation, FaSpa, FaStore, FaWifi} from "react-icons/fa6";
import {FaSwimmingPool} from "react-icons/fa";
import {LuCctv} from "react-icons/lu";
import {TbBulb, TbHorseToy, TbMonkeybar} from "react-icons/tb";
import {
    MdOutlineBedroomParent, MdOutlineDeck,
    MdOutlineDesignServices,
    MdOutlineLocalLaundryService,
    MdOutlineWorkspacePremium
} from "react-icons/md";
import {GiTreeSwing, GiUnbalanced} from "react-icons/gi";
import {formatCurrency} from "../utils/NumberCalculate.ts";
import {ServiceType, TableHeader} from "../types/Dashboard.ts";
import DynamicTable from "../components/DynamicTable.tsx";
import {useEffect, useState} from "react";
import {NoticeType} from "../types/Context.ts";
import {useNotice} from "../hook/useNotice.ts";
import axios from "axios";
import {envVar} from "../utils/EnvironmentVariables.ts";

export default function Amenities() {
    const [services, setServices] = useState<ServiceType[]>([])
    const {setMessage, setType} = useNotice()

    const headers: TableHeader<ServiceType>[] = [
        {name: 'STT', slug: 'id', width: 5, center: true},
        {name: 'Dịch vụ', slug: 'name', width: 10, center: true},
        {name: 'Mô tả', slug: 'description', width: 20, center: true},
        {name: 'Giá (VNĐ)', slug: 'price', width: 10, center: true},
        {name: 'Đơn vị tính', slug: 'unit', width: 10, center: true},
    ]

    useEffect(() => {
        handleGetServices()
    }, []);

    useEffect(() => {
        console.log(services)
    }, [services]);

    const handleGetServices = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/services`)

            if (response.status === 200 && response.data.status == "success" && response.data.statusCode == 200) {
                const serviceNormalizePrice = response.data.data.map((service: ServiceType) => ({
                    ...service,
                    price: formatCurrency(Number(service.price)),
                }));
                setServices(serviceNormalizePrice)
            }

        }catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }



    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <div className="flex-grow mx-auto my-10 px-6 md:px-12 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
                    <div className="w-full lg:w-2/5">
                        <h3 className="text-2xl md:text-4xl font-bold">Hồ Bơi</h3>
                        <p className="text-sm md:text-base mt-4 mb-10">Thư giãn tại hồ bơi sạch sẽ, được bảo trì thường xuyên. Cư dân có thể tận hưởng những giờ phút thư giãn thoải mái giữa không gian trong lành và tiện nghi.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 items-center gap-8">
                            <div className="flex items-center gap-3">
                                <PiTowel className="text-xl"/>
                                <span className="text-base font-bold">Khăn tắm mỗi ngày</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <IoFastFoodOutline className="text-xl"/>
                                <span className="text-base font-bold">Đồ ăn nhẹ</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <PiLifebuoyFill className="text-xl"/>
                                <span className="text-base font-bold">Cứu hộ túc trực</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <GrHostMaintenance className="text-xl"/>
                                <span className="text-base font-bold">Bảo trì định kỳ</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-3/5 flex items-center justify-between gap-4">
                        <div>
                            <img src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//sp1.png"/>
                        </div>
                        <div>
                            <img src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//sp2.png"/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 my-20">
                    <div className="w-full lg:w-2/5">
                        <h3 className="text-2xl md:text-4xl font-bold">Nội Thất Cao Cấp</h3>
                        <p className="text-sm md:text-base mt-4 mb-10">Căn hộ được thiết kế với nội thất hiện đại, tinh tế đến từng chi tiết, mang đến không gian sống sang trọng và tiện nghi vượt trội.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <PiBuildings className="text-xl"/>
                                <span className="text-base font-bold">Thiết kế thanh lịch</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TbBulb className="text-xl"/>
                                <span className="text-base font-bold">Công nghệ hiện đại</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineDesignServices  className="text-xl"/>
                                <span className="text-base font-bold">Kiến trúc thông minh</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineWorkspacePremium className="text-xl"/>
                                <span className="text-base font-bold">Vật liệu cao cấp</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/5 flex items-center justify-between gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998143/bi1_zoiemo.png"/>
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998141/bi2_qymoys.png"/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
                    <div className="w-full lg:w-2/5">
                        <h3 className="text-2xl md:text-4xl font-bold">Căn Hộ Hiện Đại</h3>
                        <p className="text-sm md:text-base mt-4 mb-10">Thiết kế theo phong cách hiện đại với không gian mở, trần cao và ánh sáng tự nhiên, mang lại cảm giác rộng rãi và năng động cho cuộc sống.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <MdOutlineLocalLaundryService className="text-xl"/>
                                <span className="text-base font-bold">Phòng giặt tiện lợi</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineDeck className="text-xl"/>
                                <span className="text-base font-bold">Sân thượng thư giãn</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlineBedroomParent className="text-xl"/>
                                <span className="text-base font-bold">Phòng gia đình</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaChargingStation className="text-xl"/>
                                <span className="text-base font-bold">Trạm sạc thiết bị</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/5 flex items-center justify-between gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998162/ml1_kzqoxm.png"/>
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998153/ml2_kg5zvn.png"/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 my-20">
                    <div className="w-full lg:w-2/5">
                        <h3 className="text-2xl md:text-4xl font-bold">Khu Vui Chơi Trẻ Em</h3>
                        <p className="text-sm md:text-base mt-4 mb-10">Không gian lý tưởng để trẻ em phát triển và vui chơi an toàn với các trò chơi vận động và sáng tạo.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-8">
                            <div className="flex items-center gap-3">
                                <GiTreeSwing className="text-xl"/>
                                <span className="text-base font-bold">Xích đu</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <GiUnbalanced className="text-xl"/>
                                <span className="text-base font-bold">Bập bênh</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TbMonkeybar className="text-xl"/>
                                <span className="text-base font-bold">Cầu trượt</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TbHorseToy className="text-xl"/>
                                <span className="text-base font-bold">Thú nhún</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/5 flex items-center justify-between gap-4">
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998142/k1_mhnewb.png"/>
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/dtahzcvaf/image/upload/f_webp/v1745998173/k2_uyjsya.png"/>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20">

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <BsCarFront className="text-5xl w-1/5"/>
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">Bãi đỗ xe</h4>
                            <p className="text-sm">Khu vực đỗ xe rộng rãi an toàn và thuận tiện cho cư dân và khách hàng.</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaSpa className="text-5xl w-1/5"/>
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">Spa & Massage</h4>
                            <p className="text-sm">Thư giãn và tái tạo năng lượng với liệu trình chăm sóc sức khỏe chuyên nghiệp.</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaWifi className="text-5xl w-1/5"/>
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">Wifi miễn phí</h4>
                            <p className="text-sm">Kết nối internet nhanh chóng và ổn định, miễn phí cho cư dân và khách hàng.</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaStore  className="text-5xl w-1/5"/>
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">Siêu thị</h4>
                            <p className="text-sm">Siêu thị tiện lợi, cung cấp đầy đủ hàng hóa cho cư dân và khách hàng.</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <FaSwimmingPool  className="text-5xl w-1/5"/>
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">Hồ bơi ngoài trời</h4>
                            <p className="text-sm">Thư giãn và bơi lội tại hồ bơi ngoài trời rộng rãi, thoáng mát.</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 p-2 md:p-6
                                 hover:cursor-pointer hover:shadow-[0_0_4px_3px_#ccc] transition-all duration-300 ease-in-out">
                        <LuCctv  className="text-5xl w-1/5"/>
                        <div className="w-4/5">
                            <h4 className="text-xl font-bold mb-2 capitalize">Camera an ninh</h4>
                            <p className="text-sm">Hệ thống camera an ninh 24/7, đảm bảo an toàn cho cư dân và khách hàng.</p>
                        </div>
                    </div>

                </div>

                <div className="my-20">
                    <h3 className="text-3xl mb-14 md:text-4xl font-bold text-center">Bảng giá</h3>
                    <div className="h-[400px]">
                        <DynamicTable headers={headers} data={services} hasActionColumn={false}/>
                    </div>

                </div>

            </div>

            <Footer/>
        </div>
    )
}
import {useParams} from "react-router-dom";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {FiPhone} from "react-icons/fi";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {useEffect, useState} from "react";
import {RiCustomSize} from "react-icons/ri";
import {CiLocationOn} from "react-icons/ci";
import {FaHome} from "react-icons/fa";
import axios from "axios";
import {envVar} from "../utils/EnvironmentVariables.ts";
import {ApartmentDetailType} from "../types/Apartment.ts";
import {calPriceDiscount, formatCurrency} from "../utils/NumberCalculate.ts";
import GoTop from "../components/GoTop.tsx";
import {useNotice} from "../hook/useNotice.ts";
import {NoticeType} from "../types/Context.ts";
import SkeletonApartmentDetail from "../components/skeleton-loading/SkeletonApartmentDetail.tsx";

export default function ApartmentDetail() {
    const {slug} = useParams();
    const [indexCarousel, setIndexCarousel] = useState(0)
    const [apartmentDetail, setApartmentDetail] = useState<ApartmentDetailType>()
    const [currentImg, setCurrentImg] = useState("")
    const [durationMonth, setDurationMonth] = useState("1")
    const [visibleAmount, setVisibleAmount] = useState(3)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [messageForm, setMessageForm] = useState("")
    const {setMessage, setType} = useNotice()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        handleGetApartmentDetail()
    }, [slug]);

    useEffect(() => {
        if (apartmentDetail) {
            setLoading(false);
        }

        if (apartmentDetail?.images) {
            setCurrentImg(apartmentDetail.images[0].url);
        }
    }, [apartmentDetail]);

    useEffect(() => {
        window.addEventListener("resize", handleGetAmount);
        handleGetAmount()
        return () => {
            window.removeEventListener("resize", handleGetAmount);
        }
    }, []);

    const handleGetAmount = () => {
        // Mobile => show 1
        if (window.innerWidth < 760) {
            setVisibleAmount(1)
        }else if (window.innerWidth < 1024) { // tablet => show 2
            setVisibleAmount(2)
        }else { // desktop => show 3
            setVisibleAmount(3)
        }
    }

    const handleGetApartmentDetail = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/apartments/${slug}`);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                setApartmentDetail(response.data.data);
            }

        }catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }

    /*
     handle back or forward carousel
     type = 1 ==> Forward
     type = -1 ==> Back
     */

    const handleCarousel = (type: number) => {
        if (type === 1) {
            // Max = length - visible. nếu nó lớn hơn thì next tiếp sẽ thiếu element
            setIndexCarousel(Math.min(indexCarousel + 1, (apartmentDetail?.images.length || 0) - visibleAmount))
        }else if (type === -1) {
            // Min = 0 (vị trí đầu)
            setIndexCarousel(Math.max(0, indexCarousel - 1))
        }
    }

    const handleSubmitForm = async () => {
        try {
            const response = await axios.post(`${envVar.API_URL}/apartments/${slug}/form`, {
                slug: slug,
                name: username,
                email: email,
                message: messageForm,
            })

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                setType(NoticeType.SUCCESS)
                setMessage("Gửi thành công")
            }

        }catch (error) {
            console.log(error)
            setType(NoticeType.ERROR)
            setMessage("Đã có lỗi xảy ra: "+ error)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            {loading ? (
                <SkeletonApartmentDetail/>
            ) : (
                <div className="flex-grow p-8 md:p-12">
                    <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl">{apartmentDetail?.name} - {apartmentDetail?.brief}</h2>
                    <div className="flex flex-col lg:flex-row gap-10 mt-6">
                        <div className="lg:w-[70%]">
                            <div className="aspect-[16/9] overflow-hidden rounded select-none">
                                <img src={apartmentDetail?.images.find(img => img.url == currentImg)?.url} className="w-full h-full object-cover rounded"/>
                            </div>
                            <div className="mt-4 mb-8 flex items-center justify-center gap-3 select-none">
                                <div className={`w-[40px] h-[40px] md:w-[56px] md:h-[56px] flex items-center justify-center rounded-full flex-shrink-0 text-white
                                            ${indexCarousel == 0 ? "bg-lightBlue pointer-events-none" : " bg-lightGreen cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"}`}
                                     onClick={() => handleCarousel(-1)}>
                                    <IoIosArrowBack className="w-[24px] h-[24px]"/>
                                </div>

                                {apartmentDetail?.images.slice(indexCarousel, indexCarousel + visibleAmount).map((image, index) => (
                                    <div key={index} className="aspect-[16/9] w-[20%] overflow-hidden rounded cursor-pointer" onClick={() => setCurrentImg(image.url)}>
                                        <img src={image.url}  className="w-full h-full object-cover rounded"/>
                                    </div>
                                ))}


                                <div className={`w-[40px] h-[40px] md:w-[56px] md:h-[56px] flex items-center justify-center text-white  rounded-full flex-shrink-0
                                            ${indexCarousel == Math.max(0, (apartmentDetail?.images.length || 0) - visibleAmount) ? "bg-lightBlue pointer-events-none" : " bg-lightGreen cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"}`}
                                     onClick={() => handleCarousel(1)}>
                                    <IoIosArrowForward className="w-[24px] h-[24px]"/>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 md:flex-row justify-around">
                                <div className="flex gap-2 items-center">
                                    <FaHome className="text-5xl text-lightGreen"/>
                                    <span className="font-bold text-xl">{apartmentDetail?.type}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <RiCustomSize className="text-5xl text-lightGreen"/>
                                    <span className="font-bold text-xl">{(apartmentDetail?.width || 0) * (apartmentDetail?.height || 0)} m<sup>2</sup></span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <CiLocationOn  className="text-5xl text-lightGreen"/>
                                    <span className="font-bold text-xl">Tầng {apartmentDetail?.floor}</span>
                                </div>
                            </div>

                            <div className="md:px-16 mx-auto">
                                <div className="my-8 bg-lightBlue flex flex-col md:flex-row gap-10 items-center justify-between p-4 md:px-6 md:py-8 rounded">
                                    <div className="bg-lightGreen text-center w-fit font-bold rounded px-8 md:px-12 py-3">
                                        <p className="text-xl text-white">Thời hạn thuê</p>
                                        <div className="border-2 border-white mt-4 p-2 rounded">
                                            <select className="outline-none bg-transparent pr-2 text-white w-fit select-none cursor-pointer" onChange={(e) => setDurationMonth(e.target.value)}>

                                                {apartmentDetail?.discounts.map((ad, index) => (
                                                    <option key={index} value={ad.duration_month} className="text-black">{
                                                        ad.duration_month} tháng
                                                    </option>
                                                ))}

                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-base">Giá mỗi tháng:</span>
                                        <span className="text-xl font-bold text-lightGreen">
                                        {formatCurrency(calPriceDiscount(apartmentDetail?.price || 0, apartmentDetail?.discounts.find(ad => ad.duration_month == Number(durationMonth))?.discount_percent || 0))}
                                            / tháng
                                    </span>
                                    </div>
                                </div>

                                <div className="my-10">
                                    <h2 className="mb-4 font-bold text-xl">Thông tin cơ bản:</h2>
                                    <ul className="list-disc pl-6">
                                        <li>Số phòng ngủ: {apartmentDetail?.bedrooms}</li>
                                        <li>Tầng: {apartmentDetail?.floor}</li>
                                        <li>Diện tích: {(apartmentDetail?.width || 0) * (apartmentDetail?.height || 0)} m<sup>2</sup></li>
                                        {
                                            (apartmentDetail?.balcony || 0) > 0 ? (
                                                <li>Diện tích ban công: {apartmentDetail?.balcony} m<sup>2</sup></li>
                                            ) : ""
                                        }
                                    </ul>
                                </div>

                                <div >
                                    <h2 className="font-bold text-xl">Mô tả:</h2>

                                    <p className="my-4">
                                        {apartmentDetail?.brief}
                                    </p>

                                    <p className="my-4">
                                        {apartmentDetail?.description}
                                    </p>

                                </div>

                            </div>


                        </div>
                        <div className="lg:w-[30%]">
                            <div className="p-4 md:p-10 rounded bg-lightBlue">
                                <h2 className="font-bold text-xl">Liên hệ với chúng tôi</h2>
                                <div className="flex items-center my-2 gap-2">
                                    <img
                                        src="https://ipzhywqybsdvoshfxaij.supabase.co/storage/v1/object/public/images//test.webp"
                                        className="w-[50px] h-[50px] rounded-full" alt="avatar"/>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-base">Green Home</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <FiPhone />
                                            <span className="underline text-base">+84 28 1234 5678</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-1 text-base">Họ tên</p>
                                    <input type="text" placeholder="Họ tên" value={username}
                                           onChange={(e) => setUsername(e.target.value)}
                                           className="p-2 w-full text-base outline-none border border-darkGray rounded"/>
                                </div>

                                <div className="my-4">
                                    <p className="mb-1 text-base">Email</p>
                                    <input type="email" value={email} placeholder="Email"
                                           onChange={(e) => setEmail(e.target.value)}
                                           className="p-2 w-full text-base outline-none border border-darkGray rounded required"/>
                                </div>

                                <div>
                                    <p className="mb-1 text-base">Lời nhắn</p>
                                    <textarea placeholder="Lời nhắn" rows={10} value={messageForm}
                                              onChange={(e) => setMessageForm(e.target.value)}
                                              className="p-2 w-full text-base resize-none outline-none border border-darkGray rounded">

                                </textarea>
                                </div>
                                <div className="border-lightGreen p-2 text-center text-base border-2 font-bold text-lightGreen rounded mt-4 cursor-pointer hover:bg-lightGreen hover:text-white duration-300 transition-all ease-in-out"
                                     onClick={() => handleSubmitForm()}>
                                    Gửi lời nhắn
                                </div>
                            </div>
                            <div className="p-4 md:p-10 rounded mt-10 bg-lightBlue">
                                <div className="flex flex-col gap-4">
                                    <h2 className="font-bold text-xl">Thông tin căn hộ</h2>
                                    <div>
                                        <span className="text-base font-bold">Tầng: </span>
                                        <span>{apartmentDetail?.floor}</span>
                                    </div>
                                    <div>
                                        <span className="text-base font-bold">Số phòng ngủ: </span>
                                        <span>{apartmentDetail?.bedrooms}</span>
                                    </div>
                                    <div>
                                        <span className="text-base font-bold">Số nhà bếp: </span>
                                        <span>{apartmentDetail?.kitchens}</span>
                                    </div>
                                    <div>
                                        <span className="text-base font-bold">Số nhà vệ sinh: </span>
                                        <span>{apartmentDetail?.bathrooms}</span>
                                    </div>
                                    <div>
                                        <span className="text-base font-bold">Diện tích: </span>
                                        <span>{(apartmentDetail?.width || 0) * (apartmentDetail?.height || 0)} m<sup>2</sup></span>
                                    </div>

                                    <div>
                                        <span className="text-base font-bold">Ban công: </span>
                                        <span>{(apartmentDetail?.balcony || 0) > 0 ? "Có" : "Không"}</span>
                                    </div>

                                    {
                                        (apartmentDetail?.balcony || 0) > 0 ? (
                                            <div>
                                                <span className="text-base font-bold">Diện tích ban công: </span>
                                                <span>{apartmentDetail?.balcony} m<sup>2</sup></span>
                                            </div>
                                        ) : ""
                                    }

                                    <div>
                                        <span className="text-base font-bold">Sân thượng riêng: </span>
                                        <span>{(apartmentDetail?.terrace || 0) > 0 ? "Có" : "Không"}</span>
                                    </div>

                                    {
                                        (apartmentDetail?.terrace || 0) > 0 ? (
                                            <div>
                                                <span className="text-base font-bold">Diện tích sân thượng: </span>
                                                <span>{apartmentDetail?.terrace} m<sup>2</sup></span>
                                            </div>
                                        ) : ""
                                    }

                                    <div>
                                        <span className="text-base font-bold">Nội thất: </span>
                                        <span>{apartmentDetail?.furniture}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            <GoTop/>


            <Footer/>
        </div>
    )
}
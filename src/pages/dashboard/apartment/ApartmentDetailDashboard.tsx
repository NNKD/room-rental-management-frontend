import {IoIosArrowBack, IoIosArrowForward, IoMdArrowBack} from "react-icons/io";
import {Link, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import ModalZoomImage from "../../../components/modal/ModalZoomImage.tsx";
import {IoCloseCircle} from "react-icons/io5";
import axios from "axios";
import {envVar} from "../../../utils/EnvironmentVariables.ts";
import {ApartmentDTO, ApartmentImageDTO, ApartmentStatusDTO, ApartmentTypeDTO} from "../../../types/Dashboard.ts";
import {NoticeType} from "../../../types/Context.ts";
import {useNotice} from "../../../hook/useNotice.ts";
import {calPriceDiscount, formatCurrency} from "../../../utils/NumberCalculate.ts";
import UploadWidget from "../../../components/UploadWidget.tsx"
import LoadingPage from "../../../components/LoadingPage.tsx";

export default function ApartmentDetailDashboard() {
    const {slug} = useParams();
    const [indexCarousel, setIndexCarousel] = useState(0)
    const [statuses, setStatuses] = useState<ApartmentStatusDTO[]>([])
    const [imagesDeleteCloudinary, setImagesDeleteCloudinary] = useState<ApartmentImageDTO[]>([])
    const [types, setTypes] = useState<ApartmentTypeDTO[]>([])
    const [visibleAmount, setVisibleAmount] = useState(3)
    const [mode, setMode] = useState("read")
    const [imageZoom, setImageZoom] = useState("")
    const inputNameRef = useRef<HTMLInputElement|null>(null);
    const {setMessage, setType} = useNotice()
    const [durationMonth, setDurationMonth] = useState(1)
    const [loading, setLoading] = useState(false)

    const defaultApartmentDetail: ApartmentDTO = {
        name: "",
        slug: "",
        brief: "",
        hot: 0,
        price: 0,
        description: "",
        type: { id: 0, name: "", description: "" },
        status: { id: 0, name: "" },
        discounts: [
            {discount_percent: 0, duration_month: 1},
            {discount_percent: 0, duration_month: 3},
            {discount_percent: 0, duration_month: 6},
            {discount_percent: 0, duration_month: 9}
        ],
        images: [],
        information: {
            id: 0,
            width: 0,
            height: 0,
            floor: 0,
            balcony: 0,
            terrace: 0,
            furniture: "",
            bedrooms: 0,
            kitchens: 0,
            bathrooms: 0
        },
    };

    const [apartmentDetail, setApartmentDetail] = useState<ApartmentDTO>(defaultApartmentDetail)


    useEffect(() => {
        window.addEventListener("resize", handleGetAmount);
        handleGetAmount()
        return () => {
            window.removeEventListener("resize", handleGetAmount);
        }
    }, []);

    useEffect(() => {
        if (mode === "update") {
            if (inputNameRef.current) {
                inputNameRef.current.focus();
            }
        }
    }, [mode]);

    useEffect(() => {
        if (slug == "add") {
            setMode("add")
        }else {
            handleGetDetail()
        }
        handleGetAllType()
        handleGetAllStatus()
    }, [slug]);

    const handleGetDetail = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/apartments/${slug}`);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                console.log(response.data.data)
                setApartmentDetail(response.data.data)
            }

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }
    const handleGetAllType = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/types`);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                console.log(response.data.data)
                setTypes(response.data.data)
            }

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }

    const handleGetAllStatus = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/statuses`);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                console.log(response.data.data)
                setStatuses(response.data.data)
            }

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }

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

    useEffect(() => {
        console.log(apartmentDetail)
    }, [apartmentDetail]);

    const handleChangeField = (field: string, value: unknown) => {
        setApartmentDetail(prev => {
            return {
                ...prev,
                [field]: value
            }
        });
    }

    const handleChangeFieldInformation = (field: string, value: unknown) => {
        setApartmentDetail(prev => {
            return {
                ...prev,
                information: {
                    ...prev.information,
                    [field]: value
                }
            }
        })
    }

    const handleChangeFieldDiscount = (value: unknown) => {
        setApartmentDetail(prev => {
            return {
                ...prev,
                discounts: prev.discounts.map(d => {
                    if (d.duration_month == durationMonth) {
                        return {
                            ...d,
                            discount_percent: Number(value)
                        }
                    }else {
                        return d;
                    }
                })
            }
        })
    }

    const handleUploadImg = (url: string) => {
        setApartmentDetail(prev => {
            return {
                ...prev,
                images: [...prev.images, {url: url}]
            }
        })
    }

    const handleDeleteImg = (url: string) => {
        setApartmentDetail(prev => {
            return {
                ...prev,
                images: prev.images.filter(i => i.url != url)
            }
        })
        const deleteImgList = [...imagesDeleteCloudinary, {url: url}];
        setImagesDeleteCloudinary(deleteImgList);
    }

    const handleAddOrUpdateApartment = async () => {
        try {
            const response = await axios.post(`${envVar.API_URL}/dashboard/apartments`, {
                apartment: apartmentDetail
            });

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                setLoading(false)
                console.log(response.data.data)
                setType(NoticeType.SUCCESS)
                setMessage(response.data.data)
            }

        } catch (error) {
            setLoading(false)
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }

    const handleDeleteImgOnCloudinary = async () => {
        try {
            const response = await axios.post(`${envVar.API_URL}/cloudinary/delete-images`, {
                images: imagesDeleteCloudinary
            });

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                console.log(response.data.data)
                setType(NoticeType.SUCCESS);
                setMessage(response.data.data)
            }

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }

    const handleSave = () => {
        setLoading(true)
        handleAddOrUpdateApartment()
        handleDeleteImgOnCloudinary()
    }

    return (
        <div className="overflow-auto h-fit max-h-full w-full rounded shadow-[0_0_3px_2px_#ccc]">
            <div className="bg-white rounded">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <Link to="/dashboard/apartment-management" className="block p-2 cursor-pointer -ml-2">
                            <IoMdArrowBack className="text-2xl"/>
                        </Link>

                        {mode != "add" ? (
                            <div className="flex border-2 border-zinc-300 select-none">
                                <div className={`px-4 py-2 text-base ${mode == "read" ? "bg-lightGreen pointer-events-none" : "bg-zinc-300 hover:bg-lightGreenHover hover:cursor-pointer transition-all duration-300 ease-in-out"}`}
                                     onClick={() => {handleSave(); setMode("read")}}>
                                    Xem
                                </div>
                                <div className={`px-4 py-2 text-base ${mode == "update" ? "bg-lightGreen pointer-events-none" : "bg-zinc-300 hover:bg-lightGreenHover hover:cursor-pointer transition-all duration-300 ease-in-out"}`}
                                     onClick={() => {handleSave(); setMode("update")}}>
                                    Sửa
                                </div>
                            </div>
                        ) : ""}

                    </div>
                    <div className="flex flex-col gap-8">
                        <h1 className="text-left text-xl font-bold underline">Thông tin cơ bản:</h1>
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                            <div className="flex items-center border p-2 rounded w-full lg:w-3/5">
                                <label className="flex-shrink-0 text-sm font-medium">Căn hộ:</label>
                                <input className="w-full outline-none border-none px-2 py-1" value={apartmentDetail?.name} disabled={mode === "read"} ref={inputNameRef}
                                       onChange={(e) => handleChangeField("name", e.target.value)} />
                            </div>
                            <div className="flex items-center border p-2 rounded w-full lg:w-2/5">
                                <label className="flex-shrink-0 text-sm font-medium">Tên Slug:</label>
                                <input className="w-full outline-none border-none px-2 py-1" value={apartmentDetail?.slug} disabled={mode === "read"}
                                    onChange={(e) => handleChangeField("slug", e.target.value)} />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">

                            <div className="flex items-center justify-between border p-2 rounded w-full">
                                <label className="flex-shrink-0 text-sm font-medium">Trạng thái:</label>

                                <select className="px-2 py-1 border-2 rounded" disabled={mode === "read"}
                                        value={apartmentDetail?.status?.id || ""}
                                        onChange={(e) => handleChangeField("status", {id: e.target.value})}>

                                    {statuses.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}

                                </select>

                            </div>
                            <div className="flex items-center justify-between border p-2 rounded w-full">
                                <label className="flex-shrink-0 text-sm font-medium">Loại căn hộ:</label>
                                <select className="px-2 py-1 border-2 rounded" disabled={mode === "read"}
                                        value={apartmentDetail?.type?.id || ""}
                                        onChange={(e) => handleChangeField("type", {id: e.target.value})}>

                                    {types.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}

                                </select>
                            </div>

                        </div>

                        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                            <div className="flex items-center justify-between border p-2 rounded w-full lg:w-1/3">
                                <label className="flex-shrink-0 text-sm font-medium">Căn hộ hot:</label>
                                <select className="px-2 py-1 border-2 rounded" disabled={mode === "read"}
                                        value={apartmentDetail?.hot || ""}
                                        onChange={(e) => handleChangeField("hot", e.target.value)}>
                                    <option value="1">Hot</option>
                                    <option value="0">Bình thường</option>
                                </select>
                            </div>

                            <div className="flex items-center border p-2 rounded w-full lg:w-[12%]">
                                <label className="flex-shrink-0 text-sm font-medium">Tầng:</label>
                                <input className="w-full outline-none border-none px-2 py-1 text-right" type="number" value={apartmentDetail?.information.floor} disabled={mode === "read"}
                                    onChange={(e) => handleChangeFieldInformation("floor", e.target.value)}/>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                            <div className="flex items-center border p-2 rounded flex-grow w-full lg:w-2/5">
                                <label className="flex-shrink-0 text-sm font-medium">Nội thất:</label>
                                <input className="w-full outline-none border-none px-2 py-1 text-right" value={apartmentDetail?.information.furniture} disabled={mode === "read"}
                                       onChange={(e) => handleChangeFieldInformation("furniture", e.target.value)}/>
                            </div>

                            <div className="flex items-center border p-2 rounded w-full lg:w-3/5">
                                <label className="flex-shrink-0 text-sm font-medium">Giá tiền thuê gốc (1 tháng):</label>
                                <div className="w-full">
                                    <input className="w-full outline-none border-none px-2 py-1 text-right" type="number" value={apartmentDetail?.price} disabled={mode === "read"}
                                            onChange={(e) => handleChangeField("price", e.target.value)} />
                                    <p className="text-base text-right">{formatCurrency(apartmentDetail?.price || 0)}</p>
                                </div>
                            </div>
                        </div>

                        {mode == "read" ? (
                            <div>
                                <h1 className="text-left text-xl font-bold underline">Người thuê: </h1>
                                <p className="text-base text-left mt-6">Chưa có người thuê</p>
                            </div>
                        ) : ""}



                        <h1 className="text-left text-xl font-bold underline">Thông số:</h1>
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                            <div className="flex items-center justify-between border p-2 rounded w-full lg:w-1/4">
                                <label className="flex-shrink-0 text-sm font-medium">Chiều dài:</label>
                                <input className="w-full outline-none border-none px-2 py-1 text-right" type="number"
                                       value={apartmentDetail?.information.height} disabled={mode === "read"}
                                       onChange={(e) => handleChangeFieldInformation("height", e.target.value)}/>
                            </div>
                            <div className="flex items-center justify-between border p-2 rounded w-full lg:w-1/4">
                                <label className="flex-shrink-0 text-sm font-medium">Chiều rộng:</label>
                                <input className="w-full outline-none border-none px-2 py-1 text-right" type="number"
                                       value={apartmentDetail?.information.width} disabled={mode === "read"}
                                       onChange={(e) => handleChangeFieldInformation("width", e.target.value)}/>
                            </div>
                            <div className="flex items-center justify-between border p-2 rounded w-full lg:w-1/4">
                                <label className="flex-shrink-0 text-sm font-medium">Ban công (m<sup>2</sup>):</label>
                                <input className="w-full outline-none border-none px-2 py-1 text-right" type="number"
                                       value={apartmentDetail?.information.balcony} disabled={mode === "read"}
                                       onChange={(e) => handleChangeFieldInformation("balcony", e.target.value)}/>
                            </div>
                            <div className="flex items-center justify-between border p-2 rounded w-full lg:w-1/4">
                                <label className="flex-shrink-0 text-sm font-medium">Sân thượng (m<sup>2</sup>):</label>
                                <input className="w-full outline-none border-none px-2 py-1 text-right" type="number"
                                       value={apartmentDetail?.information.terrace} disabled={mode === "read"}
                                       onChange={(e) => handleChangeFieldInformation("terrace", e.target.value)}/>
                            </div>
                        </div>

                        <h1 className="text-left text-xl font-bold underline">Giá thuê theo từng thời hạn:</h1>
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="flex items-center justify-between border p-2 rounded w-full lg:w-1/4">
                                <label className="flex-shrink-0 text-sm font-medium">Thời hạn:</label>
                                <select className="px-2 py-1 border-2 rounded" onChange={(e) => setDurationMonth(Number(e.target.value))}>
                                    <option value="1">1 tháng</option>
                                    <option value="3">3 tháng</option>
                                    <option value="6">6 tháng</option>
                                    <option value="12">12 tháng</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between border p-2 rounded w-full lg:w-1/5">
                                <label className="flex-shrink-0 text-sm font-medium">Giảm giá (%):</label>
                                <input className="w-full outline-none border-none px-2 py-1 text-right" type="number"
                                       value={Array.isArray(apartmentDetail?.discounts)
                                           ? apartmentDetail?.discounts.find(d => d.duration_month === durationMonth)?.discount_percent ?? 0
                                           : 0} disabled={mode === "read"}
                                       onChange={(e) => handleChangeFieldDiscount(e.target.value)}/>
                            </div>
                            <div className="flex items-center justify-between border p-2 rounded w-full lg:w-1/2">
                                <label className="flex-shrink-0 text-sm font-medium">Giá tiền (VNĐ):</label>
                                <input className="w-full outline-none border-none px-2 py-1 text-right" readOnly={true}
                                value={formatCurrency(calPriceDiscount(apartmentDetail?.price || 0, apartmentDetail?.discounts.find(d => d.duration_month == durationMonth)?.discount_percent || 0))}/>
                            </div>
                        </div>

                        <h1 className="text-left text-xl font-bold underline">Mô tả ngắn:</h1>
                        <textarea className="resize-none w-full h-full border rounded p-2" disabled={mode === "read"} value={apartmentDetail?.brief}
                                  onChange={(e) => handleChangeField("brief", e.target.value)}></textarea>

                        <h1 className="text-left text-xl font-bold underline">Mô tả chi tiết:</h1>
                        <textarea rows={6} className="resize-none w-full h-full border rounded p-2" disabled={mode === "read"} value={apartmentDetail?.description}
                                  onChange={(e) => handleChangeField("description", e.target.value)}></textarea>

                        <h1 className="text-left text-xl font-bold underline">Hình ảnh:</h1>

                        {
                            mode === "add" ? (
                                <UploadWidget onGetImgUrl={handleUploadImg}/>
                            ) : ""
                        }

                        {
                            (apartmentDetail?.images.length || 0) > 0 ? (
                                <div className="flex items-center justify-around gap-6 select-none">
                                    <div className={`w-[30px] h-[30px] md:w-[46px] md:h-[46px] flex items-center justify-center rounded-full flex-shrink-0 text-white
                                            ${indexCarousel == 0 ? "bg-lightBlue pointer-events-none" : " bg-lightGreen cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"}`}
                                         onClick={() => handleCarousel(-1)}>
                                        <IoIosArrowBack className="w-[24px] h-[24px]"/>
                                    </div>

                                    {apartmentDetail?.images.slice(indexCarousel, indexCarousel + visibleAmount).map((img, index) => (
                                        <div className="w-full h-full relative" key={index}>
                                            <div className="aspect-[16/9] flex-grow overflow-hidden rounded cursor-pointer" onClick={() => setImageZoom(img.url)}>
                                                <img src={img.url}  className="w-full h-full object-cover rounded"/>
                                            </div>

                                            {mode != "read" ? (
                                                <div className="absolute -top-4 -right-4 p-1 hover:cursor-pointer"
                                                     onClick={() => handleDeleteImg(img.url)}>
                                                    <IoCloseCircle className="text-3xl text-red-500"/>
                                                </div>
                                            ) : ""}

                                        </div>
                                    ))}

                                    <div className={`w-[30px] h-[30px] md:w-[46px] md:h-[46px] flex items-center justify-center text-white  rounded-full flex-shrink-0
                                            ${indexCarousel == Math.max(0, (apartmentDetail?.images.length || 0) - visibleAmount) ? "bg-lightBlue pointer-events-none" : " bg-lightGreen cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"}`}
                                         onClick={() => handleCarousel(1)}>
                                        <IoIosArrowForward className="w-[24px] h-[24px]"/>
                                    </div>

                                </div>
                            ) : ""
                        }

                        {mode != "read" ? (
                            <div className="mx-auto bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                                onClick={() => handleSave()}>
                                Lưu
                            </div>
                        ) : ""}


                    </div>

                </div>
            </div>

            {imageZoom != "" ? (
                <ModalZoomImage image={imageZoom} setImage={setImageZoom} />
            ) : ""}

            {loading ? (
                <LoadingPage/>
            ) : ""}

        </div>
    )
}
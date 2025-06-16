import { IoIosArrowBack, IoIosArrowForward, IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ModalZoomImage from "../../../../components/modal/ModalZoomImage.tsx";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../../types/Context.ts";
import { useNotice } from "../../../../hook/useNotice.ts";
import { getToken } from "../../../../utils/TokenUtils.ts";
import { ApartmentDetailDashboardType } from "../../../../types/Dashboard.ts";
import { formatCurrency } from "../../../../utils/NumberCalculate.ts";

// Interface cho dịch vụ, cập nhật price thành string
interface Service {
    name: string;
    price: string; // Đổi từ number thành string để khớp với formatCurrency
    unit: string;
}

const ApartmentDetailDashboard = () => {
    const { slug } = useParams<{ slug: string }>();
    const { setMessage, setType } = useNotice();
    const [apartment, setApartment] = useState<ApartmentDetailDashboardType | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const token = getToken();
    const imageRef = useRef<HTMLDivElement>(null);

    const handleGetApartment = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/apartments/${slug}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                const data = response.data.data;
                setApartment({
                    ...data,
                    price: formatCurrency(data.price),
                    services: data.services.map((service: { name: string; price: number; unit: string }) => ({
                        name: service.name,
                        price: formatCurrency(service.price), // Giữ formatCurrency
                        unit: service.unit,
                    })),
                });
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Không thể lấy thông tin căn hộ");
            setType(NoticeType.ERROR);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetApartment();
    }, [handleGetApartment]);

    const handlePrevImage = () => {
        setImageIndex((prev) => (prev === 0 ? (apartment?.images.length ?? 0) - 1 : prev - 1));
        setSelectedImage(apartment?.images[imageIndex] || "");
    };

    const handleNextImage = () => {
        setImageIndex((prev) => (prev === (apartment?.images.length ?? 0) - 1 ? 0 : prev + 1));
        setSelectedImage(apartment?.images[imageIndex] || "");
    };

    const handleClickImage = () => {
        setSelectedImage(apartment?.images[imageIndex] || "");
        setShowModal(true);
    };

    const scrollToImage = (index: number) => {
        setImageIndex(index);
        if (imageRef.current) {
            const img = imageRef.current.children[index] as HTMLImageElement;
            img.scrollIntoView({ behavior: "smooth", inline: "center" });
        }
    };

    if (loading || !apartment) {
        return <div className="flex justify-center items-center h-full">Đang tải...</div>;
    }

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <Link to="/dashboard/apartment-management" className="flex items-center gap-2 mb-4 text-blue-500">
                <IoMdArrowBack />
                Quay lại
            </Link>
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="lg:w-1/2">
                    <div className="relative">
                        <img
                            src={apartment.images[imageIndex]}
                            alt="Apartment"
                            className="w-full h-64 object-cover rounded cursor-pointer"
                            onClick={handleClickImage}
                        />
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                            <IoIosArrowBack />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>
                    <div className="flex overflow-x-auto gap-2 mt-2" ref={imageRef}>
                        {apartment.images.map((img: string, idx: number) => (
                            <img
                                key={idx}
                                src={img}
                                alt="Thumbnail"
                                className={`w-20 h-20 object-cover rounded cursor-pointer ${idx === imageIndex ? "border-2 border-blue-500" : ""}`}
                                onClick={() => scrollToImage(idx)}
                            />
                        ))}
                    </div>
                </div>
                <div className="lg:w-1/2">
                    <h2 className="text-2xl font-bold">{apartment.name}</h2>
                    <p className="text-gray-600">Giá: {apartment.price}</p>
                    <p className="text-gray-600">Loại: {apartment.type}</p>
                    <p className="text-gray-600">Trạng thái: {apartment.status}</p>
                    <p className="text-gray-600">Người thuê: {apartment.user ?? "Chưa có"}</p>
                    <p className="text-gray-600">Mô tả: {apartment.description}</p>
                    <h3 className="text-xl font-bold mt-4">Dịch vụ</h3>
                    <ul className="list-disc pl-5">
                        {apartment.services.map((service: Service, idx: number) => (
                            <li key={idx}>
                                {service.name}: {service.price}/{service.unit}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {showModal && (
                <ModalZoomImage
                    image={selectedImage}
                    setImage={(src) => {
                        if (src === "") setShowModal(false); // Đóng modal khi setImage("")
                    }}
                />
            )}
        </div>
    );
};

export default ApartmentDetailDashboard;
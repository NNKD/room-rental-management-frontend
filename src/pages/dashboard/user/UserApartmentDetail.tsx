import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {envVar} from "../../../utils/EnvironmentVariables.ts";
import {NoticeType} from "../../../types/Context.ts";
import {useNotice} from "../../../hook/useNotice.ts";
import {useLoading} from "../../../contexts/LoadingContext.tsx";
import {useEffect, useState} from "react";
import {UserApartmentDetailType} from "../../../types/Apartment.ts";
import {formatCurrency} from "../../../utils/NumberCalculate.ts";
import {formatDate} from "../../../utils/DateProcess.ts";
import {getToken} from "../../../utils/TokenUtils.ts";
import {IoMdArrowBack} from "react-icons/io";

export default function UserApartmentDetail() {
    const {slug}  = useParams()
    const {setMessage, setType} = useNotice();
    const {setApiLoading} = useLoading();
    const [detail, setDetail] = useState<UserApartmentDetailType>()

    useEffect(() => {
        handleGetDetail()
    }, []);

    const handleGetDetail = async () => {
        setApiLoading(true);
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard-user/me/apartments/${slug}`, {
                headers: {
                    Authorization: "Bearer " + getToken()
                }
            });

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                setDetail(response.data.data);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage((error.response?.data?.message ?? "Không rõ lỗi"));
            } else {
                setMessage("Đã có lỗi xảy ra không xác định");
            }
            console.log(error)
            setType(NoticeType.ERROR)
        }finally {
            setApiLoading(false);
        }
    }

    return (
        <div className="overflow-auto h-fit max-h-full w-full rounded shadow-[0_0_3px_2px_#ccc] mt-16 lg:mt-0 p-4"
             style={window.innerWidth < 1024 ? { maxHeight: 'calc(100% - 64px)' } : {maxHeight: '100%'}}>
            <Link to="/dashboard-user/apartments" className="block p-2 cursor-pointer -ml-2">
                <IoMdArrowBack className="text-2xl"/>
            </Link>
            <div className="text-left">
                <p className="font-bold text-3xl">{detail?.rentalContractName}</p>
                <p className="text-xl font-bold mb-2 mt-6">Thông tin hợp đồng</p>
                <div className="flex flex-col gap-2">
                    <p className="text-base">Giá thuê: {formatCurrency(detail?.rentalContractPrice || 0)}</p>
                    <p className="text-base">Trạng thái: {detail?.rentalContractStatus}</p>
                    <p className="text-base">Ngày thuê: {formatDate(new Date(detail?.rentalContractStartDate || ""))}</p>
                    <p className="text-base">Ngày hết hạn: {formatDate(new Date(detail?.rentalContractEndDate || ""))}</p>
                    <p className="text-base">Ngày tạo hợp đồng: {formatDate(new Date(detail?.rentalContractCreatedAt || ""))}</p>
                </div>
                <p className="text-xl font-bold mb-2 mt-6">Thông tin căn hộ</p>
                <div className="flex flex-col gap-2">
                    <p>Tên phòng: {detail?.apartmentName}</p>
                    <p>Loại phòng: {detail?.apartmentType}</p>
                    <p>Tầng: {detail?.apartmentFloor}</p>
                    <p>Chiều dài (m): {detail?.apartmentWidth}</p>
                    <p>Chiều rộng (m): {detail?.apartmentHeight}</p>
                    {(detail?.apartmentBalcony || 0) > 0 ? (
                        <p>Diện tích ban công (m<sup>2</sup>): {detail?.apartmentBalcony}</p>
                    ) : ""}
                    {(detail?.apartmentTerrace || 0) > 0 ? (
                        <p>Diện tích ban công (m<sup>2</sup>): {detail?.apartmentTerrace}</p>
                    ) : ""}
                </div>

                <p className="text-xl font-bold mb-2 mt-6">Thông tin người thuê</p>
                <div className="flex flex-col gap-2">
                    <p>Tên người thuê: {detail?.userFullName}</p>
                    <p>Số điện thoại: {detail?.userPhone}</p>
                    <p>Email: {detail?.userEmail}</p>
                </div>
            </div>
        </div>
    )
}
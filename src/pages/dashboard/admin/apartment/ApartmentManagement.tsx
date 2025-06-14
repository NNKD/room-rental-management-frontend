import DynamicTable from "../../../../components/DynamicTable.tsx";
import {ApartmentManagementType, TableHeader} from "../../../../types/Dashboard.ts";
import {useEffect, useState} from "react";
import {useNotice} from "../../../../hook/useNotice.ts";
import {NoticeType} from "../../../../types/Context.ts";
import axios from "axios";
import {envVar} from "../../../../utils/EnvironmentVariables.ts";
import {Link} from "react-router-dom";
import {getToken} from "../../../../utils/TokenUtils.ts";

export default function ApartmentManagement() {
    const [apartments, setApartments] = useState<ApartmentManagementType[]>([])
    const {setMessage, setType} = useNotice()
    const [loading, setLoading] = useState(false)
    const token = getToken();

    const headers : TableHeader<ApartmentManagementType>[] = [
        {name: 'Phòng số', slug: 'name', sortASC: true},
        {name: 'Giá (VNĐ)', slug: 'price', isCurrency: true, sortASC: true},
        {name: 'Loại phòng', slug: 'type'},
        {name: 'Trạng thái', slug: 'status'},
        {name: 'Người thuê', slug: 'user', sortASC: true},
    ]

    useEffect(() => {
        handleGetApartmentMagement()
    }, [])

    const handleGetApartmentMagement = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/apartments`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });


            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                console.log(response.data.data)
                const apartmentsNormalize = response.data.data.map((a: ApartmentManagementType) => ({
                    ...a,
                    price: a.price,
                    name: <Link to={`/dashboard/apartment-management/${a.slug}`} className="underline text-blue-500" data-sort={a.name}>{a.name}</Link>,
                    user: <Link to={`/users/${a.userEmail}`} className="underline text-blue-500" data-sort={a.user}>{a.user}</Link>
                }))
                setApartments(apartmentsNormalize);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage((error.response?.data?.message ?? "Không rõ lỗi"));
            } else {
                setMessage("Đã có lỗi xảy ra không xác định");
            }
            console.log(error)
            setType(NoticeType.ERROR)
        }
    }

    const handleDeleteApartment = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${envVar.API_URL}/dashboard/apartments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                setLoading(false)
                setApartments(prev => prev.filter(a => a.id != Number(id)))
                setType(NoticeType.SUCCESS)
                setMessage("Xoá thành công")
            }

        } catch (error) {
            setLoading(false)
            if (axios.isAxiosError(error)) {
                setMessage((error.response?.data?.message ?? "Không rõ lỗi"));
            } else {
                setMessage("Đã có lỗi xảy ra không xác định");
            }
            console.log(error)
            setType(NoticeType.ERROR)
        }
    }


    return loading ? "" : (
        <div className="h-full flex flex-col overflow-hidden">
            <Link to={"/dashboard/apartment-management/add"} className="ml-auto mb-4 bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out">
                Thêm căn hộ
            </Link>
            <DynamicTable headers={headers} data={apartments} hasActionColumn={true} onDelete={handleDeleteApartment}/>
        </div>
    )
}




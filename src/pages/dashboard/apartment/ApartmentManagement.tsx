import DynamicTable from "../../../components/DynamicTable.tsx";
import {ApartmentManagementType, TableHeader} from "../../../types/Dashboard.ts";
import {useEffect, useState} from "react";
import {useNotice} from "../../../hook/useNotice.ts";
import {NoticeType} from "../../../types/Context.ts";
import axios from "axios";
import {envVar} from "../../../utils/EnvironmentVariables.ts";
import {Link} from "react-router-dom";

export default function ApartmentManagement() {
    const [apartments, setApartments] = useState<ApartmentManagementType[]>([])
    const {setMessage, setType} = useNotice()

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
            const response = await axios.get(`${envVar.API_URL}/dashboard/apartments`);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                const apartmentsNormalize = response.data.data.map((a: ApartmentManagementType) => ({
                    ...a,
                    price: a.price,
                    name: <Link to={`/dashboard/apartment-management/${a.slug}`} className="underline text-blue-500" data-sort={a.name}>{a.name}</Link>,
                    user: <Link to={`/users/${a.userEmail}`} className="underline text-blue-500" data-sort={a.user}>{a.user}</Link>
                }))
                setApartments(apartmentsNormalize);
            }

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }


    return (
        <div className="h-full flex flex-col overflow-hidden">
            <Link to={"/dashboard/apartment-management/add"} className="ml-auto mb-4 bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out">
                Thêm căn hộ
            </Link>
            <DynamicTable headers={headers} data={apartments} hasActionColumn={true}/>
        </div>
    )
}




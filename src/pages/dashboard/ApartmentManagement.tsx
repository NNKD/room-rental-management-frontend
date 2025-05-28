import DynamicTable from "../../components/DynamicTable.tsx";
import {ApartmentManagementType, TableHeader} from "../../types/Dashboard.ts";
import {useEffect, useState} from "react";
import {useNotice} from "../../hook/useNotice.ts";
import {NoticeType} from "../../types/Context.ts";
import axios from "axios";
import {envVar} from "../../utils/EnvironmentVariables.ts";
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
                    name: <Link to={`/apartments/${a.slug}`} className="underline text-blue-500" data-sort={a.name}>{a.name}</Link>,
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
        <DynamicTable headers={headers} data={apartments} hasActionColumn={true}/>
    )
}




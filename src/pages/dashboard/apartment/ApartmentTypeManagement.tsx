import DynamicTable from "../../../components/DynamicTable.tsx";
import {ApartmentTypeDTO, TableHeader} from "../../../types/Dashboard.ts";
import axios from "axios";
import {envVar} from "../../../utils/EnvironmentVariables.ts";
import {NoticeType} from "../../../types/Context.ts";
import {useNotice} from "../../../hook/useNotice.ts";
import {useEffect, useState} from "react";

export default function ApartmentTypeManagement() {
    const {setMessage, setType} = useNotice()
    const [types, setTypes] = useState<ApartmentTypeDTO[]>([])

    const headers: TableHeader<ApartmentTypeDTO>[] = [
        {name: 'Loại phòng', slug: 'name'},
        {name: 'Mô tả', slug: 'description'},
    ]

    useEffect(() => {
        handleGetApartmentType()
    }, [])

    const handleGetApartmentType = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/types`);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {

                setTypes(response.data.data);
            }

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }



    return (
        <DynamicTable headers={headers} data={types} hasActionColumn={true} hasEdit={true}/>
    )
}
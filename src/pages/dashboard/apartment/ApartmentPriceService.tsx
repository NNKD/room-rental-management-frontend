import DynamicTable from "../../../components/DynamicTable.tsx";
import {ApartmentPriceServiceType, ServiceDTO, TableHeader} from "../../../types/Dashboard.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {envVar} from "../../../utils/EnvironmentVariables.ts";
import {NoticeType} from "../../../types/Context.ts";
import {formatCurrency} from "../../../utils/NumberCalculate.ts";
import {useNotice} from "../../../hook/useNotice.ts";

export default function ApartmentPriceService() {
    const [services, setServices] = useState<ServiceDTO[]>([])
    const {setMessage, setType} = useNotice()

    useEffect(() => {
        handleGetServices()
    }, [])

    const handleGetServices = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/services`);

            if (response.status === 200 && response.data.status == 'success' && response.data.statusCode == 200) {
                const serviceNomalize = response.data.data.map((s: ServiceDTO) => ({
                    ...s,
                    price: formatCurrency(s.price)
                }))
                setServices(serviceNomalize);
            }

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra: "+ error)
            setType(NoticeType.ERROR)
        }
    }

    // Định nghĩa header cho bảng
    const tableHeaders: TableHeader<ApartmentPriceServiceType>[] = [
        { name: "Tên dịch vụ", slug: "name", sortASC: true },
        { name: "Mô tả", slug: "description", sortASC: true },
        { name: "Giá", slug: "price", sortASC: true },
        { name: "Đơn vị", slug: "unit", sortASC: true },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <h2 className="text-2xl font-bold mb-4">Quản lý Giá Dịch Vụ Tòa Nhà</h2>
            <DynamicTable
                headers={tableHeaders}
                data={services}
                hasActionColumn={true}
                hasEdit={true}
            />
        </div>
    );
}
import DynamicTable from "../../components/DynamicTable.tsx";
import {formatCurrency} from "../../utils/NumberCalculate.ts";
import {ApartmentTypeManagementType, TableHeader} from "../../types/Dashboard.ts";

export default function ApartmentTypeManagement() {
    const headers: TableHeader<ApartmentTypeManagementType>[] = [
        {
            name: 'STT',
            slug: 'id'
        },
        {
            name: 'Tên phòng',
            slug: 'name'
        },
        {
            name: 'Diện tích',
            slug: 'area'
        },
        {
            name: 'Giá thuê mặc định',
            slug: 'price',
            sortASC: true
        },
    ]

    const data = [
        {id: 1, name: 'Loại số 1', area: 100, price: formatCurrency(11000000)},
        {id: 2, name: 'Loại số 2', area: 200, price: formatCurrency(12000000)},
        {id: 3, name: 'Loại số 3', area: 300, price: formatCurrency(13000000)},
        {id: 4, name: 'Loại số 4', area: 400, price: formatCurrency(14000000)},
        {id: 5, name: 'Loại số 5', area: 500, price: formatCurrency(15000000)},
    ]



    return (
        <DynamicTable headers={headers} data={data} hasActionColumn={true}/>
    )
}
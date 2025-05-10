import DynamicTable from "../../components/DynamicTable.tsx";
import {ApartmentManagementType, TableHeader} from "../../type.ts";


export default function ApartmentManagement() {
    const headers : TableHeader<ApartmentManagementType>[] = [
        {
            name: 'STT',
            slug: 'id',
        },
        {
            name: 'Phòng số',
            slug: 'number',
        },
        {
            name: 'Loại phòng',
            slug: 'type',
        },
        {
            name: 'Trạng thái',
            slug: 'status',
        },
        {
            name: 'Hành động',
            slug: 'action',
        },
    ]

    const data = [
        {
            id: 1,
            number: 1,
            type: "VIP",
            status: "Done",
            action: "Doing"
        },
        {
            id: 2,
            number: 103,
            type: "Normal",
            status: "Done",
            action: "Doing"
        },
        {
            id: 4,
            number: 202,
            type: "VIP",
            status: "Fix",
            action: "Doing"
        },
    ]

    return (
        <DynamicTable headers={headers} data={data}/>
    )
}
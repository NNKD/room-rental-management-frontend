import DynamicTable from "../../components/DynamicTable.tsx";
import {ApartmentManagementType, TableHeader} from "../../type.ts";


export default function ApartmentManagement() {
    const headers : TableHeader<ApartmentManagementType>[] = [
        {
            name: 'STT',
            slug: 'id',
            sortASC: true,
        },
        {
            name: 'Phòng số',
            slug: 'number',
            sortASC: true,
        },
        {
            name: 'Loại phòng',
            slug: 'type',
            sortASC: true,
        },
        {
            name: 'Trạng thái',
            slug: 'status',
        },
    ]

    const data = [
        { id: 1, number: 1, type: "Deluxe", status: "Done"},
        { id: 2, number: 204, type: "VIP", status: "Fix"},
        { id: 3, number: 50, type: "VIP", status: "Pending"},
        { id: 4, number: 123, type: "Basic", status: "Pending"},
        { id: 5, number: 102, type: "Normal", status: "Done"},
    ];


    return (
        <DynamicTable headers={headers} data={data}/>
    )
}
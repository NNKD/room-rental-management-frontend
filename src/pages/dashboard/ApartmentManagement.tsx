import DynamicTable from "../../components/DynamicTable.tsx";
import {ApartmentManagementType, TableHeader} from "../../types/Dashboard.ts";

export default function ApartmentManagement() {
    const headers : TableHeader<ApartmentManagementType>[] = [
        {
            name: 'STT',
            slug: 'id',
            sortASC: true,
        }, {
            name: 'Phòng số',
            slug: 'number',
            sortASC: true,
        }, {
            name: 'Loại phòng',
            slug: 'type',
            sortASC: true,
        }, {
            name: 'Trạng thái',
            slug: 'status',
        }, {
            name: 'Số nhà vệ sinh',
            slug: 'bathroom',
        },{
            name: 'Số phòng ngủ',
            slug: 'bedroom'
        }
    ]

    const data = [
        { id: 1, number: 1, type: "Deluxe", status: "Done", bathroom: 1, bedroom: 3},
        { id: 2, number: 204, type: "VIP", status: "Fix", bathroom: 2, bedroom: 3},
        { id: 3, number: 50, type: "VIP", status: "Pending", bathroom: 3, bedroom: 3},
        { id: 4, number: 123, type: "Basic", status: "Pending", bathroom: 1, bedroom: 1},
        { id: 5, number: 102, type: "Normal", status: "Done", bathroom: 1, bedroom: 1},
    ];


    return (
        <DynamicTable headers={headers} data={data} hasActionColumn={true}/>
    )
}




import {ApartmentManagementType, ApartmentTypeManagementType, TableHeader} from "../type.ts";
import {GoTriangleDown, GoTriangleUp} from "react-icons/go";

/*
    headers: header of the table
    T:  type of data. Ex: ApartmentManagementType, ApartmentTypeManagementType
    data: data of the table. A lot of types of data. Ex: ApartmentManagementType, ApartmentTypeManagementType
 */


export default function DynamicTable<T extends ApartmentManagementType | ApartmentTypeManagementType>
                                    ({headers, data}: {headers: TableHeader<T>[], data: T[]}) {


    return (
        <div className="relative overflow-auto h-fit max-h-full w-full rounded-t-xl">
            <table className="border border-separate border-spacing-0 border-zinc-300  rounded-t-xl w-[1100px]">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            // Make header stick on top and last column stick on right of the table
                            <th key={index} className={`sticky top-0 border border-zinc-300 bg-lightGreen p-4 z-50
                                                        ${index == (headers.length - 1) ? "right-0" : ""}`}>
                                <div>
                                    {header.name}
                                    <div className="absolute top-1/2 right-[2%] -translate-y-1/2 h-full flex flex-col items-center justify-between">
                                        <div className="p-1 cursor-pointer">
                                            <GoTriangleUp className="text-xl"/>
                                        </div>
                                        <div className="p-1 cursor-pointer">
                                            <GoTriangleDown className="text-xl"/>
                                        </div>
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {data.map(row => (
                    <tr key={row.id}>
                        {headers.map((header, index) => (
                            // Make last column stick on right of the table.
                            <td key={index}
                                className={`border border-zinc-300 p-4 
                                            ${(index % 2 == 0) ? "bg-zinc-100" : "bg-white"}
                                            ${index == (headers.length - 1) ? "sticky right-0" : ""}`}>
                                {/* cast to string .If value == undefine or null => "" */}
                                {String(row[header.slug] ?? "")}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    )
}
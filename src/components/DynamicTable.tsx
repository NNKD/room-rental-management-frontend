import {ApartmentManagementType, ApartmentTypeManagementType, TableHeader} from "../type.ts";
import {GoTriangleDown, GoTriangleUp} from "react-icons/go";
import {useEffect, useState} from "react";
import {FaEdit} from "react-icons/fa";
import {MdDeleteForever} from "react-icons/md";

/*
    headers: header of the table
    T:  type of data. Ex: ApartmentManagementType, ApartmentTypeManagementType
    data: data of the table. A lot of types of data. Ex: ApartmentManagementType, ApartmentTypeManagementType
 */


export default function DynamicTable<T extends ApartmentManagementType | ApartmentTypeManagementType>
                                    ({headers, data}: {headers: TableHeader<T>[], data: T[]}) {

    const [headersTable, setHeadersTable] = useState<TableHeader<T>[]>(headers)
    const [dataTable, setDataTable] = useState<T[]>(data)

    useEffect(() => {
        console.log(dataTable)
    }, [dataTable]);

    const handleChangeSortType = (column: string, isASC: boolean) => {
        console.log(column)
        const sortedHeaders = headersTable.map((header) => header.slug == column ? {...header, sortASC: !header.sortASC} : {...header, sortASC: true})
        setHeadersTable(sortedHeaders)
        handleSortData(column, isASC)
    }

    const handleSortData = (column: string, isASC: boolean) => {
        if (!column) return

        const sortedData = [...dataTable].sort((a, b) => {
            const valueA = a[column as keyof T]
            const valueB = b[column as keyof T]

            if (valueA == null || valueB == null) return 0;

            let result = 0;

            if (typeof valueA === "number" && typeof valueB === "number") {
                result = valueA - valueB
            }else if (typeof valueA === "string" && typeof valueB === "string") {
                result = valueA.localeCompare(valueB)
            }else if (valueA instanceof Date && valueB instanceof Date) {
                result = valueA.getTime() - valueB.getTime()
            }

            return isASC ? result : -result;
        })

        setDataTable(sortedData)
    }

    return (
        <div className="relative overflow-auto h-fit max-h-full w-full rounded-t-xl">
            <table className="border border-separate border-spacing-0 border-zinc-300  rounded-t-xl w-[1100px]">
                <thead>
                    <tr>
                        {headersTable.map((header, index) => (
                            // Make header stick on top of the table
                            <th key={index} className="sticky top-0 border border-zinc-300 bg-lightGreen p-4 z-50">
                                <div>
                                    {header.name}

                                    {/* Show column sort icon */}
                                    {!(header.sortASC == null || undefined) ? (
                                        <div className="absolute top-1/2 right-[2%] -translate-y-1/2 h-full flex flex-col items-center justify-between">
                                            <div className={`p-1
                                                         ${!header.sortASC ? "text-zinc-300 cursor-pointer hover:text-black" : "text-black pointer-events-none"} `}
                                                 onClick={() => handleChangeSortType(String(header.slug), true)}>
                                                <GoTriangleUp className="text-xl"/>
                                            </div>
                                            <div className={`p-1 cursor-pointer
                                                         ${!header.sortASC ? "text-black pointer-events-none" : "text-zinc-300 cursor-pointer hover:text-black"} `}
                                                 onClick={() => handleChangeSortType(String(header.slug), false)}>
                                                <GoTriangleDown className="text-xl"/>
                                            </div>
                                        </div>
                                    ) : ""}
                                </div>
                            </th>
                        ))}


                        <th className="sticky top-0 right-0 border border-zinc-300 bg-lightGreen p-4 z-50">
                            Hành động
                        </th>
                    </tr>


                </thead>
                <tbody>
                {dataTable.map(row => (
                    <tr key={row.id}>
                        {headersTable.map((header, index) => (
                            <td key={index}
                                className={`border border-zinc-300 p-4 
                                            ${(index % 2 == 0) ? "bg-zinc-100" : "bg-white"}`}>
                                {/* cast to string .If value == undefine or null => "" */}
                                {String(row[header.slug] ?? "")}
                            </td>
                        ))}

                        <td className={`border border-zinc-300 p-4 bg-white sticky right-0
                                        ${(headers.length % 2 == 0) ? "bg-zinc-100" : "bg-white"}`}>
                            <div className="flex items-center justify-evenly">
                                <div className="group p-1 cursor-pointer">
                                    <FaEdit className="text-2xl hover:text-lightGreen transition-all duration-300 ease-in-out"/>
                                </div>

                                <div className="group p-1 cursor-pointer">
                                    <MdDeleteForever className="text-2xl hover:text-lightGreen transition-all duration-300 ease-in-out" />
                                </div>
                            </div>

                        </td>

                    </tr>
                ))}

                </tbody>
            </table>
        </div>

    )
}
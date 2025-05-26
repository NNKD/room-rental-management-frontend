import {GoTriangleDown, GoTriangleUp} from "react-icons/go";
import {useState} from "react";
import {FaEdit} from "react-icons/fa";
import {MdDeleteForever} from "react-icons/md";
import * as React from "react";
import {
    ApartmentManagementType,
    ApartmentPriceServiceType,
    ApartmentTypeManagementType,
    TableHeader
} from "../types/Dashboard.ts";

/*
    headers: header of the table
    T:  type of data. Ex: ApartmentManagementType, ApartmentTypeManagementType
    data: data of the table. A lot of types of data. Ex: ApartmentManagementType, ApartmentTypeManagementType
    hasActionColumn: true => show column "Hành động". False => hide this column
 */


export default function DynamicTable<T extends ApartmentManagementType | ApartmentTypeManagementType | ApartmentPriceServiceType>
                                    ({headers, data, hasActionColumn}: {headers: TableHeader<T>[], data: T[], hasActionColumn: boolean}) {

    const [headersTable, setHeadersTable] = useState<TableHeader<T>[]>(headers)
    const [dataTable, setDataTable] = useState<T[]>(data)

    // get column sort and type and call function handleSortData
    const handleChangeSortType = (column: string, isASC: boolean) => {
        // change sortASC of the column which was clicked. And reset other columns
        const sortedHeaders = headersTable.map((header) => header.slug == column ? {...header, sortASC: !header.sortASC} : {...header, sortASC: true})
        setHeadersTable(sortedHeaders)
        handleSortData(column, isASC)
    }

    /*
        Sort Data
        Column sort
        isASC: check asc or desc. Desc = -asc
        check 3 type data value. Number, String, Date
     */
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

    // render different type of data. JSX, Date, object, string, number,...
    const handleRenderTableValue = (value: unknown): React.ReactNode => {
        if (React.isValidElement(value)) return value;
        if (value instanceof Date) return value.toLocaleDateString();
        if (typeof value === "object" && value !== null) return JSON.stringify(value);
        return String(value ?? "");
    };
    return (
        <div className="relative overflow-auto h-fit max-h-full w-full rounded-t-xl">
            <table className="table-auto border border-separate border-spacing-0 border-zinc-300 rounded-t-xl w-screen">
                <thead>
                    <tr>
                        {headersTable.map((header, index) => (
                            // Make header stick on top of the table. Column has % width
                            <th key={index} className={`sticky top-0 border border-zinc-300 bg-lightGreen p-4 z-50`}>
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

                        {/*Stick column on the right of the table*/}
                        {hasActionColumn ? (
                            <th className="sticky top-0 right-0 border border-zinc-300 bg-lightGreen p-4 z-50 w-[20%]">
                                Hành động
                            </th>
                        ) : ""}

                    </tr>

                </thead>
                <tbody>
                {dataTable.map(row => (
                    <tr key={row.id}>
                        {headersTable.map((header, index) => (
                            <td key={index}
                                className={`border border-zinc-300 p-4 
                                            ${(index % 2 == 0) ? "bg-zinc-100" : "bg-white"}`}>

                                {handleRenderTableValue(row[header.slug])}

                            </td>
                        ))}

                        {/*Stick column on the right of the table*/}
                        {hasActionColumn ? (
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
                        ) : ""}

                    </tr>
                ))}

                </tbody>
            </table>
        </div>

    )
}
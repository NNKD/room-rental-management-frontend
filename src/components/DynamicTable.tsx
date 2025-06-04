import {GoTriangleDown, GoTriangleUp} from "react-icons/go";
import {ReactElement, useEffect, useState} from "react";
import {MdDeleteForever} from "react-icons/md";
import * as React from "react";
import {
    ApartmentManagementType,
    ApartmentPriceServiceType, ApartmentTypeDTO,
    ServiceType,
    TableHeader
} from "../types/Dashboard.ts";
import {formatCurrency} from "../utils/NumberCalculate.ts";
import {FaEdit} from "react-icons/fa";


/*
    headers: header of the table
    T:  type of data. Ex: ApartmentManagementType, ApartmentTypeManagementType
    data: data of the table. A lot of types of data. Ex: ApartmentManagementType, ApartmentTypeManagementType
    hasActionColumn: true => show column "Hành động". False => hide this column
    hasEdit: true => edit icon
    onDelete: function, use when click on delete icon
 */


export default function DynamicTable<T extends ApartmentManagementType | ApartmentTypeDTO | ApartmentPriceServiceType | ServiceType>
                                    ({headers, data, hasActionColumn, hasEdit, onDelete}: {headers: TableHeader<T>[], data: T[], hasActionColumn: boolean, hasEdit?: boolean, onDelete?: (id: string) => void}) {

    const [headersTable, setHeadersTable] = useState<TableHeader<T>[]>(headers)
    const [dataTable, setDataTable] = useState<T[]>(data)

    useEffect(() => {
        setHeadersTable(headers);
    }, [headers]);

    useEffect(() => {
        setDataTable(data);
    }, [data]);

    // get column sort and type and call function handleSortData
    const handleChangeSortType = (column: string, isASC: boolean) => {
        // change sortASC of the column which was clicked. And reset other columns
        const sortedHeaders = headersTable.map((header) =>{
            if (!('sortASC' in header)) return header;
            return header.slug == column ? {...header, sortASC: !header.sortASC} : {...header, sortASC: true};
        })

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
            let valueA: unknown = a[column as keyof T]
            let valueB: unknown = b[column as keyof T]

            if (valueA == null || valueB == null) return 0;

            let result = 0;


            // Check if is a React Element get data-sort from props to compare. Ex: <div data-sort="123"> Text </div>
            if (React.isValidElement(valueA) && React.isValidElement(valueB)) {
                const valueAElement = valueA as ReactElement<{"data-sort": string}>;
                const valueBElement = valueB as ReactElement<{"data-sort": string}>;

                valueA = valueAElement.props["data-sort"]
                valueB = valueBElement.props["data-sort"]
            }

            if (typeof valueA === "number" && typeof valueB === "number") {
                result = valueA - valueB
            }else if (typeof valueA === "string" && typeof valueB === "string") {
                result = valueA.localeCompare(valueB);
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
        return String(value ?? "");
    };
    return (
        <div className="relative overflow-auto h-fit max-h-full w-full rounded-t-xl">
            <table className="table-auto border border-separate border-spacing-0 border-zinc-300 rounded-t-xl w-screen">
                <thead>
                    <tr>

                        <th className="sticky top-0 border border-zinc-300 bg-lightGreen p-4 z-50 w-[10%]">
                            <div>
                                STT
                            </div>
                        </th>

                        {headersTable.map((header, index) => (
                            // Make header stick on top of the table.
                            <th key={index}
                                className="sticky top-0 border border-zinc-300 bg-lightGreen p-4 z-50">
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
                            <th className="sticky top-0 right-0 border border-zinc-300 bg-lightGreen p-4 z-50 w-[10%]">
                                Hành động
                            </th>
                        ) : ""}

                    </tr>

                </thead>
                <tbody>
                {dataTable.map((row, index) => (
                    <tr key={index}>
                        <td className="border border-zinc-300 p-4 bg-white text-center">
                            {index + 1}
                        </td>

                        {headersTable.map((header, index) => (
                            <td key={index}
                                className={`border border-zinc-300 p-4 
                                            ${(index % 2 == 0) ? "bg-zinc-100" : "bg-white"}
                                            ${header.center ? "text-center" : ""}`}>

                                {header.isCurrency ? formatCurrency(Number(row[header.slug])) : handleRenderTableValue(row[header.slug])}

                            </td>
                        ))}

                        {/*Stick column on the right of the table*/}
                        {hasActionColumn ? (
                            <td className={`border border-zinc-300 p-4 bg-white sticky right-0
                                        ${(headers.length % 2 == 0) ? "bg-zinc-100" : "bg-white"}`}>
                                <div className="flex items-center justify-evenly">

                                    {
                                        hasEdit ? (
                                            <div className="group p-1 cursor-pointer">
                                                <FaEdit className="text-2xl hover:text-lightGreen transition-all duration-300 ease-in-out"/>
                                            </div>
                                        ) : ""
                                    }


                                    <div className="group p-1 cursor-pointer" onClick={() => onDelete?.(String(row.id))}>
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
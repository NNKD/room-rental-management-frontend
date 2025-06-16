import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { ReactElement, useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import * as React from "react";
import {
    ApartmentManagementType,
    ApartmentPriceServiceType,
    ApartmentTypeDTO,
    BillResponseDTO,
    RentalContractResponse,
    ServiceType,
    TableHeader,
    UserApartmentDTO,
    UserManagementDTO,
} from "../types/Dashboard.ts";
import { formatCurrency } from "../utils/NumberCalculate.ts";
import { FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function DynamicTable<T extends BillResponseDTO | ApartmentManagementType | ApartmentTypeDTO | ApartmentPriceServiceType | ServiceType | UserManagementDTO | RentalContractResponse | UserApartmentDTO>(
    {
        headers,
        data,
        hasActionColumn,
        hasEdit,
        onEdit,
        onDelete,
        customAction,
    }: {
        headers: TableHeader<T>[];
        data: T[];
        hasActionColumn: boolean;
        hasEdit?: boolean;
        onEdit?: (id: string) => void;
        onDelete?: (id: string) => void;
        customAction?: (row: T) => React.ReactNode;
    }
) {
    const [headersTable, setHeadersTable] = useState<TableHeader<T>[]>(headers);
    const [dataTable, setDataTable] = useState<T[]>(data);
    const { t } = useTranslation();

    useEffect(() => {
        setHeadersTable(headers);
    }, [headers]);

    useEffect(() => {
        setDataTable(data);
    }, [data]);

    const handleChangeSortType = (column: string, isASC: boolean) => {
        const sortedHeaders = headersTable.map((header) => {
            if (!("sortASC" in header)) return header;
            return header.slug === column ? { ...header, sortASC: !header.sortASC } : { ...header, sortASC: true };
        });

        setHeadersTable(sortedHeaders);
        handleSortData(column, isASC);
    };

    const handleSortData = (column: string, isASC: boolean) => {
        if (!column) return;

        const sortedData = [...dataTable].sort((a, b) => {
            let valueA: unknown = a[column as keyof T];
            let valueB: unknown = b[column as keyof T];

            if (valueA == null || valueB == null) return 0;

            let result = 0;

            if (React.isValidElement(valueA) && React.isValidElement(valueB)) {
                const valueAElement = valueA as ReactElement<{ "data-sort": string }>;
                const valueBElement = valueB as ReactElement<{ "data-sort": string }>;

                valueA = valueAElement.props["data-sort"];
                valueB = valueBElement.props["data-sort"];
            }

            if (typeof valueA === "number" && typeof valueB === "number") {
                result = valueA - valueB;
            } else if (typeof valueA === "string" && typeof valueB === "string") {
                result = valueA.localeCompare(valueB);
            } else if (valueA instanceof Date && valueB instanceof Date) {
                result = valueA.getTime() - valueB.getTime();
            }

            return isASC ? result : -result;
        });

        setDataTable(sortedData);
    };

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
                        <div>{t("stt")}</div>
                    </th>

                    {headersTable.map((header, index) => (
                        <th key={index} className="sticky top-0 border border-zinc-300 bg-lightGreen p-4 z-50">
                            <div>
                                {header.name}

                                {!("sortASC" in header) ? null : (
                                    <div className="absolute top-1/2 right-[2%] -translate-y-1/2 h-full flex flex-col items-center justify-between">
                                        <div
                                            className={`p-1 ${!header.sortASC ? "text-zinc-300 cursor-pointer hover:text-black" : "text-black pointer-events-none"}`}
                                            onClick={() => handleChangeSortType(String(header.slug), true)}
                                        >
                                            <GoTriangleUp className="text-xl" />
                                        </div>
                                        <div
                                            className={`p-1 cursor-pointer ${!header.sortASC ? "text-black pointer-events-none" : "text-zinc-300 cursor-pointer hover:text-black"}`}
                                            onClick={() => handleChangeSortType(String(header.slug), false)}
                                        >
                                            <GoTriangleDown className="text-xl" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </th>
                    ))}

                    {hasActionColumn ? (
                        <th className="sticky top-0 right-0 border border-zinc-300 bg-lightGreen p-4 z-50 w-[10%]">
                            {t("actions")}
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
                            <td
                                key={index}
                                className={`border border-zinc-300 p-4 ${(index % 2 === 0 ? "bg-zinc-100" : "bg-white")}${header.center ? " text-center" : ""}`}
                            >
                                {header.isCurrency
                                    ? formatCurrency(Number(row[header.slug]))
                                    : header.render
                                        ? header.render(row)
                                        : handleRenderTableValue(row[header.slug])}
                            </td>
                        ))}

                        {hasActionColumn ? (
                            <td className={`border border-zinc-300 p-4 bg-white sticky right-0 ${(headers.length % 2 === 0 ? "bg-zinc-100" : "bg-white")}`}>
                                <div className="flex items-center justify-evenly">
                                    {hasEdit ? (
                                        <div className="group p-1 cursor-pointer" onClick={() => onEdit?.(String(row.id))}>
                                            <FaEdit className="text-2xl hover:text-lightGreen transition-all duration-300 ease-in-out" />
                                        </div>
                                    ) : null}

                                    {onDelete ? (
                                        <div className="group p-1 cursor-pointer" onClick={() => onDelete(String(row.id))}>
                                            <MdDeleteForever className="text-2xl hover:text-lightGreen transition-all duration-300 ease-in-out" />
                                        </div>
                                    ) : null}

                                    {customAction && (
                                        <div className="group p-1 cursor-pointer">
                                            {customAction(row)}
                                        </div>
                                    )}
                                </div>
                            </td>
                        ) : ""}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
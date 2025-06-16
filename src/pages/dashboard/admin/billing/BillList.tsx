import DynamicTable from "../../../../components/DynamicTable.tsx";
import { TableHeader, BillResponseDTO } from "../../../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../../types/Context.ts";
import { useNotice } from "../../../../hook/useNotice.ts";
import { useLoading } from "../../../../contexts/LoadingContext.tsx";
import { useTranslation } from "react-i18next";

export default function BillList() {
    const [bills, setBills] = useState<BillResponseDTO[]>([]);
    const [editingBill, setEditingBill] = useState<BillResponseDTO | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [deletingBillId, setDeletingBillId] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        handleGetBills();
    }, []);

    const handleGetBills = async () => {
        try {
            setApiLoading(true);
            const response = await axios.get(`${envVar.API_URL}/dashboard/billing`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
            });
            if (response.status === 200 && response.data.status === "success") {
                setBills(response.data.data || []);
                if ((response.data.data || []).length === 0) {
                    setMessage(t("no_bills"));
                    setType(NoticeType.INFO);
                }
            } else {
                const errorMessage = getErrorMessage(response.data.code) || response.data.message || t("cannot_fetch_bills");
                setMessage(errorMessage);
                setType(NoticeType.ERROR);
                setBills([]);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ status: string; code?: string; message?: string }>;
            const errorData = axiosError.response?.data;
            const errorMessage = getErrorMessage(errorData?.code) || errorData?.message || t("unknown_error");
            setMessage(errorMessage);
            setType(NoticeType.ERROR);
            setBills([]);
        } finally {
            setApiLoading(false);
        }
    };

    const handleEditBill = (id: string) => {
        const bill = bills.find((b) => b.id === parseInt(id));
        if (bill) {
            setEditingBill({ ...bill }); // Sao chép để chỉnh sửa
            setIsEditModalOpen(true);
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBill) return;

        try {
            setApiLoading(true);
            const response = await axios.put(
                `${envVar.API_URL}/dashboard/billing/${editingBill.id}`,
                editingBill,
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` } }
            );
            if (response.status === 200 && response.data.status === "success") {
                setMessage(t("bill_updated_success"));
                setType(NoticeType.SUCCESS);
                setBills(bills.map((bill) => (bill.id === editingBill.id ? editingBill : bill)));
                setIsEditModalOpen(false);
                setEditingBill(null);
            } else {
                const errorMessage = getErrorMessage(response.data.code) || response.data.message || t("bill_update_failed");
                setMessage(errorMessage);
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ status: string; code?: string; message?: string }>;
            const errorData = axiosError.response?.data;
            const errorMessage = getErrorMessage(errorData?.code) || errorData?.message || t("unknown_error");
            setMessage(errorMessage);
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (editingBill) {
            setEditingBill((prev) => ({
                ...prev!,
                [name]: name === "rentalAmount" || name === "totalAmount" ? parseFloat(value) || 0 : value,
            }));
        }
    };

    const handleServiceChange = (index: number, field: string, value: number | string) => {
        if (editingBill && editingBill.serviceDetails) {
            const updatedServices = [...editingBill.serviceDetails];
            if (field === "quantity" || field === "price") {
                updatedServices[index] = {
                    ...updatedServices[index],
                    [field]: parseFloat(value as string) || 0,
                    totalPrice: (updatedServices[index].quantity || 0) * (updatedServices[index].price || 0),
                };
            } else {
                updatedServices[index] = { ...updatedServices[index], [field]: value };
            }
            setEditingBill((prev) => ({
                ...prev!,
                serviceDetails: updatedServices,
                totalAmount: prev!.totalAmount + (updatedServices[index].totalPrice || 0) - (editingBill.serviceDetails[index].totalPrice || 0),
            }));
        }
    };

    const handleDeleteBill = (id: string) => {
        setDeletingBillId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDeleteBill = async () => {
        if (!deletingBillId) return;
        try {
            setApiLoading(true);
            const response = await axios.delete(`${envVar.API_URL}/dashboard/billing/${deletingBillId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
            });
            if (response.status === 200 && response.data.status === "success") {
                setMessage(t("bill_deleted_success"));
                setType(NoticeType.SUCCESS);
                handleGetBills();
            } else {
                const errorMessage = getErrorMessage(response.data.code) || response.data.message || t("bill_delete_failed");
                setMessage(errorMessage);
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ status: string; code?: string; message?: string }>;
            const errorData = axiosError.response?.data;
            const errorMessage = getErrorMessage(errorData?.code) || errorData?.message || t("unknown_error");
            setMessage(errorMessage);
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
            setIsConfirmDeleteModalOpen(false);
            setDeletingBillId(null);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setDeletingBillId(null);
    };

    // Hàm ánh xạ mã lỗi sang thông báo chuẩn hóa
    const getErrorMessage = (code?: string): string | undefined => {
        switch (code) {
            case "invalidInput":
                return t("invalid_input");
            case "invalidContract":
                return t("invalid_contract");
            case "paymentNotFound":
                return t("bill_not_found");
            case "serverError":
                return t("server_error");
            default:
                return undefined;
        }
    };

    const tableHeaders: TableHeader<BillResponseDTO>[] = [
        { name: t("id"), slug: "id", sortASC: true, center: true },
        { name: t("name"), slug: "name", sortASC: true, center: true },
        {
            name: t("rental_amount"),
            slug: "rentalAmount",
            sortASC: true,
            center: true,
            isCurrency: true,
            render: (row) => `${row.rentalAmount.toLocaleString()} VNĐ`,
        },
        {
            name: t("service_details"),
            slug: "serviceDetails",
            sortASC: false,
            center: true,
            render: (row) =>
                row.serviceDetails && row.serviceDetails.length > 0 ? (
                    <ul>
                        {row.serviceDetails.map((service, index) => (
                            <li key={index}>
                                {service.name}: {service.quantity} x {service.price.toLocaleString()} VNĐ = {service.totalPrice.toLocaleString()} VNĐ
                            </li>
                        ))}
                    </ul>
                ) : t("no_service_details"),
        },
        {
            name: t("total_amount"),
            slug: "totalAmount",
            sortASC: true,
            center: true,
            isCurrency: true,
            render: (row) => `${row.totalAmount.toLocaleString()} VNĐ`,
        },
        {
            name: t("created_at"),
            slug: "createdAt",
            sortASC: true,
            center: true,
            render: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN"),
        },
        {
            name: t("due_date"),
            slug: "dueDate",
            sortASC: true,
            center: true,
            render: (row) => new Date(row.dueDate).toLocaleDateString("vi-VN"),
        },
        { name: t("status"), slug: "status", sortASC: true, center: true },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <div className="flex justify-between items-center mb-4">
                {/*<h2 className="text-2xl font-bold">{t("bill_list")}</h2>*/}
            </div>
            {bills.length > 0 ? (
                <DynamicTable
                    headers={tableHeaders}
                    data={bills}
                    hasActionColumn={true}
                    hasEdit={true}
                    onEdit={handleEditBill}
                    onDelete={handleDeleteBill}
                />
            ) : (
                <div className="text-center text-gray-500 py-4">{t("no_bill_data")}</div>
            )}
            {isConfirmDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{t("confirm_delete")}</h3>
                        <p className="mb-4">{t("confirm_delete_bill_message")}</p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={handleCancelDelete}
                            >
                                {t("no")}
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={confirmDeleteBill}
                            >
                                {t("yes")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isEditModalOpen && editingBill && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-2xl">
                        <h3 className="text-xl font-bold mb-4">{t("edit_bill")}</h3>
                        <form onSubmit={handleSaveEdit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t("name")}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editingBill.name}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t("rental_amount")}</label>
                                    <input
                                        type="number"
                                        name="rentalAmount"
                                        value={editingBill.rentalAmount}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t("total_amount")}</label>
                                    <input
                                        type="number"
                                        name="totalAmount"
                                        value={editingBill.totalAmount}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t("status")}</label>
                                    <select
                                        name="status"
                                        value={editingBill.status}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                    >
                                        <option value="PENDING">{t("pending")}</option>
                                        <option value="PAID">{t("paid")}</option>
                                        <option value="OVERDUE">{t("overdue")}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">{t("service_details")}</label>
                                {editingBill.serviceDetails && editingBill.serviceDetails.length > 0 ? (
                                    <ul className="border border-gray-300 p-2 rounded">
                                        {editingBill.serviceDetails.map((service, index) => (
                                            <li key={index} className="mb-2 p-2 border-b">
                                                <input
                                                    type="text"
                                                    value={service.name}
                                                    onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                                                    className="w-1/4 border border-gray-300 p-1 rounded mr-2"
                                                />
                                                <input
                                                    type="number"
                                                    value={service.quantity}
                                                    onChange={(e) => handleServiceChange(index, "quantity", e.target.value)}
                                                    className="w-1/6 border border-gray-300 p-1 rounded mr-2"
                                                />
                                                <input
                                                    type="number"
                                                    value={service.price}
                                                    onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                                                    className="w-1/6 border border-gray-300 p-1 rounded mr-2"
                                                />
                                                <span className="ml-2">
                                                    {t("total")}: {service.totalPrice.toLocaleString()} VNĐ
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{t("no_service_details")}</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingBill(null);
                                    }}
                                >
                                    {t("cancel")}
                                </button>
                                <button
                                    type="submit"
                                    className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-lightGreenHover"
                                >
                                    {t("save")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
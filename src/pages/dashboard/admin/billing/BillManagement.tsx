import DynamicTable from "../../../../components/DynamicTable.tsx";
import { TableHeader, BillResponseDTO } from "../../../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../../types/Context.ts";
import { useNotice } from "../../../../hook/useNotice.ts";
import { useLoading } from "../../../../contexts/LoadingContext.tsx";

export default function BillManagement() {
    const [bills, setBills] = useState<BillResponseDTO[]>([]);
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBill, setEditingBill] = useState<BillResponseDTO | null>(null);
    const [formData, setFormData] = useState({
        rentalContractId: "",
    });
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [deletingBillId, setDeletingBillId] = useState<string | null>(null);

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
                setBills(response.data.data);
            } else {
                setMessage(response.data.message || "Không thể lấy danh sách hóa đơn");
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Đã có lỗi xảy ra");
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    const handleCreateBill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.rentalContractId) {
            setMessage("Vui lòng chọn ID hợp đồng thuê");
            setType(NoticeType.ERROR);
            return;
        }

        try {
            setApiLoading(true);
            const response = await axios.post(
                `${envVar.API_URL}/dashboard/billing/create/${formData.rentalContractId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
                }
            );
            if (response.status === 200) {
                setMessage("Tạo hóa đơn thành công");
                setType(NoticeType.SUCCESS);
                setIsModalOpen(false);
                handleGetBills();
            } else {
                setMessage(response.data.message || "Tạo hóa đơn thất bại");
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Đã có lỗi xảy ra");
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    const handleEditBill = (id: string) => {
        const bill = bills.find((b) => b.id.toString() === id);
        if (bill) {
            setEditingBill(bill);
            setFormData({ rentalContractId: bill.id.toString() });
            setIsModalOpen(true);
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
                setMessage("Xóa hóa đơn thành công");
                setType(NoticeType.SUCCESS);
                handleGetBills();
            } else {
                setMessage(response.data.message || "Xóa hóa đơn thất bại");
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Đã có lỗi xảy ra");
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBill(null);
        setFormData({ rentalContractId: "" });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const tableHeaders: TableHeader<BillResponseDTO>[] = [
        { name: "ID", slug: "id", sortASC: true, center: true },
        { name: "Tên", slug: "name", sortASC: true, center: true },
        {
            name: "Tiền thuê",
            slug: "rentalAmount",
            sortASC: true,
            center: true,
            isCurrency: true,
            render: (row) => `${row.rentalAmount.toLocaleString()} VNĐ`,
        },
        {
            name: "Chi tiết dịch vụ",
            slug: "serviceDetails",
            sortASC: false,
            center: true,
            render: (row) => (
                <ul>
                    {row.serviceDetails.map((service, index) => (
                        <li key={index}>
                            {service.name}: {service.quantity} x {service.price.toLocaleString()} VNĐ = {service.totalPrice.toLocaleString()} VNĐ
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            name: "Tổng tiền",
            slug: "totalAmount",
            sortASC: true,
            center: true,
            isCurrency: true,
            render: (row) => `${row.totalAmount.toLocaleString()} VNĐ`,
        },
        {
            name: "Ngày tạo",
            slug: "createdAt",
            sortASC: true,
            center: true,
            render: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN"),
        },
        {
            name: "Ngày đến hạn",
            slug: "dueDate",
            sortASC: true,
            center: true,
            render: (row) => new Date(row.dueDate).toLocaleDateString("vi-VN"),
        },
        { name: "Trạng thái", slug: "status", sortASC: true, center: true },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản lý Hóa đơn</h2>
                <button
                    className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => setIsModalOpen(true)}
                >
                    Tạo Hóa đơn
                </button>
            </div>
            <DynamicTable
                headers={tableHeaders}
                data={bills}
                hasActionColumn={true}
                hasEdit={true}
                onEdit={handleEditBill}
                onDelete={handleDeleteBill}
            />
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{editingBill ? "Sửa Hóa đơn" : "Tạo Hóa đơn"}</h3>
                        <form onSubmit={handleCreateBill}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">ID Hợp đồng thuê</label>
                                <input
                                    type="number"
                                    name="rentalContractId"
                                    value={formData.rentalContractId}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={handleCloseModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {editingBill ? "Cập nhật" : "Tạo"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isConfirmDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Xác nhận xóa</h3>
                        <p className="mb-4">Bạn có chắc chắn muốn xóa hóa đơn này không?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={handleCancelDelete}
                            >
                                Không
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={confirmDeleteBill}
                            >
                                Có
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { useEffect, useState } from "react";
import axios from "axios";
import DynamicTable from "../../../components/DynamicTable.tsx";
import { TableHeader, BillResponseDTO } from "../../../types/Dashboard.ts";
import { envVar } from "../../../utils/EnvironmentVariables.ts";
import { useNotice } from "../../../hook/useNotice.ts";
import { getToken } from "../../../utils/TokenUtils.ts";
import { useLoading } from "../../../contexts/LoadingContext.tsx";
import { formatDate } from "../../../utils/DateProcess.ts";
import { NoticeType } from "../../../types/Context.ts";
import { useTranslation } from "react-i18next";

export default function UserBillManagement() {
    const token = getToken();
    const [bills, setBills] = useState<BillResponseDTO[]>([]);
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();
    const { t } = useTranslation();

    // State cho modal chi tiết hóa đơn
    const [selectedBill, setSelectedBill] = useState<BillResponseDTO | null>(null);
    const [showModal, setShowModal] = useState(false);

    const headers: TableHeader<BillResponseDTO>[] = [
        { name: t("bill_id"), slug: "id", center: true },
        {
            name: t("bill_name"),
            slug: "name",
            center: true,
            render: (row) => (
                <span
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => handleBillClick(row)}
                >
                    {row.name}
                </span>
            ),
        },
        {
            name: t("total_amount"),
            slug: "totalAmount",
            center: true,
            render: (row) => `${row.totalAmount.toLocaleString()} VNĐ`,
        },
        {
            name: t("created_date"),
            slug: "createdAt",
            center: true,
            render: (row) => formatDate(new Date(row.createdAt)),
        },
        {
            name: t("due_date"),
            slug: "dueDate",
            center: true,
            render: (row) => formatDate(new Date(row.dueDate)),
        },
        {
            name: t("status"),
            slug: "status",
            center: true,
            render: (row) => (
                <span
                    className={`px-2 py-1 rounded text-sm ${
                        row.status === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                    {row.status === "PAID" ? t("paid") : t("pending_payment")}
                </span>
            ),
        },
    ];

    useEffect(() => {
        handleGetBills();
    }, []);

    const handleGetBills = async () => {
        setApiLoading(true);
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard-user/me/bills`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.status === "success") {
                const formattedBills = response.data.data.map((bill: BillResponseDTO) => ({
                    ...bill,
                    createdAt: new Date(bill.createdAt).toISOString(),
                    dueDate: new Date(bill.dueDate).toISOString(),
                }));
                setBills(formattedBills);
            } else {
                setMessage(response.data.message || t("cannot_fetch_bills"));
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message ?? t("unknown_error"));
            } else {
                setMessage(t("unknown_error"));
            }
            console.log(error);
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    // Xử lý khi click vào tên hóa đơn
    const handleBillClick = (bill: BillResponseDTO) => {
        setSelectedBill(bill);
        setShowModal(true);
    };

    return (
        <div className="h-full flex flex-col overflow-hidden relative">
            <h1 className="mb-8 font-bold text-2xl mt-16 lg:mt-0">{t("my_bill_management")}</h1>
            <DynamicTable headers={headers} data={bills} hasActionColumn={false} />

            {/* Modal chi tiết hóa đơn */}
            {showModal && selectedBill && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Header modal */}
                            <div className="flex justify-between items-start border-b pb-4">
                                <h2 className="text-2xl font-bold">{selectedBill.name}</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Nội dung modal */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Thông tin chung */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">{t("general_information")}</h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">{t("bill_id")}:</span> {selectedBill.id}
                                        </p>
                                        <p>
                                            <span className="font-medium">{t("created_date")}:</span>{" "}
                                            {formatDate(new Date(selectedBill.createdAt))}
                                        </p>
                                        <p>
                                            <span className="font-medium">{t("due_date")}:</span>{" "}
                                            {formatDate(new Date(selectedBill.dueDate))}
                                        </p>
                                        <p className="flex items-center">
                                            <span className="font-medium">{t("status")}:</span>
                                            <span
                                                className={`ml-2 px-2 py-1 rounded text-sm ${
                                                    selectedBill.status === "PAID"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {selectedBill.status === "PAID" ? t("paid") : t("pending_payment")}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Tổng tiền */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">{t("total")}</h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">{t("rental_amount")}:</span>{" "}
                                            {selectedBill.rentalAmount?.toLocaleString()} VNĐ
                                        </p>
                                        <p>
                                            <span className="font-medium">{t("service_total")}:</span>
                                            {selectedBill.serviceDetails
                                                .reduce((sum, service) => sum + service.totalPrice, 0)
                                                .toLocaleString()}{" "}
                                            VNĐ
                                        </p>
                                        <p className="text-xl font-bold mt-2">
                                            <span className="font-medium">{t("bill_total")}:</span>{" "}
                                            {selectedBill.totalAmount.toLocaleString()} VNĐ
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Chi tiết dịch vụ */}
                            <div className="mt-8">
                                <h3 className="font-semibold text-lg mb-4">{t("service_details")}</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left border-b">{t("service")}</th>
                                            <th className="px-4 py-2 text-right border-b">{t("quantity")}</th>
                                            <th className="px-4 py-2 text-right border-b">{t("unit_price")}</th>
                                            <th className="px-4 py-2 text-right border-b">{t("total_price")}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedBill.serviceDetails.map((service, index) => (
                                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="px-4 py-2 border-b">{service.name}</td>
                                                <td className="px-4 py-2 text-right border-b">{service.quantity}</td>
                                                <td className="px-4 py-2 text-right border-b">
                                                    {service.price.toLocaleString()} VNĐ
                                                </td>
                                                <td className="px-4 py-2 text-right border-b">
                                                    {service.totalPrice.toLocaleString()} VNĐ
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Footer modal */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    {t("close")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
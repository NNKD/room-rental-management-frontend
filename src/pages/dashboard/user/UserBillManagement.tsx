import DynamicTable from "../../../components/DynamicTable.tsx";
import { TableHeader, BillResponseDTO } from "../../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import axios from "axios";
import { envVar } from "../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../types/Context.ts";
import { useNotice } from "../../../hook/useNotice.ts";
import { getToken } from "../../../utils/TokenUtils.ts";
import { useLoading } from "../../../contexts/LoadingContext.tsx";
import { formatDate } from "../../../utils/DateProcess.ts";

export default function UserBillManagement() {
    const token = getToken();
    const [bills, setBills] = useState<BillResponseDTO[]>([]);
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();

    const headers: TableHeader<BillResponseDTO>[] = [
        { name: "ID Hóa đơn", slug: "id", center: true },
        { name: "Tên hóa đơn", slug: "name", center: true },
        { name: "Tổng tiền", slug: "totalAmount", center: true, render: (row) => `${row.totalAmount.toLocaleString()} VNĐ` },
        { name: "Ngày tạo", slug: "createdAt", center: true, render: (row) => formatDate(new Date(row.createdAt)) },
        { name: "Ngày đến hạn", slug: "dueDate", center: true, render: (row) => formatDate(new Date(row.dueDate)) },
        { name: "Trạng thái", slug: "status", center: true },
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
                console.log("Bills data:", response.data.data);
                const formattedBills = response.data.data.map((bill: BillResponseDTO) => ({
                    ...bill,
                    createdAt: new Date(bill.createdAt).toISOString(),
                    dueDate: new Date(bill.dueDate).toISOString(),
                }));
                setBills(formattedBills);
            } else {
                setMessage(response.data.message || "Không thể lấy danh sách hóa đơn");
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message ?? "Không rõ lỗi");
            } else {
                setMessage("Đã có lỗi xảy ra không xác định");
            }
            console.log(error);
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <h1 className="mb-8 font-bold text-2xl mt-16 lg:mt-0">Quản lý hóa đơn của tôi</h1>
            <DynamicTable headers={headers} data={bills} hasActionColumn={false} />
        </div>
    );
}
import DynamicTable from "../../components/DynamicTable.tsx";
import { TableHeader, RentalContractResponse, UserResponse, ApartmentStatusDTO } from "../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../types/Context.ts";
import { useNotice } from "../../hook/useNotice.ts";
import { useLoading } from "../../contexts/LoadingContext.tsx";

export default function RentalContract() {
    const [contracts, setContracts] = useState<RentalContractResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [apartments, setApartments] = useState<ApartmentStatusDTO[]>([]);
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<RentalContractResponse | null>(null);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        price: "",
        status: "ACTIVE",
        startDate: "",
        endDate: "",
        userId: "",
        apartmentId: "",
    });
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [deletingContractId, setDeletingContractId] = useState<string | null>(null);

    const fetchDropdownData = async () => {
        try {
            setApiLoading(true);
            const [usersRes, apartmentsRes] = await Promise.all([
                axios.get(`${envVar.API_URL}/auth/all-users`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
                }),
                axios.get(`${envVar.API_URL}/apartments/available?status=1`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
                }),
            ]);
            console.log("Users response:", usersRes.data.data);
            console.log("Apartments response:", apartmentsRes.data.data);
            setUsers(usersRes.data.data || []);
            setApartments(apartmentsRes.data.data || []);
            if (!apartmentsRes.data.data || apartmentsRes.data.data.length === 0) {
                setMessage("Không có căn hộ khả dụng");
                setType(NoticeType.WARNING);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            console.error("Fetch error:", axiosError);
            let errorMessage = "Không thể lấy dữ liệu người dùng hoặc căn hộ";
            if (axiosError.code === "ECONNREFUSED") {
                errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra backend.";
            } else if (axiosError.response?.status === 500) {
                errorMessage = "Lỗi server (500). Vui lòng kiểm tra log backend.";
            } else if (axiosError.response?.status === 400) {
                errorMessage = axiosError.response.data?.message || "Yêu cầu không hợp lệ";
            } else if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            }
            setMessage(errorMessage);
            setType(NoticeType.ERROR);
            setApartments([]);
            setUsers([]);
        } finally {
            setApiLoading(false);
        }
    };

    const handleGetContracts = async () => {
        try {
            setApiLoading(true);
            const response = await axios.get(`${envVar.API_URL}/dashboard/rental-contracts`, {
headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
});
console.log("API rental-contracts response:", response.data.data);
if (response.status === 200 && response.data.status === "success") {
    const formattedContracts = response.data.data.map((contract: RentalContractResponse) => ({
        ...contract,
        startDate: contract.startDate.includes("T") ? contract.startDate.split("T")[0] : contract.startDate,
        endDate: contract.endDate.includes("T") ? contract.endDate.split("T")[0] : contract.endDate,
        status: contract.status === "ACTIVE" ? "Hoạt động" :
            contract.status === "INACTIVE" ? "Không hoạt động" :
                contract.status === "EXPIRED" ? "Hết hạn" : contract.status,
    }));
    setContracts(formattedContracts);
} else {
    setMessage(response.data.message || "Không thể lấy danh sách hợp đồng");
    setType(NoticeType.ERROR);
}
} catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    setMessage(axiosError.response?.data?.message || "Đã có lỗi xảy ra khi lấy danh sách hợp đồng");
    setType(NoticeType.ERROR);
} finally {
    setApiLoading(false);
}
};

useEffect(() => {
    handleGetContracts();
    fetchDropdownData();
}, []);

const validateForm = () => {
    const { name, price, status, startDate, endDate, userId, apartmentId } = formData;

    if (!name || !price || !status || !startDate || !endDate || !userId || !apartmentId) {
        setMessage("Vui lòng điền đầy đủ thông tin bắt buộc");
        setType(NoticeType.ERROR);
        return false;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
        setMessage("Giá phải là số dương");
        setType(NoticeType.ERROR);
        return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
        setMessage("Ngày bắt đầu phải trước ngày kết thúc");
        setType(NoticeType.ERROR);
        return false;
    }

    if (!["ACTIVE", "INACTIVE", "EXPIRED"].includes(status)) {
        setMessage("Trạng thái không hợp lệ");
        setType(NoticeType.ERROR);
        return false;
    }

    const userIdNum = parseInt(userId);
    const apartmentIdNum = parseInt(apartmentId);
    if (isNaN(userIdNum) || isNaN(apartmentIdNum)) {
        setMessage("ID người dùng và ID căn hộ phải là số");
        setType(NoticeType.ERROR);
        return false;
    }

    return true;
};

const handleAddContract = () => {
    setEditingContract(null);
    setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
        status: "ACTIVE",
        startDate: "",
        endDate: "",
        userId: "",
        apartmentId: "",
    });
    setIsModalOpen(true);
};

const handleEditContract = async (id: string) => {
    const contract = contracts.find((c) => c.id.toString() === id);
    if (contract) {
        console.log("Contract userId:", contract.userId);
        console.log("Users list:", users);
        if (users.length === 0) {
            await fetchDropdownData();
        }
        if (!contract.userId) {
            setMessage(`Hợp đồng không có thông tin người dùng, sử dụng: ${contract.fullname} (${contract.email})`);
            setType(NoticeType.WARNING);
            setEditingContract(contract);
            setFormData({
                id: contract.id.toString(),
                name: contract.name,
                description: contract.description || "",
                price: contract.price.toString(),
                status: contract.status === "Hoạt động" ? "ACTIVE" :
                    contract.status === "Không hoạt động" ? "INACTIVE" :
                        contract.status === "Hết hạn" ? "EXPIRED" : contract.status,
                startDate: contract.startDate.includes("T") ? contract.startDate.split("T")[0] : contract.startDate,
                endDate: contract.endDate.includes("T") ? contract.endDate.split("T")[0] : contract.endDate,
                userId: "",
                apartmentId: contract.apartmentId?.toString() || "",
            });
            setIsModalOpen(true);
            return;
        }
        const userExists = users.find((user) => user.id.toString() === contract.userId.toString());
        if (!userExists) {
            setMessage(`Người dùng không tồn tại trong danh sách, sử dụng: ${contract.fullname} (${contract.email})`);
            setType(NoticeType.WARNING);
            setEditingContract(contract);
            setFormData({
                id: contract.id.toString(),
                name: contract.name,
                description: contract.description || "",
                price: contract.price.toString(),
                status: contract.status === "Hoạt động" ? "ACTIVE" :
                    contract.status === "Không hoạt động" ? "INACTIVE" :
                        contract.status === "Hết hạn" ? "EXPIRED" : contract.status,
                startDate: contract.startDate.includes("T") ? contract.startDate.split("T")[0] : contract.startDate,
                endDate: contract.endDate.includes("T") ? contract.endDate.split("T")[0] : contract.endDate,
                userId: "",
                apartmentId: contract.apartmentId?.toString() || "",
            });
            setIsModalOpen(true);
            return;
        }
        setEditingContract(contract);
        setFormData({
            id: contract.id.toString(),
            name: contract.name,
            description: contract.description || "",
            price: contract.price.toString(),
            status: contract.status === "Hoạt động" ? "ACTIVE" :
                contract.status === "Không hoạt động" ? "INACTIVE" :
                    contract.status === "Hết hạn" ? "EXPIRED" : contract.status,
            startDate: contract.startDate.includes("T") ? contract.startDate.split("T")[0] : contract.startDate,
            endDate: contract.endDate.includes("T") ? contract.endDate.split("T")[0] : contract.endDate,
            userId: contract.userId.toString(),
            apartmentId: contract.apartmentId?.toString() || "",
        });
        setIsModalOpen(true);
    }
};

const handleDeleteContract = (id: string) => {
    setDeletingContractId(id);
    setIsConfirmDeleteModalOpen(true);
};

const confirmDeleteContract = async () => {
    if (!deletingContractId) return;
    try {
        setApiLoading(true);
        const response = await axios.delete(`${envVar.API_URL}/dashboard/rental-contracts/${deletingContractId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
        });
        if (response.status === 200 && response.data.status === "success") {
            setMessage(response.data.message || "Xóa hợp đồng thành công");
            setType(NoticeType.SUCCESS);
            handleGetContracts();
        } else {
            setMessage(response.data.message || "Xóa hợp đồng thất bại");
            setType(NoticeType.ERROR);
        }
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message;
        setMessage(
            errorMessage === "rentalContractNotFound"
                ? "Hợp đồng thuê không tìm thấy"
                : "Đã có lỗi xảy ra khi xóa hợp đồng",
        );
        setType(NoticeType.ERROR);
    } finally {
        setApiLoading(false);
        setIsConfirmDeleteModalOpen(false);
        setDeletingContractId(null);
    }
};

const handleCancelDelete = () => {
    setIsConfirmDeleteModalOpen(false);
    setDeletingContractId(null);
};

const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { name, description, price, status, startDate, endDate, userId, apartmentId } = formData;
    const payload = {
        name,
        description: description || null,
        price: parseFloat(price),
        status,
        startDate: `${startDate}T00:00:00`,
        endDate: `${endDate}T00:00:00`,
        userId: parseInt(userId),
        apartmentId: parseInt(apartmentId),
    };

    try {
        setApiLoading(true);
        let response;
        if (editingContract) {
            response = await axios.put(`${envVar.API_URL}/dashboard/rental-contracts/${editingContract.id}`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
            });
        } else {
            response = await axios.post(`${envVar.API_URL}/dashboard/rental-contracts`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
            });
        }

        if (response.status === 200 && response.data.status === "success") {
            setMessage(response.data.message || (editingContract ? "Cập nhật hợp đồng thành công" : "Thêm hợp đồng thành công"));
            setType(NoticeType.SUCCESS);
            setIsModalOpen(false);
            setFormData({
                id: "",
                name: "",
                description: "",
                price: "",
                status: "ACTIVE",
                startDate: "",
                endDate: "",
                userId: "",
                apartmentId: "",
            });
            handleGetContracts();
        } else {
            setMessage(response.data.message || "Thao tác thất bại");
            setType(NoticeType.ERROR);
        }
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message;
        let displayMessage = "Đã có lỗi xảy ra";
        if (errorMessage) {
            switch (errorMessage) {
                case "greaterthan0":
                    displayMessage = "Giá phải lớn hơn 0";
                    break;
                case "userNotFound":
                    displayMessage = "Người dùng không tìm thấy";
                    break;
                case "apartmentNotFound":
                    displayMessage = "Căn hộ không tìm thấy";
                    break;
                case "rentalContractNotFound":
                    displayMessage = "Hợp đồng thuê không tìm thấy";
                    break;
                default:
                    displayMessage = errorMessage;
            }
        }
        setMessage(displayMessage);
        setType(NoticeType.ERROR);
    } finally {
        setApiLoading(false);
    }
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContract(null);
    setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
        status: "ACTIVE",
        startDate: "",
        endDate: "",
        userId: "",
        apartmentId: "",
    });
};

const tableHeaders: TableHeader<RentalContractResponse>[] = [
    { name: "Tên hợp đồng", slug: "name", sortASC: true, center: true },
    { name: "Giá", slug: "price", sortASC: true, center: true, isCurrency: true },
    { name: "Trạng thái", slug: "status", sortASC: true, center: true },
    {
        name: "Ngày bắt đầu",
        slug: "startDate",
        sortASC: true,
        center: true,
        render: (row) => {
            const date = new Date(row.startDate);
            return isNaN(date.getTime()) ? row.startDate : date.toLocaleDateString("vi-VN");
        },
    },
    {
        name: "Ngày kết thúc",
        slug: "endDate",
        sortASC: true,
        center: true,
        render: (row) => {
            const date = new Date(row.endDate);
            return isNaN(date.getTime()) ? row.endDate : date.toLocaleDateString("vi-VN");
        },
    },
    { name: "Người thuê", slug: "fullname", sortASC: true, center: true },
    { name: "Email", slug: "email", sortASC: true, center: true },
];

return (
    <div className="h-full flex flex-col overflow-hidden p-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Quản lý Hợp đồng Thuê</h2>
            <button
                className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddContract}
            >
                Thêm Hợp đồng
            </button>
        </div>
        <DynamicTable
            headers={tableHeaders}
            data={contracts}
            hasActionColumn={true}
            hasEdit={true}
            onEdit={handleEditContract}
            onDelete={handleDeleteContract}
        />
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-md w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">{editingContract ? "Sửa Hợp đồng" : "Thêm Hợp đồng"}</h3>
                    <form onSubmit={handleFormSubmit}>
                        {editingContract && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">ID Hợp đồng</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    readOnly
                                    className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Tên hợp đồng</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Mô tả</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Trạng thái</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            >
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="INACTIVE">Không hoạt động</option>
                                <option value="EXPIRED">Hết hạn</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Người thuê</label>
                            <select
                                name="userId"
                                value={formData.userId}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            >
                                <option value="">Chọn người dùng</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id.toString()}>
                                        {`${user.fullname} - ${user.phone}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Căn hộ</label>
                            <select
                                name="apartmentId"
                                value={formData.apartmentId}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            >
                                <option value="">Chọn căn hộ</option>
                                {apartments.map((apartment) => (
                                    <option key={apartment.id} value={apartment.id}>
                                        {`${apartment.name}`}
                                    </option>
                                ))}
                            </select>
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
                                {editingContract ? "Cập nhật" : "Thêm"}
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
                    <p className="mb-4">Bạn có chắc chắn muốn xóa hợp đồng này không?</p>
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
                            onClick={confirmDeleteContract}
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

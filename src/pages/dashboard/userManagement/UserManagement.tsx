import DynamicTable from "../../../components/DynamicTable.tsx";
import { TableHeader, UserManagementDTO } from "../../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../types/Context.ts";
import { useNotice } from "../../../hook/useNotice.ts";
import { useLoading } from "../../../contexts/LoadingContext.tsx";

export default function UserManagement() {
    const [users, setUsers] = useState<UserManagementDTO[]>([]);
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserManagementDTO | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullname: "",
        phone: "",
        role: "0",
    });
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    useEffect(() => {
        handleGetUsers();
    }, []);

    const handleGetUsers = async () => {
        try {
            setApiLoading(true);
            const response = await axios.get(`${envVar.API_URL}/auth/users`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.status === 200 && response.data.status === "success") {
                setUsers(response.data.data);
            } else {
                setMessage(response.data.message || "Không thể lấy danh sách người dùng");
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

    const validateForm = () => {
        const { email, username, fullname, phone, role } = formData;

        if (!email || !username || !fullname || !role) {
            setMessage("Vui lòng điền đầy đủ thông tin bắt buộc (Email, Tên đăng nhập, Họ và tên, Vai trò)");
            setType(NoticeType.ERROR);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Email không hợp lệ");
            setType(NoticeType.ERROR);
            return false;
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            setMessage("Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới");
            setType(NoticeType.ERROR);
            return false;
        }

        if (phone && !/^\d{10,11}$/.test(phone)) {
            setMessage("Số điện thoại phải có 10 hoặc 11 chữ số");
            setType(NoticeType.ERROR);
            return false;
        }

        const parsedRole = parseInt(role);
        if (isNaN(parsedRole) || ![0, 1].includes(parsedRole)) {
            setMessage("Vai trò phải là Người dùng (0) hoặc Admin (1)");
            setType(NoticeType.ERROR);
            return false;
        }

        return true;
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setFormData({ email: "", username: "", fullname: "", phone: "", role: "0" });
        setIsModalOpen(true);
    };

    const handleEditUser = (id: string) => {
        const user = users.find((u) => u.id.toString() === id);
        if (user) {
            setEditingUser(user);
            setFormData({
                email: user.email,
                username: user.username,
                fullname: user.fullname,
                phone: user.phone || "",
                role: user.role.toString(),
            });
            setIsModalOpen(true);
        }
    };

    const handleDeleteUser = (id: string) => {
        const user = users.find((u) => u.id.toString() === id);
        if (user && user.totalRentalContracts > 0) {
            setMessage("Không thể xóa người dùng có hợp đồng thuê đang hoạt động");
            setType(NoticeType.ERROR);
            return;
        }
        setDeletingUserId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!deletingUserId) return;
        try {
            setApiLoading(true);
            const response = await axios.delete(`${envVar.API_URL}/auth/${deletingUserId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.status === 200 && response.data.status === "success") {
                setMessage("Xóa người dùng thành công");
                setType(NoticeType.SUCCESS);
                handleGetUsers();
            } else {
                setMessage(response.data.message || "Xóa người dùng thất bại");
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

    const handleCancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setDeletingUserId(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const { email, username, fullname, phone, role } = formData;
        const parsedRole = parseInt(role);
        const payload = {
            email,
            username,
            fullname,
            phone: phone || null,
            role: parsedRole,
        };

        try {
            setApiLoading(true);
            let response;
            if (editingUser) {
                response = await axios.put(`${envVar.API_URL}/auth/${editingUser.id}`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            } else {
                response = await axios.post(`${envVar.API_URL}/auth`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            }

            if (response.status === 200 && response.data.status === "success") {
                setMessage(editingUser ? "Cập nhật người dùng thành công" : "Thêm người dùng thành công");
                setType(NoticeType.SUCCESS);
                setIsModalOpen(false);
                setFormData({ email: "", username: "", fullname: "", phone: "", role: "0" });
                handleGetUsers();
            } else {
                setMessage(response.data.message || "Thao tác thất bại");
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const errorMessage = axiosError.response?.data?.message;
            if (errorMessage === "userNameExists") {
                setMessage("Tên đăng nhập đã tồn tại");
            } else if (errorMessage === "emailExists") {
                setMessage("Email đã tồn tại");
            } else {
                setMessage(errorMessage || "Đã có lỗi xảy ra");
            }
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ email: "", username: "", fullname: "", phone: "", role: "0" });
    };

    const tableHeaders: TableHeader<UserManagementDTO>[] = [
        { name: "Email", slug: "email", sortASC: true, center: true },
        { name: "Tên đăng nhập", slug: "username", sortASC: true, center: true },
        { name: "Họ và tên", slug: "fullname", sortASC: true, center: true },
        { name: "Số điện thoại", slug: "phone", sortASC: true, center: true },
        { name: "Số hợp đồng thuê", slug: "totalRentalContracts", sortASC: true, center: true },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
                <button
                    className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAddUser}
                >
                    Thêm Người dùng
                </button>
            </div>
            <DynamicTable
                headers={tableHeaders}
                data={users}
                hasActionColumn={true}
                hasEdit={true}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
            />
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            {editingUser ? "Sửa Người dùng" : "Thêm Người dùng"}
                        </h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Họ và tên</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Vai trò</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                >
                                    <option value="0">Người dùng</option>
                                    <option value="1">Admin</option>
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
                                    {editingUser ? "Cập nhật" : "Thêm"}
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
                        <p className="mb-4">Bạn có chắc chắn muốn xóa người dùng này không?</p>
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
                                onClick={confirmDeleteUser}
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
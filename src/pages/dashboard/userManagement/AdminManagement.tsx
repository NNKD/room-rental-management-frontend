import DynamicTable from "../../../components/DynamicTable.tsx";
import { TableHeader, UserManagementDTO } from "../../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import axios from "axios";
import { envVar } from "../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../types/Context.ts";
import { useNotice } from "../../../hook/useNotice.ts";

export default function AdminManagement() {
    const [admins, setAdmins] = useState<UserManagementDTO[]>([]);
    const { setMessage, setType } = useNotice();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<UserManagementDTO | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullname: "",
        phone: "",
        role: "1",
    });
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

    useEffect(() => {
        handleGetAdmins();
    }, []);

    const handleGetAdmins = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/auth/admins`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm nếu cần
                },
            });
            console.log("API Response:", response.data); // Debug
            if (response.status === 200 && response.data.status === "success") {
                setAdmins(response.data.data);
            } else {
                setMessage("Không thể lấy danh sách admin");
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            console.error("API Error:", error);
            setMessage("Đã có lỗi xảy ra: " + error);
            setType(NoticeType.ERROR);
        }
    };

    const handleAddAdmin = () => {
        setEditingAdmin(null);
        setFormData({ email: "", username: "", fullname: "", phone: "", role: "1" });
        setIsModalOpen(true);
    };

    const handleEditAdmin = (id: string) => {
        const admin = admins.find((a) => a.id.toString() === id);
        if (admin) {
            setEditingAdmin(admin);
            setFormData({
                email: admin.email,
                username: admin.username,
                fullname: admin.fullname,
                phone: admin.phone || "",
                role: admin.role.toString(),
            });
            setIsModalOpen(true);
        }
    };

    const handleDeleteAdmin = (id: string) => {
        setDeletingAdminId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDeleteAdmin = async () => {
        if (!deletingAdminId) return;
        try {
            const response = await axios.delete(`${envVar.API_URL}/auth/users/${deletingAdminId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm nếu cần
                },
            });
            if (response.status === 200 && response.data.status === "success") {
                setMessage("Xóa admin thành công");
                setType(NoticeType.SUCCESS);
                handleGetAdmins();
            }
        } catch (error) {
            console.error(error);
            setMessage("Đã có lỗi xảy ra: " + error);
            setType(NoticeType.ERROR);
        } finally {
            setIsConfirmDeleteModalOpen(false);
            setDeletingAdminId(null);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setDeletingAdminId(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { email, username, fullname, phone, role } = formData;
        if (!email || !username || !fullname || !role) {
            setMessage("Vui lòng điền đầy đủ thông tin bắt buộc");
            setType(NoticeType.ERROR);
            return;
        }

        const parsedRole = parseInt(role);
        if (isNaN(parsedRole) || parsedRole !== 1) {
            setMessage("Vai trò phải là Admin (1)");
            setType(NoticeType.ERROR);
            return;
        }

        const payload = {
            email,
            username,
            fullname,
            phone: phone || null,
            role: parsedRole,
        };

        try {
            if (editingAdmin) {
                const response = await axios.put(`${envVar.API_URL}/auth/users/${editingAdmin.id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm nếu cần
                    },
                });
                if (response.status === 200 && response.data.status === "success") {
                    setMessage("Cập nhật admin thành công");
                    setType(NoticeType.SUCCESS);
                }
            } else {
                const response = await axios.post(`${envVar.API_URL}/auth/users`, payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm nếu cần
                    },
                });
                if (response.status === 200 && response.data.status === "success") {
                    setMessage("Thêm admin thành công");
                    setType(NoticeType.SUCCESS);
                }
            }
            setIsModalOpen(false);
            setFormData({ email: "", username: "", fullname: "", phone: "", role: "1" });
            handleGetAdmins();
        } catch (error) {
            console.error(error);
            setMessage("Đã có lỗi xảy ra: " + error);
            setType(NoticeType.ERROR);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ email: "", username: "", fullname: "", phone: "", role: "1" });
    };

    const tableHeaders: TableHeader<UserManagementDTO>[] = [
        // { name: "ID", slug: "id", sortASC: true, center: true },
        { name: "Email", slug: "email", sortASC: true, center: true },
        { name: "Tên đăng nhập", slug: "username", sortASC: true, center: true },
        { name: "Họ và tên", slug: "fullname", sortASC: true, center: true },
        { name: "Số điện thoại", slug: "phone", sortASC: true, center: true },
        { name: "Số hợp đồng thuê", slug: "totalRentalContracts", sortASC: true, center: true },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản lý Admin</h2>
                <button
                    className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAddAdmin}
                >
                    Thêm Admin
                </button>
            </div>
            <DynamicTable
                headers={tableHeaders}
                data={admins}
                hasActionColumn={true}
                hasEdit={true}
                onEdit={handleEditAdmin}
                onDelete={handleDeleteAdmin}
            />
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            {editingAdmin ? "Sửa Admin" : "Thêm Admin"}
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
                                    disabled
                                >
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
                                    {editingAdmin ? "Cập nhật" : "Thêm"}
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
                        <p className="mb-4">Bạn có chắc chắn muốn xóa admin này không?</p>
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
                                onClick={confirmDeleteAdmin}
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
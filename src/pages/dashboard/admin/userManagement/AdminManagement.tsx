import DynamicTable from "../../../../components/DynamicTable.tsx";
import { TableHeader, UserManagementDTO } from "../../../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../../types/Context.ts";
import { useNotice } from "../../../../hook/useNotice.ts";
import { useLoading } from "../../../../contexts/LoadingContext.tsx";
import { useTranslation } from "react-i18next";

export default function AdminManagement() {
    const [admins, setAdmins] = useState<UserManagementDTO[]>([]);
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();
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
    const { t } = useTranslation();

    useEffect(() => {
        handleGetAdmins();
    }, []);

    const handleGetAdmins = async () => {
        try {
            setApiLoading(true);
            const response = await axios.get(`${envVar.API_URL}/auth/admins`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.status === 200 && response.data.status === "success") {
                setAdmins(response.data.data);
            } else {
                setMessage(response.data.message || t("cannot_fetch_admins"));
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || t("unknown_error"));
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    const validateForm = () => {
        const { email, username, fullname, phone, role } = formData;

        if (!email || !username || !fullname || !role) {
            setMessage(t("please_fill_required_fields"));
            setType(NoticeType.ERROR);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage(t("invalid_email"));
            setType(NoticeType.ERROR);
            return false;
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            setMessage(t("invalid_username"));
            setType(NoticeType.ERROR);
            return false;
        }

        if (phone && !/^\d{10,11}$/.test(phone)) {
            setMessage(t("invalid_phone_number"));
            setType(NoticeType.ERROR);
            return false;
        }

        const parsedRole = parseInt(role);
        if (isNaN(parsedRole) || parsedRole !== 1) {
            setMessage(t("invalid_role_admin"));
            setType(NoticeType.ERROR);
            return false;
        }

        return true;
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
        const admin = admins.find((a) => a.id.toString() === id);
        if (admin && admin.totalRentalContracts > 0) {
            setMessage(t("cannot_delete_admin_with_contracts"));
            setType(NoticeType.ERROR);
            return;
        }
        setDeletingAdminId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDeleteAdmin = async () => {
        if (!deletingAdminId) return;
        try {
            setApiLoading(true);
            const response = await axios.delete(`${envVar.API_URL}/auth/${deletingAdminId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.status === 200 && response.data.status === "success") {
                setMessage(t("admin_deleted_success"));
                setType(NoticeType.SUCCESS);
                handleGetAdmins();
            } else {
                setMessage(response.data.message || t("admin_delete_failed"));
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || t("unknown_error"));
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setDeletingAdminId(null);
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
            if (editingAdmin) {
                response = await axios.put(`${envVar.API_URL}/auth/${editingAdmin.id}`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            } else {
                response = await axios.post(`${envVar.API_URL}/auth`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            }

            if (response.status === 200 && response.data.status === "success") {
                setMessage(editingAdmin ? t("admin_updated_success") : t("admin_added_success"));
                setType(NoticeType.SUCCESS);
                setIsModalOpen(false);
                setFormData({ email: "", username: "", fullname: "", phone: "", role: "1" });
                handleGetAdmins();
            } else {
                setMessage(response.data.message || t("operation_failed"));
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const errorMessage = axiosError.response?.data?.message;
            if (errorMessage === "userNameExists") {
                setMessage(t("username_exists"));
            } else if (errorMessage === "emailExists") {
                setMessage(t("email_exists"));
            } else {
                setMessage(errorMessage || t("unknown_error"));
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
        setEditingAdmin(null);
        setFormData({ email: "", username: "", fullname: "", phone: "", role: "1" });
    };

    const tableHeaders: TableHeader<UserManagementDTO>[] = [
        { name: t("email"), slug: "email", sortASC: true, center: true },
        { name: t("username"), slug: "username", sortASC: true, center: true },
        { name: t("fullname"), slug: "fullname", sortASC: true, center: true },
        { name: t("phone"), slug: "phone", sortASC: true, center: true },
        { name: t("total_rental_contracts"), slug: "totalRentalContracts", sortASC: true, center: true },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{t("admin_management")}</h2>
                <button
                    className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAddAdmin}
                >
                    {t("add_admin")}
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
                            {editingAdmin ? t("edit_admin") : t("add_admin")}
                        </h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">{t("email")}</label>
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
                                <label className="block text-sm font-medium mb-1">{t("username")}</label>
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
                                <label className="block text-sm font-medium mb-1">{t("fullname")}</label>
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
                                <label className="block text-sm font-medium mb-1">{t("phone")}</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">{t("role")}</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                    disabled
                                >
                                    <option value="1">{t("admin")}</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={handleCloseModal}
                                >
                                    {t("cancel")}
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {editingAdmin ? t("update") : t("add")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isConfirmDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{t("confirm_delete")}</h3>
                        <p className="mb-4">{t("confirm_delete_admin_message")}</p>
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
                                onClick={confirmDeleteAdmin}
                            >
                                {t("yes")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import DynamicTable from "../../../components/DynamicTable.tsx";
import {
    TableHeader,
    RentalContractResponse,
    UserResponse,
    ApartmentStatusDTO,
} from "../../../types/Dashboard.ts";
import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../types/Context.ts";
import { useNotice } from "../../../hook/useNotice.ts";
import { useLoading } from "../../../contexts/LoadingContext.tsx";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const fetchDropdownData = useCallback(async () => {
        try {
            setApiLoading(true);
            const [usersRes, apartmentsRes] = await Promise.all([
                axios.get(`${envVar.API_URL}/auth/users`, {
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
                setMessage(t("no_available_apartments"));
                setType(NoticeType.WARNING);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            console.error("Fetch error:", axiosError);
            let errorMessage = t("cannot_fetch_user_or_apartment");
            if (axiosError.code === "ECONNREFUSED") {
                errorMessage = t("cannot_connect_to_server");
            } else if (axiosError.response?.status === 500) {
                errorMessage = t("server_error_500");
            } else if (axiosError.response?.status === 400) {
                errorMessage = axiosError.response.data?.message || t("invalid_request");
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
    }, [setApiLoading, setMessage, setType]);

    const handleGetContracts = useCallback(async () => {
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
                    status: contract.status === "ACTIVE" ? t("active") :
                        contract.status === "INACTIVE" ? t("inactive") :
                            contract.status === "EXPIRED" ? t("expired") : contract.status,
                }));
                setContracts(formattedContracts);
            } else {
                setMessage(response.data.message || t("cannot_fetch_contracts"));
                setType(NoticeType.ERROR);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || t("unknown_error_fetch_contracts"));
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    }, [setApiLoading, setMessage, setType]);

    useEffect(() => {
        handleGetContracts();
        fetchDropdownData();
    }, [handleGetContracts, fetchDropdownData]);

    const validateForm = () => {
        const { name, price, status, startDate, endDate, userId, apartmentId } = formData;

        if (!name || !price || !status || !startDate || !endDate || !userId || !apartmentId) {
            setMessage(t("please_fill_all_fields"));
            setType(NoticeType.ERROR);
            return false;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            setMessage(t("price_must_be_positive"));
            setType(NoticeType.ERROR);
            return false;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            setMessage(t("start_date_before_end_date"));
            setType(NoticeType.ERROR);
            return false;
        }

        if (!["ACTIVE", "INACTIVE", "EXPIRED"].includes(status)) {
            setMessage(t("invalid_status"));
            setType(NoticeType.ERROR);
            return false;
        }

        const userIdNum = parseInt(userId);
        const apartmentIdNum = parseInt(apartmentId);
        if (isNaN(userIdNum) || isNaN(apartmentIdNum)) {
            setMessage(t("invalid_user_or_apartment_id"));
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
                setMessage(t("contract_no_user_info", { fullname: contract.fullname, email: contract.email }));
                setType(NoticeType.WARNING);
                setEditingContract(contract);
                setFormData({
                    id: contract.id.toString(),
                    name: contract.name,
                    description: contract.description || "",
                    price: contract.price.toString(),
                    status: contract.status === t("active") ? "ACTIVE" :
                        contract.status === t("inactive") ? "INACTIVE" :
                            contract.status === t("expired") ? "EXPIRED" : contract.status,
                    startDate: contract.startDate,
                    endDate: contract.endDate,
                    userId: "",
                    apartmentId: contract.apartmentId?.toString() || "",
                });
                setIsModalOpen(true);
                return;
            }
            const userExists = users.find((user) => user.id.toString() === contract.userId.toString());
            if (!userExists) {
                setMessage(t("user_not_in_list", { fullname: contract.fullname, email: contract.email }));
                setType(NoticeType.WARNING);
                setEditingContract(contract);
                setFormData({
                    id: contract.id.toString(),
                    name: contract.name,
                    description: contract.description || "",
                    price: contract.price.toString(),
                    status: contract.status === t("active") ? "ACTIVE" :
                        contract.status === t("inactive") ? "INACTIVE" :
                            contract.status === t("expired") ? "EXPIRED" : contract.status,
                    startDate: contract.startDate,
                    endDate: contract.endDate,
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
                status: contract.status === t("active") ? "ACTIVE" :
                    contract.status === t("inactive") ? "INACTIVE" :
                        contract.status === t("expired") ? "EXPIRED" : contract.status,
                startDate: contract.startDate,
                endDate: contract.endDate,
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
                setMessage(response.data.message || t("contract_deleted_success"));
                setType(NoticeType.SUCCESS);
                handleGetContracts();
            } else {
                setMessage(response.data.message || t("contract_delete_failed"));
                setType(NoticeType.ERROR);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const errorMessage = axiosError.response?.data?.message;
            setMessage(
                errorMessage === "rentalContractNotFound"
                    ? t("contract_not_found")
                    : t("unknown_error_delete_contract"),
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
                setMessage(response.data.message || (editingContract ? t("contract_updated_success") : t("contract_added_success")));
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
                setMessage(response.data.message || t("operation_failed"));
                setType(NoticeType.ERROR);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const errorMessage = axiosError.response?.data?.message;
            let displayMessage = t("unknown_error");
            if (errorMessage) {
                switch (errorMessage) {
                    case "greaterthan0":
                        displayMessage = t("price_must_be_positive");
                        break;
                    case "userNotFound":
                        displayMessage = t("user_not_found");
                        break;
                    case "apartmentNotFound":
                        displayMessage = t("apartment_not_found");
                        break;
                    case "rentalContractNotFound":
                        displayMessage = t("contract_not_found");
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
        { name: t("contract_name"), slug: "name", sortASC: true, center: true },
        { name: t("price"), slug: "price", sortASC: true, center: true, isCurrency: true },
        { name: t("status"), slug: "status", sortASC: true, center: true },
        {
            name: t("start_date"),
            slug: "startDate",
            sortASC: true,
            center: true,
            render: (row) => {
                const date = new Date(row.startDate);
                return isNaN(date.getTime()) ? row.startDate : date.toLocaleDateString("vi-VN");
            },
        },
        {
            name: t("end_date"),
            slug: "endDate",
            sortASC: true,
            center: true,
            render: (row) => {
                const date = new Date(row.endDate);
                return isNaN(date.getTime()) ? row.endDate : date.toLocaleDateString("vi-VN");
            },
        },
        { name: t("tenant"), slug: "fullname", sortASC: true, center: true },
        { name: t("email"), slug: "email", sortASC: true, center: true },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{t("rental_contract_management")}</h2>
                <button
                    className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAddContract}
                >
                    {t("add_contract")}
                </button>
            </div>
            <DynamicTable<RentalContractResponse> // Thêm kiểu generic
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
                        <h3 className="text-xl font-bold mb-4">{editingContract ? t("edit_contract") : t("add_contract")}</h3>
                        <form onSubmit={handleFormSubmit}>
                            {editingContract && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">{t("contract_id")}</label>
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
                                <label className="block text-sm font-medium mb-1">{t("contract_name")}</label>
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
                                <label className="block text-sm font-medium mb-1">{t("description")}</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">{t("price_vnd")}</label>
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
                                <label className="block text-sm font-medium mb-1">{t("status")}</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                >
                                    <option value="ACTIVE">{t("active")}</option>
                                    <option value="INACTIVE">{t("inactive")}</option>
                                    <option value="EXPIRED">{t("expired")}</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">{t("start_date")}</label>
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
                                <label className="block text-sm font-medium mb-1">{t("end_date")}</label>
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
                                <label className="block text-sm font-medium mb-1">{t("tenant")}</label>
                                <select
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                >
                                    <option value="">{t("select_user")}</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id.toString()}>
                                            {`${user.fullname} - ${user.phone}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">{t("apartment")}</label>
                                <select
                                    name="apartmentId"
                                    value={formData.apartmentId}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                >
                                    <option value="">{t("select_apartment")}</option>
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
                                    {t("cancel")}
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {editingContract ? t("update") : t("add")}
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
                        <p className="mb-4">{t("confirm_delete_contract_message")}</p>
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
                                onClick={confirmDeleteContract}
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
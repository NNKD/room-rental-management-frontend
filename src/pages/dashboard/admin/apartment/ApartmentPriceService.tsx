import DynamicTable from "../../../../components/DynamicTable.tsx";
import { ApartmentPriceServiceType, ServiceDTO, ServiceType, TableHeader } from "../../../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../../types/Context.ts";
import { formatCurrency } from "../../../../utils/NumberCalculate.ts";
import { useNotice } from "../../../../hook/useNotice.ts";
import { getToken } from "../../../../utils/TokenUtils.ts";

export default function ApartmentPriceService() {
    const [services, setServices] = useState<ServiceDTO[]>([]);
    const { setMessage, setType } = useNotice();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceDTO | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        unitSuffix: "",
    });
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const token = getToken();

    useEffect(() => {
        handleGetServices();
    }, []);

    const handleGetServices = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${envVar.API_URL}/services`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                const serviceNormalize = response.data.data.map((s: ServiceType) => {
                    const rawPrice = Number(s.price);
                    return {
                        ...s,
                        rawPrice: isNaN(rawPrice) ? 0 : rawPrice,
                        price: formatCurrency(rawPrice),
                    };
                });
                setServices(serviceNormalize);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Không thể lấy danh sách dịch vụ");
            setType(NoticeType.ERROR);
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = () => {
        setEditingService(null);
        setFormData({ name: "", description: "", price: "", unitSuffix: "" });
        setIsModalOpen(true);
    };

    const handleEditService = (id: string) => {
        const service = services.find((s) => s.id.toString() === id);
        if (service) {
            setEditingService(service);
            const unitSuffix = service.unit.startsWith("VNĐ") ? service.unit.slice(3) : service.unit;
            setFormData({
                name: service.name,
                description: service.description,
                price: service.rawPrice.toString(),
                unitSuffix,
            });
            setIsModalOpen(true);
        }
    };

    const handleDeleteService = (id: string) => {
        setDeletingServiceId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDeleteService = async () => {
        if (!deletingServiceId) return;
        setLoading(true);
        try {
            const response = await axios.delete(`${envVar.API_URL}/services/${deletingServiceId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setMessage("Xóa dịch vụ thành công");
                setType(NoticeType.SUCCESS);
                handleGetServices();
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Không thể xóa dịch vụ");
            setType(NoticeType.ERROR);
        } finally {
            setLoading(false);
            setIsConfirmDeleteModalOpen(false);
            setDeletingServiceId(null);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setDeletingServiceId(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, description, price, unitSuffix } = formData;
        if (!name || !description || !price || !unitSuffix) {
            setMessage("Vui lòng điền đầy đủ thông tin");
            setType(NoticeType.ERROR);
            return;
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            setMessage("Giá phải là một số hợp lệ và không âm");
            setType(NoticeType.ERROR);
            return;
        }

        const payload = {
            name,
            description,
            price: parsedPrice,
            unit: `VNĐ/${unitSuffix}`,
        };

        setLoading(true);
        try {
            if (editingService) {
                const response = await axios.put(`${envVar.API_URL}/services/${editingService.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                    setMessage("Cập nhật dịch vụ thành công");
                    setType(NoticeType.SUCCESS);
                }
            } else {
                const response = await axios.post(`${envVar.API_URL}/services`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                    setMessage("Thêm dịch vụ thành công");
                    setType(NoticeType.SUCCESS);
                }
            }
            setIsModalOpen(false);
            setFormData({ name: "", description: "", price: "", unitSuffix: "" });
            handleGetServices();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Không thể lưu dịch vụ");
            setType(NoticeType.ERROR);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: "", description: "", price: "", unitSuffix: "" });
        setEditingService(null);
    };

    const tableHeaders: TableHeader<ApartmentPriceServiceType>[] = [
        { name: "Tên dịch vụ", slug: "name", sortASC: true, center: true },
        { name: "Mô tả", slug: "description", sortASC: true, center: true },
        { name: "Giá (VNĐ)", slug: "price", sortASC: true, center: true },
        { name: "Đơn vị tính", slug: "unit", sortASC: true, center: true },
    ];

    if (loading) {
        return <div className="flex justify-center items-center h-full">Đang tải...</div>;
    }

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <div className="flex justify-end items-center mb-4">
                <button
                    className="bg-lightGreen text-black font-bold px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAddService}
                >
                    Thêm Dịch Vụ
                </button>
            </div>
            <DynamicTable
                headers={tableHeaders}
                data={services}
                hasActionColumn={true}
                hasEdit={true}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
            />
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            {editingService ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ"}
                        </h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Tên dịch vụ</label>
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
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Giá</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Đơn vị</label>
                                <div className="flex items-center">
                                    <span className="inline-block bg-gray-100 border border-gray-300 p-2 rounded-l text-gray-700">
                                        VNĐ
                                    </span>
                                    <input
                                        type="text"
                                        name="unitSuffix"
                                        value={formData.unitSuffix}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded-r border-l-0"
                                        placeholder="tháng, lần, ..."
                                        required
                                    />
                                </div>
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
                                    {editingService ? "Cập nhật" : "Thêm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isConfirmDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Xác nhận xóa</h3>
                        <p className="mb-4">Bạn có chắc chắn muốn xóa dịch vụ này không?</p>
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
                                onClick={confirmDeleteService}
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
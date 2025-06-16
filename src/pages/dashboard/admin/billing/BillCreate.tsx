import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../../types/Context.ts";
import { useNotice } from "../../../../hook/useNotice.ts";
import { useLoading } from "../../../../contexts/LoadingContext.tsx";
import DynamicTable from "../../../../components/DynamicTable.tsx";
import { TableHeader, RentalContractResponse, ServiceDTO } from "../../../../types/Dashboard.ts";

// Interface cho dịch vụ đã chọn để hiển thị trong bảng
interface SelectedServiceDisplay {
    id: number;
    name: string;
    description: string;
    price: number;
    unit: string;
    quantity: number;
    totalPrice: number;
}

export default function BillCreate() {
    const [formData, setFormData] = useState({
        rentalContractId: "",
    });
    const [contracts, setContracts] = useState<RentalContractResponse[]>([]);
    const [services, setServices] = useState<ServiceDTO[]>([]);
    const [selectedServices, setSelectedServices] = useState<{ id: number; quantity: number }[]>([]);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();

    // Lấy danh sách hợp đồng đang hoạt động
    const fetchActiveContracts = async () => {
        try {
            setApiLoading(true);
            const response = await axios.get(`${envVar.API_URL}/dashboard/rental-contracts`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
            });
            if (response.status === 200 && response.data.status === "success") {
                const activeContracts = response.data.data
                    .filter((contract: RentalContractResponse) => contract.status === "ACTIVE")
                    .map((contract: RentalContractResponse) => ({
                        ...contract,
                        startDate: contract.startDate.includes("T") ? contract.startDate.split("T")[0] : contract.startDate,
                        endDate: contract.endDate.includes("T") ? contract.endDate.split("T")[0] : contract.endDate,
                    }));
                setContracts(activeContracts);
            } else {
                setMessage(response.data.message || "Không thể lấy danh sách hợp đồng");
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

    // Lấy danh sách dịch vụ
    const fetchServices = async () => {
        try {
            setApiLoading(true);
            const response = await axios.get(`${envVar.API_URL}/services`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
            });
            console.log("API Services Response:", response.data);
            if (response.status === 200 && response.data.status === "success") {
                const mappedServices: ServiceDTO[] = response.data.data.map((service: ServiceDTO) => ({
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    price: service.price,
                    rawPrice: service.price,
                    unit: service.unit || "",
                }));
                setServices(mappedServices);
            } else {
                setMessage(response.data.message || "Không thể lấy danh sách dịch vụ");
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            console.error("API Services Error:", axiosError);
            setMessage(axiosError.response?.data?.message || "Đã có lỗi xảy ra");
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveContracts();
        fetchServices();
    }, []);

    // Tạo dữ liệu cho bảng dịch vụ đã chọn
    const getSelectedServicesForTable = (): SelectedServiceDisplay[] => {
        return selectedServices.map((selectedService) => {
            const service = services.find((s) => s.id === selectedService.id);
            if (!service) return null;

            return {
                id: service.id,
                name: service.name,
                description: service.description,
                price: service.price,
                unit: service.unit,
                quantity: selectedService.quantity,
                totalPrice: service.price * selectedService.quantity,
            };
        }).filter(Boolean) as SelectedServiceDisplay[];
    };

    // Tính tổng tiền
    const getTotalAmount = (): number => {
        return getSelectedServicesForTable().reduce((total, service) => total + service.totalPrice, 0);
    };

    const handleSelectContract = (id: string) => {
        setFormData((prev) => ({ ...prev, rentalContractId: id }));
        setIsContractModalOpen(false);
        setIsServiceModalOpen(true);
    };

    const handleServiceQuantityChange = (serviceId: number, quantity: number) => {
        setSelectedServices((prev) => {
            const existing = prev.find((s) => s.id === serviceId);
            if (existing) {
                if (quantity <= 0) {
                    return prev.filter((s) => s.id !== serviceId);
                }
                return prev.map((s) => (s.id === serviceId ? { ...s, quantity } : s));
            }
            return [...prev, { id: serviceId, quantity }];
        });
    };

    // Xóa dịch vụ khỏi danh sách đã chọn
    const handleRemoveService = (serviceId: number) => {
        setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
    };

    const handleCreateBill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.rentalContractId) {
            setMessage("Vui lòng chọn hợp đồng thuê");
            setType(NoticeType.ERROR);
            return;
        }
        if (selectedServices.length === 0) {
            setMessage("Vui lòng chọn ít nhất một dịch vụ");
            setType(NoticeType.ERROR);
            return;
        }

        try {
            setApiLoading(true);

            // Gộp hai bước thành một yêu cầu duy nhất
            const payload = {
                rentalContractId: parseInt(formData.rentalContractId),
                serviceDetails: selectedServices.map((s) => ({
                    serviceId: s.id,
                    quantity: s.quantity,
                    price: services.find((srv) => srv.id === s.id)?.price || 0,
                    totalPrice: (services.find((srv) => srv.id === s.id)?.price || 0) * s.quantity,
                })),
            };
            const response = await axios.post(
                `${envVar.API_URL}/dashboard/billing/create/${formData.rentalContractId}`,
                payload,
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` } }
            );
            if (response.status === 200) {
                setMessage("Tạo hóa đơn thành công");
                setType(NoticeType.SUCCESS);
                setFormData({ rentalContractId: "" });
                setSelectedServices([]);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, rentalContractId: value }));
    };

    const contractTableHeaders: TableHeader<RentalContractResponse>[] = [
        { name: "Tên căn hộ", slug: "name", sortASC: true, center: true },
        { name: "Người thuê", slug: "fullname", sortASC: true, center: true },
        { name: "Loại hợp đồng", slug: "description", sortASC: true, center: true },
        {
            name: "Ngày bắt đầu",
            slug: "startDate",
            sortASC: true,
            center: true,
            render: (row) => new Date(row.startDate).toLocaleDateString("vi-VN"),
        },
        {
            name: "Ngày kết thúc",
            slug: "endDate",
            sortASC: true,
            center: true,
            render: (row) => new Date(row.endDate).toLocaleDateString("vi-VN"),
        },
    ];

    const serviceTableHeaders: TableHeader<ServiceDTO>[] = [
        { name: "Tên dịch vụ", slug: "name", sortASC: true, center: true },
        { name: "Mô tả", slug: "description", sortASC: true, center: true },
        {
            name: "Giá",
            slug: "price",
            sortASC: true,
            center: true,
            render: (row) => `${row.price.toLocaleString()} VNĐ`,
        },
        { name: "Đơn vị", slug: "unit", sortASC: true, center: true },
        {
            name: "Số lượng",
            slug: "id",
            sortASC: false,
            center: true,
            render: (row) => (
                <input
                    type="number"
                    min="0"
                    className="border border-gray-300 p-1 rounded w-20 text-center"
                    value={selectedServices.find((s) => s.id === row.id)?.quantity || 0}
                    onChange={(e) => handleServiceQuantityChange(row.id, parseInt(e.target.value) || 0)}
                />
            ),
        },
    ];

    // Headers cho bảng dịch vụ đã chọn
    const selectedServiceTableHeaders: TableHeader<SelectedServiceDisplay>[] = [
        { name: "Tên dịch vụ", slug: "name", sortASC: true, center: true },
        { name: "Mô tả", slug: "description", sortASC: true, center: true },
        {
            name: "Đơn giá",
            slug: "price",
            sortASC: true,
            center: true,
            render: (row) => `${row.price.toLocaleString()} VNĐ`,
        },
        { name: "Đơn vị", slug: "unit", sortASC: true, center: true },
        {
            name: "Số lượng",
            slug: "quantity",
            sortASC: true,
            center: true,
            render: (row) => (
                <span className="font-semibold text-blue-600">{row.quantity}</span>
            ),
        },
        {
            name: "Thành tiền",
            slug: "totalPrice",
            sortASC: true,
            center: true,
            render: (row) => (
                <span className="font-semibold text-green-600">
                    {row.totalPrice.toLocaleString()} VNĐ
                </span>
            ),
        },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Tạo Hóa đơn Hàng Tháng</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form tạo hóa đơn */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Thông tin hóa đơn</h3>
                    <form onSubmit={handleCreateBill}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">ID Hợp đồng thuê</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    name="rentalContractId"
                                    value={formData.rentalContractId}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    readOnly
                                    placeholder="Chưa chọn hợp đồng"
                                />
                                <button
                                    type="button"
                                    className="bg-lightGreen text-white px-6 py-2 rounded hover:bg-lightGreenHover whitespace-nowrap"
                                    onClick={() => setIsContractModalOpen(true)}
                                >
                                    {formData.rentalContractId ? "Chọn lại" : "Chọn hợp đồng"}
                                </button>
                            </div>
                        </div>

                        {/* Tổng tiền */}
                        {selectedServices.length > 0 && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Tổng tiền:</span>
                                    <span className="text-green-600">{getTotalAmount().toLocaleString()} VNĐ</span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => {
                                    setFormData({ rentalContractId: "" });
                                    setSelectedServices([]);
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-lightGreenHover"
                                disabled={!formData.rentalContractId || selectedServices.length === 0}
                            >
                                Tạo Hóa đơn
                            </button>
                        </div>
                    </form>
                </div>

                {/* Bảng dịch vụ đã chọn */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Dịch vụ đã chọn</h3>
                        <button
                            type="button"
                            className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-lightGreenHover"
                            onClick={() => setIsServiceModalOpen(true)}
                            disabled={!formData.rentalContractId}
                        >
                            {selectedServices.length > 0 ? "Cập nhật dịch vụ" : "Chọn dịch vụ"}
                        </button>
                    </div>

                    {selectedServices.length > 0 ? (
                        <div className="overflow-x-auto">
                            <DynamicTable
                                headers={selectedServiceTableHeaders}
                                data={getSelectedServicesForTable()}
                                hasActionColumn={true}
                                onDelete={(id) => handleRemoveService(parseInt(id))}
                                hasEdit={false}
                                customAction={(row) => (
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                                        onClick={() => handleRemoveService(row.id)}
                                    >
                                        Xóa
                                    </button>
                                )}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>Chưa có dịch vụ nào được chọn</p>
                            {!formData.rentalContractId && (
                                <p className="text-sm mt-2">Vui lòng chọn hợp đồng trước</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal chọn hợp đồng */}
            {isContractModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Chọn Hợp đồng</h3>
                        <DynamicTable
                            headers={contractTableHeaders}
                            data={contracts}
                            hasActionColumn={true}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            customAction={(row) => (
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                    onClick={() => handleSelectContract(row.id.toString())}
                                >
                                    Chọn
                                </button>
                            )}
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setIsContractModalOpen(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chọn dịch vụ */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Chọn Dịch vụ</h3>
                        <DynamicTable
                            headers={serviceTableHeaders}
                            data={services}
                            hasActionColumn={false}
                        />
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                type="button"
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setIsServiceModalOpen(false)}
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-lightGreenHover"
                                onClick={() => setIsServiceModalOpen(false)}
                                disabled={selectedServices.length === 0}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../../types/Context.ts";
import { useNotice } from "../../../../hook/useNotice.ts";
import { useLoading } from "../../../../contexts/LoadingContext.tsx";
import DynamicTable from "../../../../components/DynamicTable.tsx";
import { TableHeader, RentalContractResponse, ServiceDTO } from "../../../../types/Dashboard.ts";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

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
                setMessage(response.data.message || t("cannot_fetch_contracts"));
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ status: string; code?: string; message?: string }>;
            setMessage(axiosError.response?.data?.message || t("unknown_error"));
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
                setMessage(response.data.message || t("cannot_fetch_services"));
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ status: string; code?: string; message?: string }>;
            setMessage(axiosError.response?.data?.message || t("unknown_error"));
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
            setMessage(t("please_select_contract"));
            setType(NoticeType.ERROR);
            return;
        }
        if (selectedServices.length === 0) {
            setMessage(t("please_select_service"));
            setType(NoticeType.ERROR);
            return;
        }

        try {
            setApiLoading(true);
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
            if (response.status === 200 && response.data.status === "success") {
                setMessage(t("bill_created_success"));
                setType(NoticeType.SUCCESS);
                setFormData({ rentalContractId: "" });
                setSelectedServices([]);
            } else {
                const errorMessage = getErrorMessage(response.data.code) || response.data.message || t("bill_create_failed");
                setMessage(errorMessage);
                setType(NoticeType.ERROR);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ status: string; code?: string; message?: string }>;
            const errorData = axiosError.response?.data;
            const errorMessage = getErrorMessage(errorData?.code) || errorData?.message || t("unknown_error");
            setMessage(errorMessage);
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    // Hàm ánh xạ mã lỗi sang thông báo chuẩn hóa
    const getErrorMessage = (code?: string): string | undefined => {
        switch (code) {
            case "invalidInput":
                return t("invalid_input");
            case "invalidContract":
                return t("invalid_contract");
            case "serverError":
                return t("server_error");
            default:
                return undefined;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, rentalContractId: value }));
    };

    const contractTableHeaders: TableHeader<RentalContractResponse>[] = [
        { name: t("apartment_name"), slug: "name", sortASC: true, center: true },
        { name: t("tenant"), slug: "fullname", sortASC: true, center: true },
        { name: t("contract_type"), slug: "description", sortASC: true, center: true },
        {
            name: t("start_date"),
            slug: "startDate",
            sortASC: true,
            center: true,
            render: (row) => new Date(row.startDate).toLocaleDateString("vi-VN"),
        },
        {
            name: t("end_date"),
            slug: "endDate",
            sortASC: true,
            center: true,
            render: (row) => new Date(row.endDate).toLocaleDateString("vi-VN"),
        },
    ];

    const serviceTableHeaders: TableHeader<ServiceDTO>[] = [
        { name: t("service_name"), slug: "name", sortASC: true, center: true },
        { name: t("description"), slug: "description", sortASC: true, center: true },
        {
            name: t("price"),
            slug: "price",
            sortASC: true,
            center: true,
            render: (row) => `${row.price.toLocaleString()} VNĐ`,
        },
        { name: t("unit"), slug: "unit", sortASC: true, center: true },
        {
            name: t("quantity"),
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

    const selectedServiceTableHeaders: TableHeader<SelectedServiceDisplay>[] = [
        { name: t("service_name"), slug: "name", sortASC: true, center: true },
        { name: t("description"), slug: "description", sortASC: true, center: true },
        {
            name: t("unit_price"),
            slug: "price",
            sortASC: true,
            center: true,
            render: (row) => `${row.price.toLocaleString()} VNĐ`,
        },
        { name: t("unit"), slug: "unit", sortASC: true, center: true },
        {
            name: t("quantity"),
            slug: "quantity",
            sortASC: true,
            center: true,
            render: (row) => <span className="font-semibold text-blue-600">{row.quantity}</span>,
        },
        {
            name: t("total_price"),
            slug: "totalPrice",
            sortASC: true,
            center: true,
            render: (row) => (
                <span className="font-semibold text-green-600">{row.totalPrice.toLocaleString()} VNĐ</span>
            ),
        },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{t("create_monthly_bill")}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form tạo hóa đơn */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">{t("bill_information")}</h3>
                    <form onSubmit={handleCreateBill}>
                        <div className="mb-4">
                            <label className="text-left mb-4 block text-sm font-medium mb-1">{t("rental_contract_id")}</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    name="rentalContractId"
                                    value={formData.rentalContractId}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    readOnly
                                    placeholder={t("no_contract_selected")}
                                />
                                <button
                                    type="button"
                                    className="bg-lightGreen text-black font-bold px-6 py-2 rounded hover:bg-lightGreenHover whitespace-nowrap"
                                    onClick={() => setIsContractModalOpen(true)}
                                >
                                    {formData.rentalContractId ? t("reselect") : t("select_contract")}
                                </button>
                            </div>
                        </div>

                        {/* Tổng tiền */}
                        {selectedServices.length > 0 && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>{t("total_amount")}:</span>
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
                                {t("cancel")}
                            </button>
                            <button
                                type="submit"
                                className="bg-lightGreen text-black font-bold px-4 py-2 rounded hover:bg-lightGreenHover"
                                disabled={!formData.rentalContractId || selectedServices.length === 0}
                            >
                                {t("create_bill")}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Bảng dịch vụ đã chọn */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{t("selected_services")}</h3>
                        <button
                            type="button"
                            className="bg-lightGreen text-black font-bold px-4 py-2 rounded hover:bg-lightGreenHover"
                            onClick={() => setIsServiceModalOpen(true)}
                            disabled={!formData.rentalContractId}
                        >
                            {selectedServices.length > 0 ? t("update_services") : t("select_services")}
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
                                        {t("remove")}
                                    </button>
                                )}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>{t("no_services_selected")}</p>
                            {!formData.rentalContractId && <p className="text-sm mt-2">{t("please_select_contract_first")}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal chọn hợp đồng */}
            {isContractModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{t("select_contract")}</h3>
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
                                    {t("select")}
                                </button>
                            )}
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setIsContractModalOpen(false)}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chọn dịch vụ */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{t("select_services")}</h3>
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
                                {t("close")}
                            </button>
                            <button
                                type="button"
                                className="bg-lightGreen text-white px-4 py-2 rounded hover:bg-lightGreenHover"
                                onClick={() => setIsServiceModalOpen(false)}
                                disabled={selectedServices.length === 0}
                            >
                                {t("confirm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import DynamicTable from "../../../../components/DynamicTable.tsx";
import { ApartmentTypeDTO, TableHeader } from "../../../../types/Dashboard.ts";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../../types/Context.ts";
import { useNotice } from "../../../../hook/useNotice.ts";
import { useEffect, useMemo, useState } from "react";
import { IoIosClose } from "react-icons/io";
import LoadingPage from "../../../../components/LoadingPage.tsx";
import { debounce } from "../../../../utils/Debounce.ts";
import { getToken } from "../../../../utils/TokenUtils.ts";

export default function ApartmentTypeManagement() {
    const { setMessage, setType } = useNotice();
    const [types, setTypes] = useState<ApartmentTypeDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const typeDefault: ApartmentTypeDTO = { id: 0, name: "", description: "" };
    const [typeSelect, setTypeSelect] = useState<ApartmentTypeDTO>(typeDefault);
    const token = getToken();

    const headers: TableHeader<ApartmentTypeDTO>[] = [
        { name: "Loại phòng", slug: "name", sortASC: true },
        { name: "Mô tả", slug: "description", sortASC: true },
    ];

    useEffect(() => {
        handleGetApartmentType();
    }, []);

    const handleGetApartmentType = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/types`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setTypes(response.data.data);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Không thể lấy danh sách loại căn hộ");
            setType(NoticeType.ERROR);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdateType = async () => {
        if (!typeSelect.name || !typeSelect.description) {
            setMessage("Vui lòng điền đầy đủ thông tin");
            setType(NoticeType.ERROR);
            return;
        }
        setLoading(true);
        try {
            const payload = { name: typeSelect.name, description: typeSelect.description };
            let response;
            if (typeSelect.id) {
                // Update existing type
                response = await axios.put(`${envVar.API_URL}/dashboard/types/${typeSelect.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Add new type
                response = await axios.post(`${envVar.API_URL}/dashboard/types`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setType(NoticeType.SUCCESS);
                setMessage(response.data.message || (typeSelect.id ? "Cập nhật loại căn hộ thành công" : "Thêm loại căn hộ thành công"));
                handleGetApartmentType();
                setShowModal(false);
                setTypeSelect(typeDefault);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Không thể lưu loại căn hộ");
            setType(NoticeType.ERROR);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteType = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${envVar.API_URL}/dashboard/types/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setType(NoticeType.SUCCESS);
                setMessage(response.data.message || "Xóa loại căn hộ thành công");
                handleGetApartmentType();
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Không thể xóa loại căn hộ");
            setType(NoticeType.ERROR);
        } finally {
            setLoading(false);
        }
    };

    const debounceName = useMemo(() => debounce((name: string) => handleCheckNameType(name), 500), []);

    const handleCheckNameType = async (name: string) => {
        if (!name || typeSelect.name === name) return;
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/types/check-name?name=${encodeURIComponent(name)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                if (!response.data.data) {
                    setType(NoticeType.ERROR);
                    setMessage("Tên loại căn hộ đã tồn tại");
                } else {
                    setMessage("");
                }
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || "Không thể kiểm tra tên loại căn hộ");
            setType(NoticeType.ERROR);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTypeSelect(typeDefault);
        setMessage("");
    };

    if (loading && !showModal) {
        return <LoadingPage />;
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div
                className="lg:ml-auto mb-4 bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                onClick={() => {
                    setShowModal(true);
                    setTypeSelect(typeDefault);
                }}
            >
                Thêm loại căn hộ
            </div>
            <DynamicTable
                headers={headers}
                data={types}
                hasActionColumn={true}
                hasEdit={true}
                onEdit={(id: string) => {
                    const type = types.find((t) => t.id === Number(id));
                    if (type) {
                        setTypeSelect(type);
                        setShowModal(true);
                    }
                }}
                onDelete={handleDeleteType}
            />
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white lg:w-1/3 w-11/12 p-4 rounded text-left">
                        <div
                            className="ml-auto w-fit h-fit p-2 hover:cursor-pointer hover:text-lightGreen duration-300 transition-all ease-in-out"
                            onClick={handleCloseModal}
                        >
                            <IoIosClose className="text-4xl" />
                        </div>
                        <h1 className="font-bold text-xl text-center mb-8">Loại phòng</h1>
                        <div className="flex items-center justify-between gap-8 border-2 border-[#ccc] p-2 rounded mb-8">
                            <label className="text-base flex-shrink-0">Loại phòng</label>
                            <input
                                type="text"
                                placeholder="..."
                                className="outline-none p-2 w-full"
                                required
                                value={typeSelect.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setTypeSelect((prev) => ({ ...prev, name }));
                                    debounceName(name);
                                }}
                            />
                        </div>
                        <label className="text-base flex-shrink-0">Mô tả</label>
                        <textarea
                            className="outline-none mt-4 border-2 border-[#ccc] rounded p-2 w-full resize-none"
                            rows={5}
                            placeholder="..."
                            required
                            value={typeSelect.description}
                            onChange={(e) => setTypeSelect((prev) => ({ ...prev, description: e.target.value }))}
                        />
                        <div
                            className="w-fit h-fit mx-auto mt-8 rounded border border-[#ccc] bg-lightGreen px-12 py-2 cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                            onClick={handleAddOrUpdateType}
                        >
                            Lưu
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
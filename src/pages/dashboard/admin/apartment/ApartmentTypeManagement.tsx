import DynamicTable from "../../../../components/DynamicTable.tsx";
import { ApartmentTypeDTO, TableHeader } from "../../../../types/Dashboard.ts";
import axios from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../../types/Context.ts";
import { useNotice } from "../../../../hook/useNotice.ts";
import { useEffect, useMemo, useState } from "react";
import { IoIosClose } from "react-icons/io";
import LoadingPage from "../../../../components/LoadingPage.tsx";
import { debounce } from "../../../../utils/Debounce.ts";
import { getToken } from "../../../../utils/TokenUtils.ts";
import { useTranslation } from "react-i18next";

export default function ApartmentTypeManagement() {
    const { setMessage, setType } = useNotice();
    const [types, setTypes] = useState<ApartmentTypeDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const typeDefault = { id: 0, name: "", description: "" };
    const [typeSelect, setTypeSelect] = useState<ApartmentTypeDTO>(typeDefault);
    const token = getToken();
    const { t } = useTranslation();

    const headers: TableHeader<ApartmentTypeDTO>[] = [
        { name: t("apartment_type"), slug: "name" },
        { name: t("description"), slug: "description" },
    ];

    useEffect(() => {
        handleGetApartmentType();
    }, []);

    const handleGetApartmentType = async () => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/types`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setTypes(response.data.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message ?? t("unknown_error"));
            } else {
                setMessage(t("unknown_error"));
            }
            setType(NoticeType.ERROR);
        }
    };

    const handleAddOrUpdateType = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${envVar.API_URL}/dashboard/types`, typeSelect, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setLoading(false);
                setType(NoticeType.SUCCESS);
                setMessage(response.data.data);
                handleGetApartmentType();
            }
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message ?? t("unknown_error"));
            } else {
                setMessage(t("unknown_error"));
            }
            setType(NoticeType.ERROR);
        }
    };

    const handleDeleteType = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${envVar.API_URL}/dashboard/types/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setLoading(false);
                setType(NoticeType.SUCCESS);
                setMessage(response.data.data);
                handleGetApartmentType();
            }
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message ?? t("unknown_error"));
            } else {
                setMessage(t("unknown_error"));
            }
            setType(NoticeType.ERROR);
        }
    };

    const debounceName = useMemo(() => {
        return debounce((name: string) => handleCheckNameType(name), 500);
    }, []);

    const handleCheckNameType = async (name: string) => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/types/check-name?name=${name}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                if (response.data.data === false) {
                    setType(NoticeType.ERROR);
                    setMessage(t("apartment_type_exists"));
                } else {
                    setMessage("");
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message ?? t("unknown_error"));
            } else {
                setMessage(t("unknown_error"));
            }
            setType(NoticeType.ERROR);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div
                className="ml-auto mb-4 bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                onClick={() => {
                    setShowModal(!showModal);
                    setTypeSelect(typeDefault);
                }}
            >
                {t("add_apartment_type")}
            </div>
            <DynamicTable
                headers={headers}
                data={types}
                hasActionColumn={true}
                hasEdit={true}
                onEdit={(id: string) => {
                    setTypeSelect(types.filter((t) => t.id === Number(id))[0]);
                    setShowModal(!showModal);
                }}
                onDelete={handleDeleteType}
            />

            {showModal ? (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-1/3 p-4 rounded text-left">
                        <div
                            className="ml-auto w-fit h-fit p-2 hover:cursor-pointer hover:text-lightGreen duration-300 transition-all ease-in-out"
                            onClick={() => setShowModal(!showModal)}
                        >
                            <IoIosClose className="text-4xl" />
                        </div>
                        <h1 className="font-bold text-xl text-center mb-8">{t("apartment_type")}</h1>
                        <div className="flex items-center justify-between gap-8 border-2 border-[#ccc] p-2 rounded mb-8">
                            <label className="text-base flex-shrink-0">{t("apartment_type")}</label>
                            <input
                                type="text"
                                placeholder="..."
                                className="outline-none p-2 w-full"
                                required={true}
                                value={typeSelect?.name || ""}
                                onChange={(e) => {
                                    setTypeSelect((prev) => ({ ...prev, name: e.target.value }));
                                    debounceName(e.target.value);
                                }}
                            />
                        </div>
                        <label className="text-base flex-shrink-0">{t("description")}</label>
                        <textarea
                            className="outline-none mt-4 border-2 border-[#ccc] rounded p-2 w-full resize-none"
                            rows={5}
                            placeholder="..."
                            required={true}
                            value={typeSelect?.description || ""}
                            onChange={(e) => setTypeSelect((prev) => ({ ...prev, description: e.target.value }))}
                        ></textarea>
                        <div
                            className="w-fit h-fit mx-auto mt-8 rounded border border-[#ccc] bg-lightGreen px-12 py-2 cursor-pointer hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
                            onClick={() => handleAddOrUpdateType()}
                        >
                            {t("save")}
                        </div>
                    </div>
                </div>
            ) : ""}

            {loading ? <LoadingPage /> : ""}
        </div>
    );
}
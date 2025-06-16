import DynamicTable from "../../../../components/DynamicTable.tsx";
import { ApartmentManagementType, TableHeader } from "../../../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import { useNotice } from "../../../../hook/useNotice.ts";
import { NoticeType } from "../../../../types/Context.ts";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../../utils/EnvironmentVariables.ts";
import { Link } from "react-router-dom";
import { getToken } from "../../../../utils/TokenUtils.ts";
import { useTranslation } from "react-i18next";

export default function ApartmentManagement() {
    const [apartments, setApartments] = useState<ApartmentManagementType[]>([]);
    const { setMessage, setType } = useNotice();
    const [loading, setLoading] = useState(false);
    const token = getToken();
    const { t } = useTranslation();

    const headers: TableHeader<ApartmentManagementType>[] = [
        { name: t("room_number"), slug: "name", sortASC: true },
        { name: t("price_vnd"), slug: "price", isCurrency: true, sortASC: true },
        { name: t("room_type"), slug: "type" },
        { name: t("status"), slug: "status" },
        { name: t("tenant"), slug: "user", sortASC: true },
    ];

    useEffect(() => {
        handleGetApartmentManagement();
    }, []);

    const handleGetApartmentManagement = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/apartments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                const apartmentsNormalize = response.data.data.map((a: ApartmentManagementType) => ({
                    ...a,
                    price: a.price,
                    name: (
                        <Link to={`/dashboard/apartment-management/${a.slug}`} className="underline text-blue-500" data-sort={a.name}>
                            {a.name}
                        </Link>
                    ),
                    user: a.userEmail ? (
                        <div data-sort={a.user}>
                            {a.user}
                        </div>
                    ) : (
                        t("no_tenant")
                    ),
                }));
                setApartments(apartmentsNormalize);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || t("cannot_fetch_apartments"));
            setType(NoticeType.ERROR);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteApartment = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${envVar.API_URL}/dashboard/apartments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setApartments((prev) => prev.filter((a) => a.id !== Number(id)));
                setType(NoticeType.SUCCESS);
                setMessage(t("apartment_deleted_success"));
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || t("cannot_delete_apartment"));
            setType(NoticeType.ERROR);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full">{t("loading")}...</div>;
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <Link
                to="/dashboard/apartment-management/add"
                className="lg:ml-auto mb-4 bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out"
            >
                {t("add_apartment")}
            </Link>

            <DynamicTable headers={headers} data={apartments} hasActionColumn={true} onDelete={handleDeleteApartment} />
        </div>
    );
}
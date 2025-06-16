import DynamicTable from "../../../components/DynamicTable.tsx";
import { TableHeader, UserApartmentDTO } from "../../../types/Dashboard.ts";
import { useEffect, useState } from "react";
import axios from "axios";
import { envVar } from "../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../types/Context.ts";
import { useNotice } from "../../../hook/useNotice.ts";
import { getToken } from "../../../utils/TokenUtils.ts";
import { useLoading } from "../../../contexts/LoadingContext.tsx";
import { formatDate } from "../../../utils/DateProcess.ts";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UserApartmentManagement() {
    const token = getToken();
    const [apartments, setApartments] = useState<UserApartmentDTO[]>([]);
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();
    const { t } = useTranslation();

    const headers: TableHeader<UserApartmentDTO>[] = [
        { name: t("apartment_name"), slug: "name", center: true },
        { name: t("apartment_type"), slug: "type", center: true },
        { name: t("start_date"), slug: "startDate", center: true },
        { name: t("end_date"), slug: "endDate", center: true },
    ];

    useEffect(() => {
        handleGetApartments();
    }, []);

    const handleGetApartments = async () => {
        setApiLoading(true);
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard-user/me/apartments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                console.log(response.data.data);

                setApartments(
                    response.data.data.map((a: UserApartmentDTO) => ({
                        ...a,
                        name: (
                            <Link to={`${a.slug}`} className="underline text-blue-500" data-sort={a.name}>
                                {a.name}
                            </Link>
                        ),
                        startDate: formatDate(new Date(a.startDate)),
                        endDate: formatDate(new Date(a.endDate)),
                    }))
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message ?? t("unknown_error"));
            } else {
                setMessage(t("unknown_error"));
            }
            console.log(error);
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <h1 className="mb-8 font-bold text-2xl mt-16 lg:mt-0">{t("rented_apartment_management")}</h1>
            <DynamicTable headers={headers} data={apartments} hasActionColumn={false} />
        </div>
    );
}
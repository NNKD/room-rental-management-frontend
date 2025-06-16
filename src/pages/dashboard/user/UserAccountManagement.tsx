import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { envVar } from "../../../utils/EnvironmentVariables.ts";
import { NoticeType } from "../../../types/Context.ts";
import { useNotice } from "../../../hook/useNotice.ts";
import { getToken } from "../../../utils/TokenUtils.ts";
import { useLoading } from "../../../contexts/LoadingContext.tsx";
import { useTranslation } from "react-i18next";

export default function UserAccountManagement() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const { setMessage, setType } = useNotice();
    const { setApiLoading } = useLoading();
    const token = getToken();
    const { t} = useTranslation();



    useEffect(() => {
        handleGetUser();
    }, []);

    const handleGetUser = async () => {
        setApiLoading(true);
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard-user/me/account`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                console.log(response.data.data);
                setEmail(response.data.data.email);
                setPhone(response.data.data.phone);
                setUsername(response.data.data.username);
                setFullname(response.data.data.fullname);
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setMessage(axiosError.response?.data?.message || t("cannot_fetch_data"));
            setType(NoticeType.ERROR);
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <div className="text-left">
            <p className="font-bold text-2xl mb-6">{t("account_management")}</p>
            <div className="flex flex-col gap-4">
                <p className="text-base">{t("full_name")}: {fullname}</p>
                <p className="text-base">{t("email")}: {email}</p>
                <p className="text-base">{t("phone")}: {phone}</p>
                <p className="text-base">{t("username")}: {username}</p>
            </div>

        </div>
    );
}
import { useState, FormEvent } from "react";
import { useNotice } from "../hook/useNotice";
import LoadingPage from "../components/LoadingPage";
import { NoticeType } from "../types/Context.ts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setMessage, setType } = useNotice();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8080/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data: { statusCode: number; status: string; message: string } = await response.json();

            if (data.statusCode === 400) {
                throw new Error(data.message || t("invalid_email"));
            }

            if (!response.ok) {
                throw new Error(data.message || t("error_occurred"));
            }

            setMessage(
                data.message === "Operation successful"
                    ? t("new_password_sent")
                    : data.message
            );
            setType(NoticeType.SUCCESS);
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1500);
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : t("error_try_again"));
            setType(NoticeType.ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#149e94] via-[#17c2b1] to-[#1ad7cb] flex items-center justify-center px-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 w-full relative">
                    <img
                        src="https://static.designboom.com/wp-content/uploads/2021/06/city-oasis-apartments-k-a-studio-vietnam-designboom-3.jpg"
                        alt="Beach"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-6">
                        <h1 className="text-5xl font-bold leading-tight mb-4">
                            Green<br />Home.
                        </h1>
                        <p className="text-sm text-center">{t("green_home_mission")}</p>
                    </div>
                </div>

                <div className="md:w-1/2 w-full p-8 md:p-12">
                    <h2 className="text-3xl font-bold mb-2">{t("forgot_password")}</h2>
                    <p className="text-sm text-gray-foreground mb-6">
                        {t("enter_email_to_reset")}{" "}
                        <a href="/login" className="text-blue-500 underline">
                            {t("back_to_login")}
                        </a>
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder={t("enter_email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-gray-300 py-2 px-2 focus:outline-none focus:border-pink-500"
                            required
                            disabled={isLoading}
                        />

                        <div className="w-fit mx-auto mt-6">
                            <button
                                type="submit"
                                className="mx-auto bg-lightGreen w-fit px-10 py-2 rounded font-bold cursor-pointer shadow-[0_0_2px_1px_#ccc] hover:bg-lightGreenHover transition-all duration-300 ease-in-out mt-10"
                                disabled={isLoading}
                            >
                                {t("send_request")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
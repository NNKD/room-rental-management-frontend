import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth.ts";
import { useNotice } from "../hook/useNotice";
import LoadingPage from "../components/LoadingPage";
import { NoticeType } from "../types/Context.ts";
import { envVar } from "../utils/EnvironmentVariables.ts";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { login, isAuthenticated } = useAuth();
    const { setMessage, setType } = useNotice();
    const navigate = useNavigate();
    const [role, setRole] = useState<number | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (isAuthenticated) {
            if (role === 1) {
                navigate("/dashboard", { replace: true });
            } else if (role === 0) {
                navigate("/dashboard-user", { replace: true });
            }
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (role === 1) {
            navigate("/dashboard", { replace: true });
        } else if (role === 0) {
            navigate("/dashboard-user", { replace: true });
        }
    }, [role]);

    const handleGetRole = async (token: string) => {
        try {
            const response = await axios.get(`${envVar.API_URL}/dashboard/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.status === "success" && response.data.statusCode === 200) {
                setRole(response.data.data.role);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${envVar.API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password,
                }),
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers.get("content-type"));

            if (!response.ok) {
                const errorText = await response.text();
                console.log("Error response:", errorText);
                throw new Error(t("login_failed") + `: ${errorText}`);
            }

            const contentType = response.headers.get("content-type");
            let token = "";

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log("JSON response:", data);

                if (data.statusCode !== 200) {
                    throw new Error(data.message || t("login_failed"));
                }

                token = data.data?.token || data.token || "";
            } else {
                token = await response.text();
                console.log("Text response (token):", token);
            }

            if (!token) {
                throw new Error(t("no_token_received"));
            }

            setMessage(t("login_success"));
            setType(NoticeType.SUCCESS);
            handleGetRole(token);

            login(token, username.trim());
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error instanceof Error ? error.message : t("login_error");
            setMessage(errorMessage);
            setType(NoticeType.ERROR);
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
                    <h2 className="text-3xl font-bold mb-2">{t("login")}</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        {t("forgot_password_link")}{" "}
                        <a href="/forgot-password" className="text-blue-500 underline">
                            {t("reset_password")}
                        </a>
                        , {t("takes_less_than_a_minute")}
                    </p>

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t("username")}
                                className="w-full border-b border-gray-300 py-2 px-2 focus:outline-none focus:border-pink-500 transition-colors"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                placeholder={t("password")}
                                className="w-full border-b border-gray-300 py-2 px-2 focus:outline-none focus:border-pink-500 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-pink-500 text-white py-2 rounded-full font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? t("logging_in") : t("login")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
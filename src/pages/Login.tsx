// src/pages/Login.tsx
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth.ts';
import { useNotice } from '../hook/useNotice';
import LoadingPage from '../components/LoadingPage';
import { NoticeType } from "../types/Context.ts";
import {envVar} from "../utils/EnvironmentVariables.ts";

export default function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { login, isAuthenticated } = useAuth();
    const { setMessage, setType } = useNotice();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${envVar.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password,
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers.get('content-type'));

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                throw new Error(`Đăng nhập thất bại: ${errorText}`);
            }

            // Kiểm tra content type để xử lý response
            const contentType = response.headers.get('content-type');
            let token = '';

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('JSON response:', data);

                if (data.statusCode !== 200) {
                    throw new Error(data.message || 'Đăng nhập thất bại');
                }

                // Token nằm trong data.token theo response của server
                token = data.data?.token || data.token || '';
            } else {
                token = await response.text();
                console.log('Text response (token):', token);
            }

            if (!token) {
                throw new Error('Không nhận được token từ server');
            }

            setMessage('Đăng nhập thành công! Đang chuyển hướng...');
            setType(NoticeType.SUCCESS);



            login(token, { username: username.trim() });

            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng nhập';
            setMessage(errorMessage);
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
                        <h1 className="text-5xl font-bold leading-tight mb-4">Green<br />Home.</h1>
                        <p className="text-sm text-center">Tiên phong trong việc xây dựng môi trường xanh cho mọi nhà.</p>
                    </div>
                </div>
                <div className="md:w-1/2 w-full p-8 md:p-12">
                    <h2 className="text-3xl font-bold mb-2">Đăng Nhập</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Quên mật khẩu?{' '}
                        <a href="/forgot-password" className="text-blue-500 underline">
                            Đổi mật khẩu tài khoản
                        </a>
                        , chỉ mất ít hơn một phút
                    </p>

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
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
                                placeholder="Mật khẩu"
                                className="w-full border-b border-gray-300 py-2 px-2 focus:outline-none focus:border-pink-500 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/*<div className="flex items-center text-sm">*/}
                        {/*    <input type="checkbox" id="terms" className="mr-2" disabled={isLoading} />*/}
                        {/*    <label htmlFor="terms">Tôi đồng ý với điều khoản và chính sách bảo mật</label>*/}
                        {/*</div>*/}

                        <button
                            type="submit"
                            className="w-full bg-pink-500 text-white py-2 rounded-full font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                        </button>
                    </form>

                    {/*<div className="mt-6 text-center text-sm text-gray-500">*/}
                    {/*    Đăng nhập bằng mạng xã hội*/}
                    {/*    <div className="flex justify-center gap-4 mt-3">*/}
                    {/*        <button*/}
                    {/*            className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"*/}
                    {/*            disabled={isLoading}*/}
                    {/*        >*/}
                    {/*            Facebook*/}
                    {/*        </button>*/}
                    {/*        <button*/}
                    {/*            className="bg-blue-400 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50"*/}
                    {/*            disabled={isLoading}*/}
                    {/*        >*/}
                    {/*            Twitter*/}
                    {/*        </button>*/}
                    {/*        <button*/}
                    {/*            className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"*/}
                    {/*            disabled={isLoading}*/}
                    {/*        >*/}
                    {/*            Google +*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}
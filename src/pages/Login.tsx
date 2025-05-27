import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from './LoadingPage';

export default function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/home';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data: { statusCode: number; status: string; message: string; token?: string } = await response.json();

            if (data.statusCode === 400 || !response.ok) {
                throw new Error(data.message || 'Tài khoản hoặc mật khẩu không đúng');
            }

            const token = data.token || await response.text();
            setSuccessMessage(data.message === 'Operation successful' ? 'Đăng nhập thành công! Đang chuyển hướng...' : data.message);

            login(token, { username });

            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1500);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
            setError(errorMessage);
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
                        Quên mật khẩu ?{' '}
                        <a href="/forgot-password" className="text-blue-500 underline">
                            Đổi mật khẩu tài khoản
                        </a>
                        , chỉ mất ít hơn một phút
                    </p>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

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

                        <div className="flex items-center text-sm">
                            <input type="checkbox" id="terms" className="mr-2" disabled={isLoading} />
                            <label htmlFor="terms">Tôi đồng ý với điều khoản và chính sách bảo mật</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-pink-500 text-white py-2 rounded-full font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            ĐĂNG NHẬP
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Đăng nhập bằng mạng xã hội
                        <div className="flex justify-center gap-4 mt-3">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-blue-700 transition-colors">
                                Facebook
                            </button>
                            <button className="bg-blue-400 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-blue-500 transition-colors">
                                Twitter
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-600 transition-colors">
                                Google +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
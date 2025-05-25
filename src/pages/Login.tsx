import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.text();
                setToken(data);
                localStorage.setItem("token", data); // Lưu token
                alert("Login successful! Token: " + data);
                navigate("/home"); // Chuyển hướng đến /home
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        }
    };

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
                    <h2 className="text-3xl font-bold mb-2">Login</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Forgot your password ?{" "}
                        <a href="#" className="text-blue-500 underline">
                            Change password account
                        </a>
                        , it takes less than a minute
                    </p>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full border-b border-gray-300 py-2 px-2 focus:outline-none focus:border-pink-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border-b border-gray-300 py-2 px-2 focus:outline-none focus:border-pink-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex items-center text-sm">
                            <input type="checkbox" id="terms" className="mr-2" />
                            <label htmlFor="terms">I accept terms and conditions & privacy policy</label>
                        </div>
                        <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded-full font-semibold hover:bg-pink-600 transition">
                            LOGIN
                        </button>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {token && <p className="text-green-500 text-sm">Token: {token}</p>}
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Login with social media
                        <div className="flex justify-center gap-4 mt-3">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold">
                                Facebook
                            </button>
                            <button className="bg-blue-400 text-white px-4 py-2 rounded-full text-xs font-semibold">
                                Twitter
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-semibold">
                                Google +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
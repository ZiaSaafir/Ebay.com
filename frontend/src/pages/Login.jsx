import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveToken } from "../utils/auth";

function Login() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const res = await fetch(`${BASEURL}/api/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                saveToken(data);
                setMsg("Login successful");

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                setMsg(data.detail || "Invalid credentials");
            }
        } catch (error) {
            setMsg("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
                
                <p className="text-gray-600 text-center mb-6">Login to your account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {msg && (
                        <p className={`text-center text-sm ${msg.includes("successful") ? 'text-green-600' : 'text-red-600'}`}>
                            {msg}
                        </p>
                    )}
                </form>

                {/* Signup Option */}
                <div className="mt-6 pt-4 border-t text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link 
                            to="/signup" 
                            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
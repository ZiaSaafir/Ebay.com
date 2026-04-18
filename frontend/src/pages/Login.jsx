import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveToken } from "../utils/auth";

function Login() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Handle Login
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
                setMsg("Login successful!");

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                setMsg(data.detail || "Invalid username or password.");
            }

        } catch (error) {
            setMsg("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Welcome Back 👋
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-6">
                    Login to your Epnic account
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Message */}
                    {msg && (
                        <p
                            className={`text-center text-sm font-medium ${
                                msg.includes("successful")
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {msg}
                        </p>
                    )}
                </form>

                {/* Signup */}
                <div className="mt-6 border-t pt-5 text-center">
                    <p className="text-gray-600 text-sm">
                        Don’t have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>

            </div>

        </div>
    );
}

export default Login;
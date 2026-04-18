import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { saveToken } from "../utils/auth";

function Login() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = location.state?.from?.pathname || "/";

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // ================= INPUT CHANGE =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ================= LOGIN =================
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

            if (!res.ok) {
                setMsg(
                    data.detail ||
                    "Invalid username or password."
                );
                return;
            }

            saveToken(data);

            setMsg("Login successful!");

            setTimeout(() => {
                navigate(redirectTo, { replace: true });
            }, 1000);

        } catch {
            setMsg("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

                {/* Heading */}
                <div className="text-center mb-8">

                    <h1 className="text-4xl font-black text-gray-800">
                        Welcome Back
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Login to continue shopping
                    </p>

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                            className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                                className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 pr-14"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-4 top-3 text-sm text-gray-500"
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                    {/* Message */}
                    {msg && (
                        <div
                            className={`text-center text-sm font-medium p-3 rounded-xl ${
                                msg.includes("successful")
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {msg}
                        </div>
                    )}

                </form>

                {/* Bottom */}
                <div className="mt-8 border-t pt-6 text-center">

                    <p className="text-gray-600 text-sm">
                        Don’t have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Create Account
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [success, setSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    // ================= INPUT CHANGE =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ================= SIGNUP =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMsg("");
        setSuccess(false);

        if (form.password !== form.password2) {
            setMsg("Passwords do not match.");
            return;
        }

        if (form.password.length < 6) {
            setMsg("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${BASEURL}/api/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(
                    data?.non_field_errors?.[0] ||
                    data?.username?.[0] ||
                    data?.email?.[0] ||
                    data?.password?.[0] ||
                    "Signup failed."
                );
                return;
            }

            setSuccess(true);
            setMsg("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

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
                        Create Account
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Join Epnic and start shopping
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
                            className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                            className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
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
                                className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 pr-14"
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showPassword2
                                        ? "text"
                                        : "password"
                                }
                                name="password2"
                                value={form.password2}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
                                className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 pr-14"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword2(
                                        !showPassword2
                                    )
                                }
                                className="absolute right-4 top-3 text-sm text-gray-500"
                            >
                                {showPassword2
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400"
                    >
                        {loading
                            ? "Creating..."
                            : "Create Account"}
                    </button>

                    {/* Message */}
                    {msg && (
                        <div
                            className={`text-center text-sm font-medium p-3 rounded-xl ${
                                success
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
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-green-600 font-semibold hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Signup;
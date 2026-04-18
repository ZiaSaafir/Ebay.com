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

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Handle Signup
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.password2) {
            setMsg("Passwords do not match.");
            return;
        }

        setLoading(true);
        setMsg("");

        try {
            const res = await fetch(`${BASEURL}/api/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMsg("Account created successfully!");

                setTimeout(() => {
                    navigate("/login");
                }, 1200);
            } else {
                setMsg(
                    data?.non_field_errors?.[0] ||
                    data?.username?.[0] ||
                    data?.email?.[0] ||
                    data?.password?.[0] ||
                    "Signup failed."
                );
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
                    Create Account 🚀
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-6">
                    Join Epnic and start shopping
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Username */}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {/* Confirm Password */}
                    <input
                        type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        value={form.password2}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                    {/* Message */}
                    {msg && (
                        <p
                            className={`text-center text-sm font-medium ${
                                msg.includes("successfully")
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {msg}
                        </p>
                    )}
                </form>

                {/* Login Link */}
                <div className="mt-6 border-t pt-5 text-center">
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
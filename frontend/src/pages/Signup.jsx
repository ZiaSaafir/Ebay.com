import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
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
            const res = await fetch(`${BASEURL}/api/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMsg("Account created successfully");

                setTimeout(() => {
                    navigate("/login"); // go to login page
                }, 1000);
            } else {
                setMsg(
                    data?.non_field_errors ||
                    data?.password ||
                    data?.username ||
                    "Signup failed"
                );
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
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded-lg"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded-lg"
                    />

                    <input
                        type="password"
                        name="password2"
                        placeholder="Confirm password"
                        value={form.password2}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded-lg"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>

                    {msg && (
                        <p className="text-center text-sm">{msg}</p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Signup;
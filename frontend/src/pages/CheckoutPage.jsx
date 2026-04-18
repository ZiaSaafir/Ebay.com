import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { authFetch } from "../utils/auth";

function CheckoutPage() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const { clearCart } = useCart();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        payment_method: "COD",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ---------------- HANDLE CHANGE ----------------
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ---------------- HANDLE SUBMIT ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await authFetch(`${BASEURL}/api/orders/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Order failed");
                return;
            }

            setMessage("Order placed successfully");

            // clear cart after success
            clearCart();

            // redirect after delay
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            setMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Checkout
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border p-3 rounded-lg"
                    />

                    <textarea
                        name="address"
                        placeholder="Delivery Address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full border p-3 rounded-lg"
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full border p-3 rounded-lg"
                    />

                    <select
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    >
                        <option value="COD">Cash on Delivery</option>
                        <option value="CreditCard">Online Payment</option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        {loading ? "Processing..." : "Place Order"}
                    </button>

                    {message && (
                        <p className="text-center text-sm mt-2 text-gray-700">
                            {message}
                        </p>
                    )}
                </form>

            </div>
        </div>
    );
}

export default CheckoutPage;
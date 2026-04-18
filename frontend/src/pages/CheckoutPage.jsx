import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { authFetch } from "../utils/auth";

function CheckoutPage() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const { clearCart, total, cartItems } = useCart();

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

        if (cartItems.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

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

            setMessage("Order placed successfully!");

            clearCart();

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
        <div className="min-h-screen bg-gray-100 px-4 py-10 pt-24">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

                {/* Checkout Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
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
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <textarea
                            name="address"
                            placeholder="Delivery Address"
                            value={form.address}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            name="payment_method"
                            value={form.payment_method}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="CreditCard">Online Payment</option>
                        </select>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
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

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Order Summary
                    </h2>

                    {cartItems.length === 0 ? (
                        <p className="text-gray-500">
                            No items in cart.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between border-b pb-3"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {item.product_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-semibold text-green-600">
                                        $
                                        {(
                                            item.product_price *
                                            item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}

                            <div className="pt-4 flex justify-between text-xl font-bold">
                                <span>Total:</span>
                                <span className="text-green-600">
                                    ${Number(total).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default CheckoutPage;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { authFetch } from "../utils/auth";

function CheckoutPage() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();

    const {
        cartItems,
        total,
        clearCart,
    } = useCart();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        payment_method: "COD",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ================= SUBMIT ORDER =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await authFetch(
                `${BASEURL}/api/orders/create/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Failed to place order.");
                return;
            }

            setSuccess(true);
            setMessage("Order placed successfully!");
            clearCart();

            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch {
            setMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10">

            <div className="max-w-6xl mx-auto">

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-800">
                        Checkout
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Complete your order securely
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT SIDE FORM */}
                    <div className="lg:col-span-2">

                        <div className="bg-white rounded-3xl shadow p-8">

                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Shipping Details
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <textarea
                                    name="address"
                                    placeholder="Full Address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                    className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <select
                                    name="payment_method"
                                    value={form.payment_method}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="COD">
                                        Cash on Delivery
                                    </option>

                                    <option value="CreditCard">
                                        Online Payment
                                    </option>
                                </select>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
                                >
                                    {loading
                                        ? "Processing..."
                                        : "Place Order"}
                                </button>

                            </form>

                            {/* Messages */}
                            {message && (
                                <div
                                    className={`mt-5 text-center p-3 rounded-xl ${
                                        success
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {message}
                                </div>
                            )}

                        </div>

                    </div>

                    {/* RIGHT SIDE SUMMARY */}
                    <div>

                        <div className="bg-white rounded-3xl shadow p-6 sticky top-24">

                            <h2 className="text-2xl font-black text-gray-800 mb-6">
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
                                                <p className="font-semibold text-gray-800">
                                                    {item.product_name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>

                                            <p className="font-bold text-green-600">
                                                $
                                                {(
                                                    item.product_price *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}

                                    <div className="pt-4 flex justify-between text-2xl font-black">
                                        <span>Total</span>

                                        <span className="text-green-600">
                                            ${Number(total).toFixed(2)}
                                        </span>
                                    </div>

                                </div>
                            )}

                            <Link
                                to="/cart"
                                className="block text-center mt-6 text-gray-500 hover:text-blue-600"
                            >
                                ← Back to Cart
                            </Link>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default CheckoutPage;
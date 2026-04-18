import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
    const {
        cartItems,
        total,
        loading,
        removeFromCart,
        updateQuantity,
    } = useCart();

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    // ================= IMAGE HELPER =================
    const getImageUrl = (image) => {
        if (!image) {
            return "https://via.placeholder.com/150?text=No+Image";
        }

        return image.startsWith("http")
            ? image
            : `${BASEURL}${image}`;
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">
                Loading cart...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 md:px-8 py-10">

            <div className="max-w-6xl mx-auto">

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-800">
                        Your Cart
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {cartItems.length} item(s) in your cart
                    </p>
                </div>

                {/* Empty Cart */}
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow p-10 text-center">

                        <h2 className="text-2xl font-bold text-gray-700">
                            Your cart is empty
                        </h2>

                        <p className="text-gray-500 mt-3 mb-6">
                            Add some amazing products first.
                        </p>

                        <Link
                            to="/"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
                        >
                            Continue Shopping
                        </Link>

                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* LEFT SIDE ITEMS */}
                        <div className="lg:col-span-2 space-y-5">

                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl shadow p-5 flex flex-col md:flex-row gap-5 md:items-center"
                                >

                                    {/* Image */}
                                    <img
                                        src={getImageUrl(item.product_image)}
                                        alt={item.product_name}
                                        className="w-28 h-28 object-cover rounded-2xl border"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://via.placeholder.com/150?text=No+Image";
                                        }}
                                    />

                                    {/* Info */}
                                    <div className="flex-1">

                                        <h2 className="text-xl font-bold text-gray-800">
                                            {item.product_name}
                                        </h2>

                                        <p className="text-green-600 font-bold text-xl mt-2">
                                            ${item.product_price}
                                        </p>

                                    </div>

                                    {/* Quantity */}
                                    <div className="flex items-center gap-3">

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="w-10 h-10 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold"
                                        >
                                            -
                                        </button>

                                        <span className="w-8 text-center font-bold text-lg">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="w-10 h-10 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold"
                                        >
                                            +
                                        </button>

                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() =>
                                            removeFromCart(item.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold"
                                    >
                                        Remove
                                    </button>

                                </div>
                            ))}

                        </div>

                        {/* RIGHT SIDE SUMMARY */}
                        <div>

                            <div className="bg-white rounded-3xl shadow p-6 sticky top-24">

                                <h2 className="text-2xl font-black text-gray-800 mb-6">
                                    Order Summary
                                </h2>

                                <div className="flex justify-between text-gray-600 mb-3">
                                    <span>Items</span>
                                    <span>{cartItems.length}</span>
                                </div>

                                <div className="flex justify-between text-gray-600 mb-5">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>

                                <hr className="mb-5" />

                                <div className="flex justify-between text-2xl font-black text-green-600 mb-6">
                                    <span>Total</span>
                                    <span>
                                        ${Number(total).toFixed(2)}
                                    </span>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
                                >
                                    Proceed to Checkout
                                </Link>

                                <Link
                                    to="/"
                                    className="block text-center mt-4 text-gray-500 hover:text-blue-600"
                                >
                                    Continue Shopping
                                </Link>

                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default CartPage;
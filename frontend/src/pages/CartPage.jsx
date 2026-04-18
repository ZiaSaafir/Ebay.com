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

    // Smart image helper
    const getImageUrl = (image) => {
        if (!image) {
            return "https://via.placeholder.com/150?text=No+Image";
        }

        return image.startsWith("http")
            ? image
            : `${BASEURL}${image}`;
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-100 px-4 md:px-8 py-8">
            <div className="max-w-6xl mx-auto">

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                    Your Cart
                </h1>

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-20 text-gray-600 text-lg">
                        Loading cart...
                    </div>
                ) : cartItems.length === 0 ? (

                    /* Empty Cart */
                    <div className="bg-white rounded-2xl shadow p-10 text-center">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Your cart is empty
                        </h2>

                        <p className="text-gray-500 mb-6">
                            Add products to your cart and come back here.
                        </p>

                        <Link
                            to="/"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="space-y-4">

                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl shadow p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-5 justify-between"
                                >

                                    {/* Left Side */}
                                    <div className="flex items-center gap-4 flex-1">

                                        <img
                                            src={getImageUrl(item.product_image)}
                                            alt={item.product_name}
                                            className="w-24 h-24 object-cover rounded-xl border"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/150?text=No+Image";
                                            }}
                                        />

                                        <div>
                                            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                                                {item.product_name}
                                            </h2>

                                            <p className="text-green-600 font-bold text-lg mt-1">
                                                ${item.product_price}
                                            </p>
                                        </div>
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
                                            className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold"
                                        >
                                            -
                                        </button>

                                        <span className="font-semibold text-lg min-w-[25px] text-center">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() =>
                                            removeFromCart(item.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                                    >
                                        Remove
                                    </button>

                                </div>
                            ))}

                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl shadow mt-8 p-6">

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Total:
                                    </h2>

                                    <p className="text-3xl text-green-600 font-black mt-1">
                                        ${Number(total).toFixed(2)}
                                    </p>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-center transition"
                                >
                                    Proceed to Checkout
                                </Link>

                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CartPage;
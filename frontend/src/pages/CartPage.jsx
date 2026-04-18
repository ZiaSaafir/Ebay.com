import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
function CartPage() {
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    return (
        <div className="pt-20 min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl mb-4">Your Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-center text-gray-600">
                    Your cart is empty
                </p>
            ) : (
                cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between bg-white p-4 mb-3 rounded shadow"
                    >
                        {/* Image */}
                        <div className="flex items-center gap-4">
                            {item.product_image && (
                                <img
                                    src={`${BASEURL}${item.product_image}`}
                                    alt={item.product_name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <h2 className="text-lg font-semibold">
                                {item.product_name}
                            </h2>
                            <p className="text-gray-600">
                                ${item.product_price}
                            </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                className="bg-gray-300 px-3"
                                onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                }
                            >
                                -
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                className="bg-gray-300 px-3"
                                onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                }
                            >
                                +
                            </button>
                        </div>

                        {/* Remove Button */}
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => removeFromCart(item.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))
            )}

            {/* Total Section */}
            <div className="border-t pt-4 mt-4 flex justify-between">
                <h2 className="text-xl font-bold">Total:</h2>
                <p className="text-xl font-semibold">
                    ${total.toFixed(2)}
                </p>
                <Link to="/checkout" className="bg-blue-600  font-600  text-white  p-4 rounded ">
                Process to Checkout</Link>
            </div>
        </div>
    );
}

export default CartPage;
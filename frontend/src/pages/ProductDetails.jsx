import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { clearTokens } from "../utils/auth";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const { addToCart, cartItems } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userName, setUserName] = useState("");

    const isLoggedIn = !!localStorage.getItem("access_token");

    const cartCount =
        cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

    // Fetch Product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${BASEURL}/api/products/${id}/`);

                if (!res.ok) throw new Error("Product not found");

                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, BASEURL]);

    // Fetch User
    useEffect(() => {
        if (!isLoggedIn) return;

        const token = localStorage.getItem("access_token");

        fetch(`${BASEURL}/api/users/profile/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUserName(
                    data.username ||
                        data.email?.split("@")[0] ||
                        "User"
                );
            })
            .catch(() => {});
    }, [isLoggedIn, BASEURL]);

    // Add To Cart
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        try {
            setAdding(true);
            await addToCart(product);
            setSuccess(true);

            setTimeout(() => setSuccess(false), 2500);
        } catch {
            alert("Failed to add item.");
        } finally {
            setAdding(false);
        }
    };

    // Logout
    const handleLogout = () => {
        clearTokens();
        navigate("/login");
    };

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-lg text-gray-500">
                Loading Product...
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <p className="text-red-600 text-xl font-semibold mb-4">
                    {error}
                </p>

                <Link
                    to="/"
                    className="text-blue-600 hover:underline"
                >
                    Back Home
                </Link>
            </div>
        );
    }

    const imageUrl = product.image?.startsWith("http")
        ? product.image
        : `${BASEURL}${product.image}`;

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <div className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

                    <Link
                        to="/"
                        className="text-2xl font-bold text-gray-800"
                    >
                        Epnic<span className="text-blue-600">.com</span>
                    </Link>

                    <div className="flex items-center gap-5">

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative"
                        >
                            🛒

                            {cartCount > 0 && (
                                <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User */}
                        {!isLoggedIn ? (
                            <div className="flex gap-3">
                                <Link
                                    to="/login"
                                    className="text-gray-700"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Signup
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">

                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold">
                                    {userName.charAt(0).toUpperCase()}
                                </div>

                                <span className="hidden sm:block text-gray-700">
                                    {userName}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product */}
            <div className="max-w-6xl mx-auto px-4 py-10">

                <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-6">

                    {/* Image */}
                    <div className="bg-gray-100 rounded-xl overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-[500px] object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between">

                        <div>

                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                                In Stock
                            </span>

                            <h1 className="text-4xl font-bold mt-4 text-gray-800">
                                {product.name}
                            </h1>

                            <p className="text-3xl text-green-600 font-bold mt-4">
                                ${product.price}
                            </p>

                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-600 mb-2">
                                    Description
                                </h3>

                                <p className="text-gray-700 leading-7">
                                    {product.description ||
                                        "No description available."}
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-8 space-y-4">

                            {success && (
                                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-center">
                                    Added to cart successfully ✓
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                            >
                                {adding ? "Adding..." : "Add To Cart"}
                            </button>

                            <Link
                                to="/"
                                className="block text-center text-gray-600 hover:text-blue-600"
                            >
                                ← Back To Products
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
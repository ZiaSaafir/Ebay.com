import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { clearTokens } from "../utils/auth";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const { addToCart, cartCount } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState(false);

    const token = localStorage.getItem("access_token");
    const isLoggedIn = !!token;

    // ================= FETCH PRODUCT =================
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${BASEURL}/api/products/${id}/`
                );

                if (!res.ok) {
                    throw new Error("Product not found");
                }

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

    // ================= ADD TO CART =================
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        try {
            setAdding(true);

            const ok = await addToCart(product);

            if (ok) {
                setSuccess(true);

                setTimeout(() => {
                    setSuccess(false);
                }, 2500);
            }
        } finally {
            setAdding(false);
        }
    };

    // ================= LOGOUT =================
    const handleLogout = () => {
        clearTokens();
        navigate("/login");
        window.location.reload();
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">
                Loading Product...
            </div>
        );
    }

    // ================= ERROR =================
    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    {error || "Product not found"}
                </h2>

                <Link
                    to="/"
                    className="text-blue-600 hover:underline"
                >
                    Back Home
                </Link>
            </div>
        );
    }

    // ================= IMAGE =================
    const imageUrl = product?.image
        ? product.image.startsWith("http")
            ? product.image
            : `${BASEURL}${product.image}`
        : "https://via.placeholder.com/600x500?text=No+Image";

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                    <Link
                        to="/"
                        className="text-2xl font-black text-gray-800"
                    >
                        Epnic<span className="text-blue-600">.com</span>
                    </Link>

                    <div className="flex items-center gap-5">

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative text-xl"
                        >
                            🛒

                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {!isLoggedIn ? (
                            <>
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
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="text-red-500 font-medium"
                            >
                                Logout
                            </button>
                        )}

                    </div>
                </div>
            </header>

            {/* Product Section */}
            <section className="max-w-6xl mx-auto px-4 py-10">

                <div className="grid md:grid-cols-2 gap-10 bg-white rounded-3xl shadow-lg p-6 md:p-10">

                    {/* Image */}
                    <div className="bg-gray-100 rounded-2xl overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-[500px] object-cover"
                            onError={(e) => {
                                e.target.src =
                                    "https://via.placeholder.com/600x500?text=No+Image";
                            }}
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between">

                        <div>

                            <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                                In Stock
                            </span>

                            <h1 className="text-4xl font-black text-gray-800 mt-4">
                                {product.name}
                            </h1>

                            <p className="text-3xl font-bold text-green-600 mt-5">
                                ${product.price}
                            </p>

                            <div className="mt-8">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Description
                                </h3>

                                <p className="text-gray-600 leading-7">
                                    {product.description ||
                                        "No description available."}
                                </p>
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="mt-10 space-y-4">

                            {success && (
                                <div className="bg-green-100 text-green-700 text-center px-4 py-3 rounded-xl">
                                    Added to cart successfully ✓
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition"
                            >
                                {adding ? "Adding..." : "Add To Cart"}
                            </button>

                            <Link
                                to="/cart"
                                className="block text-center bg-gray-100 hover:bg-gray-200 py-4 rounded-xl font-semibold text-gray-700"
                            >
                                View Cart
                            </Link>

                            <Link
                                to="/"
                                className="block text-center text-gray-500 hover:text-blue-600"
                            >
                                ← Back To Products
                            </Link>

                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProductDetails;
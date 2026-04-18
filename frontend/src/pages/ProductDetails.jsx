import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [userName, setUserName] = useState("");

    const { addToCart, cartItems } = useCart();

    const isLoggedIn = !!localStorage.getItem("access_token");
    
    const cartCount = cartItems?.reduce(
        (total, item) => total + item.quantity,
        0
    ) || 0;

    // ---------------- FETCH USER INFO ----------------
    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem("access_token");
            fetch(`${BASEURL}/api/users/profile/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.username) {
                    setUserName(data.username);
                } else if (data.email) {
                    setUserName(data.email.split('@')[0]);
                }
            })
            .catch(err => console.error("Failed to fetch user:", err));
        }
    }, [isLoggedIn, BASEURL]);

    // ---------------- FETCH PRODUCT ----------------
    useEffect(() => {
        fetch(`${BASEURL}/api/products/${id}/`)
            .then((res) => {
                if (!res.ok) throw new Error("Product not found");
                return res.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id, BASEURL]);

    // ---------------- ADD TO CART HANDLER ----------------
    const handleAddToCart = async () => {
        // Check if user is logged in
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        // Check if product exists
        if (!product) {
            console.error("No product to add");
            return;
        }

        setAddingToCart(true);
        setAddSuccess(false);

        try {
            // Call addToCart from context (this already has authFetch)
            await addToCart(product);
            
            // Show success message
            setAddSuccess(true);
            setTimeout(() => setAddSuccess(false), 3000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart. Please try again.");
        } finally {
            setAddingToCart(false);
        }
    };

    // ---------------- LOGOUT HANDLER ----------------
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
                Loading product...
            </div>
        );
    }

    // ---------------- ERROR ----------------
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <p className="text-red-500 font-bold text-xl">
                    {error}
                </p>
                <Link to="/" className="text-blue-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    // ---------------- SAFE IMAGE ----------------
    const imageUrl = product?.image
        ? product.image.startsWith("http")
            ? product.image
            : `${BASEURL}${product.image}`
        : null;

    return (
        <>
            {/* Top Bar with User Info and Cart */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold text-gray-800">
                        Epnic<span className="text-indigo-600">.com</span>
                    </Link>

                    {/* User Info & Cart Section */}
                    <div className="flex items-center gap-4">
                        {/* Cart Icon with Count */}
                        <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 21v-4" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Info */}
                        {!isLoggedIn ? (
                            <div className="flex gap-2">
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700">
                                    Signup
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-semibold text-sm">
                                            {userName ? userName.charAt(0).toUpperCase() : "U"}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 font-medium hidden sm:inline">
                                        {userName || "User"}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-red-600 text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero Section Banner */}
            <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Product Details</h1>
                    <p className="text-lg text-blue-100">View and manage your product</p>
                </div>
            </div>

            {/* Product Details */}
            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">

                    {/* IMAGE */}
                    <div className="h-96 md:h-[600px] bg-gray-100">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* DETAILS */}
                    <div className="p-8 flex flex-col justify-between">

                        <div>
                            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                In Stock
                            </span>

                            <h1 className="text-3xl font-bold mt-4">
                                {product.name}
                            </h1>

                            <p className="text-green-600 text-2xl font-bold mt-3">
                                ${product.price}
                            </p>

                            <div className="mt-6 border-t pt-4">
                                <h3 className="text-gray-500 text-sm uppercase">
                                    Description
                                </h3>
                                <p className="text-gray-700 mt-2">
                                    {product.description || "No description available."}
                                </p>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="mt-8 space-y-3">
                            {/* Success Message */}
                            {addSuccess && (
                                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center text-sm">
                                    ✓ Item added to cart successfully!
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className={`w-full py-3 rounded-lg font-semibold transition ${
                                    addingToCart 
                                        ? "bg-gray-400 cursor-not-allowed" 
                                        : "bg-blue-600 hover:bg-blue-700"
                                } text-white`}
                            >
                                {addingToCart ? "Adding..." : "Add to Cart"}
                            </button>

                            <Link
                                to="/"
                                className="block text-center text-gray-600 hover:text-blue-600"
                            >
                                Back to Products
                            </Link>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetails;
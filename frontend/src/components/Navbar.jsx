import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearTokens, authFetch } from "../utils/auth";
import { useState, useEffect, useMemo } from "react";

function Navbar({ onSearch }) {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [query, setQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [loadingUser, setLoadingUser] = useState(false);

    const isLoggedIn = !!localStorage.getItem("access_token");

    // ---------------- FETCH USER PROFILE ----------------
    useEffect(() => {
        if (!isLoggedIn) {
            setUserName("");
            return;
        }

        const fetchUser = async () => {
            setLoadingUser(true);

            try {
                const res = await authFetch(`${BASEURL}/api/users/profile/`);
                const data = await res.json();

                if (data.username) {
                    setUserName(data.username);
                } else if (data.email) {
                    setUserName(data.email.split("@")[0]);
                } else {
                    setUserName("User");
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUserName("User");
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [isLoggedIn, BASEURL]);

    // ---------------- CART COUNT ----------------
    const cartCount = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    // ---------------- LOGOUT ----------------
    const handleLogout = () => {
        clearTokens();
        setUserName("");
        setIsMobileMenuOpen(false);
        navigate("/login");
    };

    // ---------------- SEARCH ----------------
    const handleSearch = (e) => {
        e.preventDefault();

        const cleanQuery = query.trim();

        if (onSearch) {
            onSearch(cleanQuery);
        }

        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-50">
                {/* Desktop Navbar */}
                <div className="px-4 py-3 md:px-6 md:py-4">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <Link
                            to="/"
                            className="text-xl md:text-2xl font-bold text-gray-800 hover:text-indigo-600 transition"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Epnic<span className="text-indigo-600">.com</span>
                        </Link>

                        {/* Search Desktop */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex gap-2 w-1/2 max-w-md"
                        >
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white"
                            >
                                Search
                            </button>
                        </form>

                        {/* Desktop Right */}
                        <div className="hidden md:flex items-center gap-6">

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative text-gray-700 hover:text-indigo-600 flex items-center gap-1"
                            >
                                🛒 Cart

                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Guest */}
                            {!isLoggedIn ? (
                                <div className="flex gap-3">
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-indigo-600"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white"
                                    >
                                        Signup
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">

                                    {/* User */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 font-semibold text-sm">
                                                {loadingUser
                                                    ? "..."
                                                    : userName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="text-sm">
                                            <p className="font-medium text-gray-700">
                                                {loadingUser ? "Loading..." : userName}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Welcome!
                                            </p>
                                        </div>
                                    </div>

                                    {/* Logout */}
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-700 hover:text-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t bg-white px-4 py-4 space-y-4">

                        {/* Search Mobile */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 px-4 py-2 border rounded-lg"
                            />

                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                            >
                                Search
                            </button>
                        </form>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-gray-700"
                        >
                            🛒 Cart ({cartCount})
                        </Link>

                        {/* Guest Mobile */}
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-gray-700"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block bg-indigo-600 text-white px-4 py-2 rounded-lg text-center"
                                >
                                    Signup
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-700 font-medium">
                                    {userName}
                                </p>

                                <button
                                    onClick={handleLogout}
                                    className="text-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Spacer */}
            <div className="h-16 md:h-20"></div>
        </>
    );
}

export default Navbar;
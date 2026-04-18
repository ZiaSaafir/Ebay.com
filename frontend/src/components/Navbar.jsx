import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearTokens } from "../utils/auth";
import { useState, useEffect } from "react";

function Navbar({ onSearch }) {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userName, setUserName] = useState("");

    const isLoggedIn = !!localStorage.getItem("access_token");

    // Fetch user info when logged in
    useEffect(() => {
        if (isLoggedIn) {
            const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
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
    }, [isLoggedIn]);

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleLogout = () => {
        clearTokens();
        navigate("/login");
        setIsMobileMenuOpen(false);
        setUserName("");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-50">
                {/* Desktop Navigation */}
                <div className="px-4 py-3 md:px-6 md:py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link 
                            to="/" 
                            className="text-xl md:text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Epnic<span className="text-indigo-600">.com</span>
                        </Link>

                        {/* Search - Desktop */}
                        <form onSubmit={handleSearch} className="hidden md:flex gap-2 w-1/2 max-w-md">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            <button 
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap"
                            >
                                Search
                            </button>
                        </form>

                        {/* Desktop Right Section */}
                        <div className="hidden md:flex items-center gap-6">
                            {/* Cart with Icon */}
                            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 transition-colors font-medium flex items-center gap-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 21v-4" />
                                </svg>
                                Cart
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Profile & Auth */}
                            {!isLoggedIn ? (
                                <div className="flex gap-3">
                                    <Link 
                                        to="/login" 
                                        className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                                    >
                                        Signup
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    {/* User Info */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 font-semibold text-sm">
                                                {userName ? userName.charAt(0).toUpperCase() : "U"}
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-gray-700 font-medium">{userName || "User"}</p>
                                            <p className="text-gray-400 text-xs">Welcome!</p>
                                        </div>
                                    </div>
                                    
                                    {/* Logout Button */}
                                    <button 
                                        onClick={handleLogout}
                                        className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white">
                        <div className="px-4 py-4 space-y-4">
                            {/* Search - Mobile */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                                <button 
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                                >
                                    Search
                                </button>
                            </form>

                            {/* User Info - Mobile when logged in */}
                            {isLoggedIn && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-semibold text-lg">
                                            {userName ? userName.charAt(0).toUpperCase() : "U"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold">{userName || "User"}</p>
                                        <p className="text-gray-500 text-xs">Logged in</p>
                                    </div>
                                </div>
                            )}

                            {/* Cart - Mobile */}
                            <Link 
                                to="/cart" 
                                className="flex items-center justify-between py-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 21v-4" />
                                    </svg>
                                    Cart
                                </div>
                                {cartCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                        {cartCount} items
                                    </span>
                                )}
                            </Link>

                            {/* Auth UI - Mobile */}
                            {!isLoggedIn ? (
                                <div className="space-y-2 pt-2">
                                    <Link 
                                        to="/login" 
                                        className="block py-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="block text-center bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Signup
                                    </Link>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left py-2 text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer */}
            <div className="h-16 md:h-20"></div>
        </>
    );
}

export default Navbar;
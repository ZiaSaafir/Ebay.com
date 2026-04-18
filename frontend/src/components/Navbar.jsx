import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearTokens } from "../utils/auth";

function Navbar({ onSearch }) {
    const navigate = useNavigate();

    const {
        cartItems = [],
    } = useCart();

    const [menuOpen, setMenuOpen] = useState(false);

    const token = localStorage.getItem("access_token");

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleLogout = () => {
        clearTokens();
        navigate("/login");
        window.location.reload();
    };

    const userName =
        localStorage.getItem("username") || "User";

    return (
        <header className="bg-white shadow sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-4 py-4">

                {/* Top Row */}
                <div className="flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl md:text-3xl font-black text-gray-800 shrink-0"
                    >
                        Epnic
                        <span className="text-blue-600">
                            .com
                        </span>
                    </Link>

                    {/* Search Desktop */}
                    <div className="hidden md:block w-full max-w-xl">
                        <input
                            type="text"
                            placeholder="Search products..."
                            onChange={(e) =>
                                onSearch?.(
                                    e.target.value
                                )
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative text-2xl"
                        >
                            🛒

                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-3">

                            {!token ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="font-medium text-gray-700 hover:text-blue-600"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                                    >
                                        Signup
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-600">
                                        Hi,{" "}
                                        <strong>
                                            {userName}
                                        </strong>
                                    </span>

                                    <button
                                        onClick={
                                            handleLogout
                                        }
                                        className="text-red-500 font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}

                        </div>

                        {/* Mobile Menu */}
                        <button
                            onClick={() =>
                                setMenuOpen(
                                    !menuOpen
                                )
                            }
                            className="md:hidden text-2xl"
                        >
                            ☰
                        </button>

                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden mt-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        onChange={(e) =>
                            onSearch?.(
                                e.target.value
                            )
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Mobile Menu Dropdown */}
                {menuOpen && (
                    <div className="md:hidden mt-4 border-t pt-4 flex flex-col gap-3">

                        {!token ? (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                    className="text-gray-700 font-medium"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                    className="text-blue-600 font-medium"
                                >
                                    Signup
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-600">
                                    Hi,{" "}
                                    <strong>
                                        {userName}
                                    </strong>
                                </span>

                                <button
                                    onClick={
                                        handleLogout
                                    }
                                    className="text-left text-red-500 font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </div>
                )}

            </div>
        </header>
    );
}

export default Navbar;
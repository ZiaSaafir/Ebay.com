import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">

            <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Brand */}
                <div>
                    <h2 className="text-3xl font-black text-white">
                        Epnic
                        <span className="text-blue-500">
                            .com
                        </span>
                    </h2>

                    <p className="mt-4 text-sm leading-6 text-gray-400">
                        Your trusted online shopping destination.
                        Premium products, secure checkout,
                        fast delivery and great prices.
                    </p>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">
                        Shop
                    </h3>

                    <ul className="space-y-3 text-sm">
                        <li>
                            <Link
                                to="/"
                                className="hover:text-white"
                            >
                                All Products
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/cart"
                                className="hover:text-white"
                            >
                                Cart
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/checkout"
                                className="hover:text-white"
                            >
                                Checkout
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Account */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">
                        Account
                    </h3>

                    <ul className="space-y-3 text-sm">
                        <li>
                            <Link
                                to="/login"
                                className="hover:text-white"
                            >
                                Login
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/signup"
                                className="hover:text-white"
                            >
                                Signup
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">
                        Contact
                    </h3>

                    <ul className="space-y-3 text-sm text-gray-400">
                        <li>Email: support@epnic.com</li>
                        <li>Phone: +92 300 0000000</li>
                        <li>Peshawar, Pakistan</li>
                    </ul>
                </div>

            </div>

            {/* Bottom */}
            <div className="border-t border-gray-800 py-5 px-4">

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">

                    <p>
                        © {new Date().getFullYear()} Epnic.com
                        All rights reserved.
                    </p>

                    <p>
                        Built with React + Django REST API
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

function ProductList() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH PRODUCTS =================
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${BASEURL}/api/products/`);

                if (!res.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await res.json();

                setProducts(data);
                setFilteredProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [BASEURL]);

    // ================= SEARCH =================
    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredProducts(products);
            return;
        }

        const result = products.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredProducts(result);
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-xl text-gray-500">
                Loading Products...
            </div>
        );
    }

    // ================= ERROR =================
    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-600 text-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Navbar */}
            <Navbar onSearch={handleSearch} />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">

                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Welcome to Epnic Store
                    </h1>

                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                        Discover premium products with amazing prices and fast delivery.
                    </p>

                    <div className="mt-6 text-sm md:text-base text-blue-100">
                        {filteredProducts.length} Products Available
                    </div>

                </div>
            </section>

            {/* Products Header */}
            <div className="max-w-7xl mx-auto w-full px-4 pt-8">
                <div className="flex justify-between items-center border-b pb-4">

                    <h2 className="text-2xl font-bold text-gray-800">
                        All Products
                    </h2>

                    <span className="text-gray-500 text-sm">
                        {filteredProducts.length} Items Found
                    </span>

                </div>
            </div>

            {/* Product Grid */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-10">

                {filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg">
                        No products found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}

                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Epnic.com — All Rights Reserved.
            </footer>

        </div>
    );
}

export default ProductList;
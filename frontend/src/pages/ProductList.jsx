import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

function ProductList() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ---------------- FETCH PRODUCTS ----------------
    useEffect(() => {
        fetch(`${BASEURL}/api/products/`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch products");
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [BASEURL]);

    // ---------------- SEARCH FUNCTION ----------------
    const handleSearch = (query) => {
        if (!query) {
            setFilteredProducts(products);
            return;
        }

        const result = products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredProducts(result);
    };

    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading products...
            </div>
        );
    }

    // ---------------- ERROR ----------------
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* NAVBAR with SEARCH */}
            <Navbar onSearch={handleSearch} />

            {/* Hero Section Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 py-16 md:py-24">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Welcome to Our Store
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                        Discover amazing products at great prices. Shop now and enjoy exclusive deals!
                    </p>
                    <div className="mt-6 text-sm text-blue-100">
                        {filteredProducts.length} Products Available
                    </div>
                </div>
            </div>

            {/* HEADER - Removed duplicate header since hero section replaces it */}
            <div className="max-w-7xl mx-auto w-full px-4 pt-6">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-semibold text-gray-700">All Products</h2>
                    <div className="text-sm text-gray-500">
                        {filteredProducts.length} Items Found
                    </div>
                </div>
            </div>

            {/* PRODUCTS */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400">
                            No products found
                        </div>
                    )}

                </div>
            </main>

            {/* FOOTER */}
            <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} ZiaCart. All rights reserved.
            </footer>

        </div>
    );
}

export default ProductList;
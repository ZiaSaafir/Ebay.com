import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const imageUrl = product?.image
        ? product.image
        : "https://via.placeholder.com/400x300?text=No+Image";

    return (
        <Link to={`/product/${product.id}`}>
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden cursor-pointer h-full flex flex-col">

                {/* Product Image */}
                <div className="relative overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        New
                    </span>
                </div>

                {/* Product Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-800 truncate mb-1">
                        {product.name}
                    </h2>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                        {product.description ||
                            "High quality product with premium features."}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-2xl font-black text-green-600">
                            ${product.price}
                        </span>

                        <button
                            onClick={handleAddToCart}
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-gray-800 active:scale-95"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
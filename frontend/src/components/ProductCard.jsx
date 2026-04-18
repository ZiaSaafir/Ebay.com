import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        await addToCart(product);
    };

    const imageUrl = product?.image
        ? product.image
        : "https://via.placeholder.com/400x300?text=No+Image";

    return (
        <Link to={`/product/${product.id}`}>
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">

                {/* Image */}
                <div className="overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                    />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">

                    <h2 className="text-xl font-bold text-gray-800 truncate">
                        {product.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">
                        {product.description || "Premium quality product"}
                    </p>

                    <div className="mt-5 flex items-center justify-between">

                        <span className="text-2xl font-black text-green-600">
                            ${product.price}
                        </span>

                        <button
                            onClick={handleAddToCart}
                            className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                            Add
                        </button>

                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
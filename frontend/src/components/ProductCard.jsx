import { Link } from "react-router-dom";


function ProductCard({ product }) {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    return (
        <Link to={`/product/${product.id}`}>
   
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden cursor-pointer">

              
                <div className="relative overflow-hidden">

                    <img
                        src={`${BASEURL}${product.image}`}
                        alt={product.name}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                    />
                
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        New
                    </span>
                </div>

          
                <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-800 truncate mb-1">
                        {product.name}
                    </h2>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {product.description || "High quality product with premium features."}
                    </p>

                    <div className="flex items-center justify-between mt-auto">

                        <span className="text-2xl font-black text-green-600">
                            ${product.price}
                        </span>

                        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-gray-800 active:scale-95">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard;

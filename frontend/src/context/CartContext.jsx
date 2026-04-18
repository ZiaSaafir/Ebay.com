import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    // ---------------- FETCH CART ----------------
    const fetchCart = async () => {
        try {
            setLoading(true);

            const res = await authFetch(`${BASEURL}/api/cart/`);

            if (!res.ok) {
                throw new Error("Failed to fetch cart");
            }

            const data = await res.json();

            setCartItems(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Fetch cart error:", error);
            setCartItems([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (token) {
            fetchCart();
        }
    }, []);

    // ---------------- ADD TO CART ----------------
    const addToCart = async (product) => {
        try {
            const res = await authFetch(`${BASEURL}/api/cart/add/`, {
                method: "POST",
                body: JSON.stringify({
                    product_id: product.id,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to add item");
            }

            fetchCart();
        } catch (error) {
            console.error("Add to cart error:", error);
        }
    };

    // ---------------- UPDATE QUANTITY ----------------
    const updateQuantity = async (id, quantity) => {
        try {
            const res = await authFetch(`${BASEURL}/api/cart/update/`, {
                method: "POST",
                body: JSON.stringify({
                    item_id: id,
                    quantity: quantity,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update item");
            }

            fetchCart();
        } catch (error) {
            console.error("Update quantity error:", error);
        }
    };

    // ---------------- REMOVE ITEM ----------------
    const removeFromCart = async (id) => {
        try {
            const res = await authFetch(`${BASEURL}/api/cart/remove/`, {
                method: "POST",
                body: JSON.stringify({
                    item_id: id,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to remove item");
            }

            fetchCart();
        } catch (error) {
            console.error("Remove item error:", error);
        }
    };

    // ---------------- CLEAR CART ----------------
    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                total,
                loading,
                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
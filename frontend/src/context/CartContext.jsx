import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../utils/auth"; // 👈 import your helper

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    // ---------------- FETCH CART ----------------
    const fetchCart = async () => {
        try {
            const res = await authFetch(`${BASEURL}/api/cart/`);
            const data = await res.json();

            setCartItems(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Fetch cart error:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // ---------------- ADD TO CART ----------------
    const addToCart = async (product) => {
        try {
            await authFetch(`${BASEURL}/api/cart/add/`, {
                method: "POST",
                body: JSON.stringify({
                    product_id: product.id,
                }),
            });

            fetchCart();
        } catch (error) {
            console.error("Add to cart error:", error);
        }
    };

    // ---------------- CLEAR CART ----------------
    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    };

    // ---------------- UPDATE ----------------
    const updateQuantity = async (id, quantity) => {
        try {
            await authFetch(`${BASEURL}/api/cart/update/`, {
                method: "POST",
                body: JSON.stringify({
                    item_id: id,
                    quantity: quantity,
                }),
            });

            fetchCart();
        } catch (error) {
            console.error("Update quantity error:", error);
        }
    };

    // ---------------- REMOVE ----------------
    const removeFromCart = async (id) => {
        try {
            await authFetch(`${BASEURL}/api/cart/remove/`, {
                method: "POST",
                body: JSON.stringify({
                    item_id: id,
                }),
            });

            fetchCart();
        } catch (error) {
            console.error("Remove item error:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                total,
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
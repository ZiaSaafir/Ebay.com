import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { authFetch } from "../utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Toast State
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // ================= TOAST =================
    const showToast = (
        message,
        type = "success"
    ) => {
        setToast({
            show: true,
            message,
            type,
        });

        setTimeout(() => {
            setToast({
                show: false,
                message: "",
                type: "success",
            });
        }, 2200);
    };

    // ================= FETCH CART =================
    const fetchCart = useCallback(async () => {
        const token =
            localStorage.getItem(
                "access_token"
            );

        if (!token) {
            setCartItems([]);
            setTotal(0);
            return;
        }

        try {
            setLoading(true);

            const res = await authFetch(
                `${BASEURL}/api/cart/`
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to fetch cart"
                );
            }

            const data = await res.json();

            setCartItems(
                data.items || []
            );

            setTotal(
                Number(data.total) || 0
            );

        } catch (error) {
            console.error(
                "Fetch cart error:",
                error
            );

            setCartItems([]);
            setTotal(0);

        } finally {
            setLoading(false);
        }
    }, [BASEURL]);

    // ================= AUTO LOAD =================
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // ================= ADD TO CART =================
    const addToCart = async (
        product
    ) => {
        try {
            const res =
                await authFetch(
                    `${BASEURL}/api/cart/add/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            {
                                product_id:
                                    product.id,
                            }
                        ),
                    }
                );

            if (!res.ok) {
                throw new Error(
                    "Failed to add product"
                );
            }

            await fetchCart();

            showToast(
                "Added to cart ✓",
                "success"
            );

            return true;

        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            showToast(
                "Failed to add item",
                "error"
            );

            return false;
        }
    };

    // ================= UPDATE QUANTITY =================
    const updateQuantity =
        async (
            itemId,
            quantity
        ) => {
            if (quantity < 1) return;

            try {
                const res =
                    await authFetch(
                        `${BASEURL}/api/cart/update/`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify(
                                {
                                    item_id:
                                        itemId,
                                    quantity,
                                }
                            ),
                        }
                    );

                if (!res.ok) {
                    throw new Error(
                        "Failed to update quantity"
                    );
                }

                await fetchCart();

            } catch (error) {
                console.error(
                    "Update quantity error:",
                    error
                );

                showToast(
                    "Update failed",
                    "error"
                );
            }
        };

    // ================= REMOVE ITEM =================
    const removeFromCart =
        async (itemId) => {
            try {
                const res =
                    await authFetch(
                        `${BASEURL}/api/cart/remove/`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify(
                                {
                                    item_id:
                                        itemId,
                                }
                            ),
                        }
                    );

                if (!res.ok) {
                    throw new Error(
                        "Failed to remove item"
                    );
                }

                await fetchCart();

                showToast(
                    "Item removed",
                    "error"
                );

            } catch (error) {
                console.error(
                    "Remove item error:",
                    error
                );
            }
        };

    // ================= CLEAR CART =================
    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    };

    // ================= COUNT =================
    const cartCount =
        cartItems.reduce(
            (sum, item) =>
                sum +
                item.quantity,
            0
        );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                total,
                loading,
                cartCount,
                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >

            {children}

            {/* Toast */}
            {toast.show && (
                <div
                    className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-xl shadow-xl text-white font-semibold transition-all ${
                        toast.type ===
                        "success"
                            ? "bg-green-600"
                            : "bg-red-500"
                    }`}
                >
                    {toast.message}
                </div>
            )}

        </CartContext.Provider>
    );
};

export const useCart = () =>
    useContext(CartContext);
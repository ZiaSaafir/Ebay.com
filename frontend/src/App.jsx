import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRouter from "./components/PrivateRouter";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route element={<PrivateRouter />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
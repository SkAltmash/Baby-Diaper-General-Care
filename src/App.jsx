import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all" element={<AllProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element ={<Signup />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cheekout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
       <Route path="/my-orders" element={<MyOrders />} />

      </Routes>
      <Footer />
      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;

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
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import AdminOrders from "./admin/AdminOrders"
import AdminProducts from "./admin/AdminProducts";
import AddProduct from "./admin/AddProduct";
import AdminDashboard from "./admin/Admin";
import AdminEditProduct from "./admin/EditProduct";
import MyOrderDetails from "./pages/MyOrderDetails";
import AdminReviews from "./admin/AdminReviews";
import AdminUsers from "./admin/AdminUsers";
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
        <Route path="/my-orders/:orderId" element={<MyOrderDetails />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/admin" element={ <ProtectedAdminRoute> <AdminDashboard /> </ProtectedAdminRoute> }/>
      <Route path="/admin/orders" element={ <ProtectedAdminRoute> <AdminOrders /> </ProtectedAdminRoute> }/>
      <Route path="/admin/products" element={ <ProtectedAdminRoute> <AdminProducts /> </ProtectedAdminRoute> }/>
      <Route path="/admin/add-product" element={ <ProtectedAdminRoute> <AddProduct /> </ProtectedAdminRoute> }/>
      <Route path="/admin/edit-product/:firebaseId" element={ <ProtectedAdminRoute> <AdminEditProduct /> </ProtectedAdminRoute> }/>
        <Route path="/admin/reviews" element ={<ProtectedAdminRoute><AdminReviews /></ProtectedAdminRoute>} />
      <Route path="/admin/users" element ={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
      </Routes>
      <Footer />
      <ScrollToTop />
    </BrowserRouter>
  );
}
export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
// Public / Common

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";
import WishlistLoader from "./components/WishlistLoader";
// Customer
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import AdminLayout from "./components/AdminLayout";
// Seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerAddProduct from "./pages/seller/SellerAddProduct";
import SellerEditProduct from "./pages/seller/SellerEditProduct";
import SellerOrders from "./pages/seller/SellerOrders";
function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Loads wishlist data when customer is logged in */} <WishlistLoader />{" "}
      <Routes>
        {" "}
        {/* ========================= PUBLIC ROUTES ========================== */}{" "}
        <Route path="/login" element={<Login />} />{" "}
        <Route path="/register" element={<Register />} />{" "}
        <Route path="/unauthorized" element={<Unauthorized />} />{" "}
        {/* Redirect user based on role */}{" "}
        <Route path="/" element={<RoleRedirect />} />{" "}
        {/* ========================= CUSTOMER ROUTES ========================== */}{" "}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <Home />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <Products />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <ProductDetails />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <Cart />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <Checkout />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <Orders />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <OrderDetails />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <Wishlist />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <Profile />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <PaymentSuccess />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/payment-cancelled"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              {" "}
              <PaymentCancelled />{" "}
            </ProtectedRoute>
          }
        />{" "}
        {/* ========================= ADMIN ROUTES ========================== */}{" "}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <AdminLayout>
                {" "}
                <AdminDashboard />{" "}
              </AdminLayout>{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <AdminLayout>
                {" "}
                <AdminUsers />{" "}
              </AdminLayout>{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <AdminLayout>
                {" "}
                <AdminProducts />{" "}
              </AdminLayout>{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/products/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <AdminLayout>
                {" "}
                <AdminProductDetails />{" "}
              </AdminLayout>{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <AdminLayout>
                {" "}
                <AdminOrders />{" "}
              </AdminLayout>{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <AdminLayout>
                {" "}
                <AdminCategories />{" "}
              </AdminLayout>{" "}
            </ProtectedRoute>
          }
        />{" "}
        {/* ========================= SELLER ROUTES ========================== */}{" "}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              {" "}
              <SellerDashboard />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/seller/products"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              {" "}
              <SellerProducts />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/seller/products/add"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              {" "}
              <SellerAddProduct />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/seller/products/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              {" "}
              <SellerEditProduct />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              {" "}
              <SellerOrders />{" "}
            </ProtectedRoute>
          }
        />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}
export default App;

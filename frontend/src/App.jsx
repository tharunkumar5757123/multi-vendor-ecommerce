import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public / Common
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLoader from "./components/AuthLoader";
import WishlistLoader from "./components/WishlistLoader";
import ContactAdmin from "./pages/ContactAdmin";

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
import SellerRequests from "./pages/admin/SellerRequests";
import AdminProfile from "./pages/admin/AdminProfile";

// Seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerAddProduct from "./pages/seller/SellerAddProduct";
import SellerEditProduct from "./pages/seller/SellerEditProduct";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerLayout from "./components/SellerLayout";
import SellerProfile from "./pages/seller/SellerProfile";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      {/* Refresh logged-in user after page reload */}
      <AuthLoader />

      {/* Load wishlist when customer is logged in */}
      <WishlistLoader />

      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/contact-admin"
          element={<ContactAdmin />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />


        {/* =====================================================
            CUSTOMER ROUTES
        ====================================================== */}

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "customer",
                "seller",
                "admin",
              ]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-cancelled"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <PaymentCancelled />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN ROUTES
        ====================================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminProductDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminCategories />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/seller-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <SellerRequests />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            SELLER ROUTES
        ====================================================== */}

        {/* Seller Dashboard */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerDashboard />
              </SellerLayout>
            </ProtectedRoute>
          }
        />

        {/* Seller Products */}
        <Route
          path="/seller/products"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerProducts />
              </SellerLayout>
            </ProtectedRoute>
          }
        />

        {/* Seller Add Product */}
        <Route
          path="/sellers/products/add"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerAddProduct />
              </SellerLayout>
            </ProtectedRoute>
          }
        />

        {/* Seller Edit Product */}
        <Route
          path="/seller/products/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerEditProduct />
              </SellerLayout>
            </ProtectedRoute>
          }
        />

        {/* Seller Orders */}
        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerOrders />
              </SellerLayout>
            </ProtectedRoute>
          }
        />

        {/* Seller Profile */}
        <Route
          path="/seller/profile"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerProfile />
              </SellerLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
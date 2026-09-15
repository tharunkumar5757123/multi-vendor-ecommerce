import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";

import Product from "./pages/Products";








import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";


import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/Products";
import AddProduct from "./pages/seller/AddProduct";
import EditProduct from "./pages/seller/EditProduct";
import SellerOrders from "./pages/seller/SellerOrders";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}

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

        {/* Root - redirect based on role */}

        <Route
          path="/"
          element={<RoleRedirect />}
        />

        {/* Customer */}

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
  path="/products"
  element={
    <ProtectedRoute allowedRoles={["customer"]}>
      <Product />
    </ProtectedRoute>
  }
/>

       

        {/* Admin */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Users />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/products"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Products />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/orders"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Orders />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/categories"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Categories />
    </ProtectedRoute>
  }
/>



 {/* Seller */}

        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/seller/products"
  element={
    <ProtectedRoute allowedRoles={["seller"]}>
      <SellerProducts />
    </ProtectedRoute>
  }
/>

<Route
  path="/seller/products/add"
  element={
    <ProtectedRoute allowedRoles={["seller"]}>
      <AddProduct />
    </ProtectedRoute>
  }
/>
<Route
  path="/seller/products/edit/:id"
  element={
    <ProtectedRoute allowedRoles={["seller"]}>
      <EditProduct />
    </ProtectedRoute>
  }
/>
<Route
  path="/seller/orders"
  element={
    <ProtectedRoute allowedRoles={["seller"]}>
      <SellerOrders />
    </ProtectedRoute>
  }
/>



      </Routes>
    </BrowserRouter>
  );
}

export default App;
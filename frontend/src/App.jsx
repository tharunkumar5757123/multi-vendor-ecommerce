import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";

import SellerDashboard from "./pages/seller/SellerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";

import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";



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

        {/* Seller */}

        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RoleRedirect() {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "seller") {
    return <Navigate to="/seller/dashboard" replace />;
  }

  return <Navigate to="/home" replace />;
}

export default RoleRedirect;
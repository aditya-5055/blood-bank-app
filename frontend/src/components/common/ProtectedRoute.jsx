import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROLES } from "../../constants/roles";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1️⃣ Not logged in → redirect to correct login page
  if (!token) {
    if (location.pathname.startsWith("/donor")) {
      return <Navigate to="/donor/login" state={{ from: location }} replace />;
    } else if (location.pathname.startsWith("/bloodbank")) {
      return <Navigate to="/facility/login" state={{ from: location }} replace />;
    } else if (location.pathname.startsWith("/hospital")) {
      return <Navigate to="/facility/login" state={{ from: location }} replace />;
    } else if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2️⃣ Wrong role → redirect to correct dashboard
  if (!allowedRoles.includes(role)) {
    if (role === ROLES.DONOR) return <Navigate to="/donor/dashboard" replace />;
    if (role === ROLES.BLOOD_BANK) return <Navigate to="/bloodbank/dashboard" replace />;
    if (role === ROLES.HOSPITAL) return <Navigate to="/hospital/dashboard" replace />;
    if (role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Correct role → render page
  return <Outlet />;
};

export default ProtectedRoute;
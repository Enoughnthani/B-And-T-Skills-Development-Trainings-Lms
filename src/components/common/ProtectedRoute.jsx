// src/components/common/ProtectedRoute.jsx
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role, children, redirectTo }) {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

 
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    const hasRequiredRole = roles.some(r => user?.role?.includes(r));
    
    if (!hasRequiredRole) {
      if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
      }
      return <Navigate to="/error/403" replace />;
    }
  }

  return children ? children : <Outlet />;
}
import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/authToken";

export default function RequireAuth({ children }) {
  const loc = useLocation();

  if (!isLoggedIn()) {
    const redirect = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return children;
}
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/authToken";

export default function HomeRedirect() {
  return isLoggedIn() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
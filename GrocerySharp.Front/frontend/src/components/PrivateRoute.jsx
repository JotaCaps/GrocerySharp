import { Navigate } from "react-router-dom";
import { getToken } from "../services/authToken";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Navbar from "./Navbar";
import UnauthorizedPage from "../pages/UnauthorizedPage";

export default function PrivateRoute({ children, roles = [] }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  const { roles: userRoles } = useCurrentUser();

  // Se a rota exige roles específicas, verifica se o usuário tem pelo menos uma
  if (roles.length > 0 && !roles.some((r) => userRoles.includes(r))) {
    return (
      <>
        <Navbar />
        <UnauthorizedPage />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
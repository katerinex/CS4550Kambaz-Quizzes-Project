// src/Kambaz/Account/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useSelector((state: any) => state.accountReducer); // Changed from currentUser to user
  
  if (!user) {
    return <Navigate to="/Kambaz/Account/Signin" replace />;
  }
  
  return children;
}

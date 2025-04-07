// src/Kambaz/Account/Session.tsx
import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";

export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  
  const fetchProfile = async () => {
    try {
      // Use the enhanced checkAuth function that tries both methods
      const { isAuthenticated, user } = await client.checkAuth();
      
      if (isAuthenticated && user) {
        console.log("Authentication successful, user:", user.username);
        dispatch(setCurrentUser(user));
      } else {
        console.log("No authenticated user found");
        dispatch(setCurrentUser(null));
      }
    } catch (err: any) {
      // Don't set current user if there's an error
      console.log("Authentication check failed:", err.message || err);
      dispatch(setCurrentUser(null));
    } finally {
      setPending(false);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  if (pending) {
    return <div>Loading...</div>;
  }
  
  return <>{children}</>;
}
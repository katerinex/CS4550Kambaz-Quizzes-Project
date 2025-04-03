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
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
    } catch (err: any) {
      // Don't set current user if there's an error
      console.log("Not logged in or session expired");
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

// src/Kambaz/Account/Session.tsx
import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import axios from 'axios';

export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
    } catch (err: any) {
      console.error(err);
    }
    setPending(false);
  };

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:10000/api/users/test');
        console.log("Test response:", response.data);
      } catch (error) {
        console.error("Test error:", error);
      }
    };
    testConnection();
    fetchProfile(); // Keep your original profile fetch
  }, []);

  if (!pending) {
    return children;
  }
}

// src/Labs/Lab5/HttpClient.tsx

import { useEffect, useState } from "react";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function HttpClient() {
  const [welcomeOnClick, setWelcomeOnClick] = useState("");
  const [welcomeOnLoad, setWelcomeOnLoad] = useState("");

  const fetchWelcomeMessage = async () => {
    try {
      const response = await fetch(`${REMOTE_SERVER}/welcome`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Error fetching welcome message:", error);
      return "Failed to fetch welcome message.";
    }
  };

  const fetchWelcomeOnClick = async () => {
    const message = await fetchWelcomeMessage();
    setWelcomeOnClick(message);
  };

  const fetchWelcomeOnLoad = async () => {
    const welcome = await fetchWelcomeMessage();
    setWelcomeOnLoad(welcome);
  };

  useEffect(() => {
    fetchWelcomeOnLoad();
  }, []);

  return (
    <div>
      <h3>HTTP Client</h3>
      <hr />
      <h4>Requesting on Click</h4>
      <button onClick={fetchWelcomeOnClick}>Fetch Welcome</button>
      Response from server: <b>{welcomeOnClick}</b>
      <hr />
      <h4>Requesting on Load</h4>
      Response from server: <b>{welcomeOnLoad}</b>
      <hr />
    </div>
  );
}
// src/Labs/Lab5/HttpClient.tsx

import React, { useEffect, useState } from "react";
import * as client from "./client";


export default function HttpClient() {
  const [welcomeOnClick, setWelcomeOnClick] = useState("");
  const [welcomeOnLoad, setWelcomeOnLoad] = useState("");

  const fetchWelcomeOnClick = async () => {
    const message = await client.fetchWelcomeMessage();
    setWelcomeOnClick(message);
  };

  const fetchWelcomeOnLoad = async () => {
    const welcome = await client.fetchWelcomeMessage();
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

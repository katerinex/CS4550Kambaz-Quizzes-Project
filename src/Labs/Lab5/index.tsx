// src/Labs/Lab5/index.tsx
import { useState } from "react";
import EnvironmentVariables from "./EnvironmentVariables";
import HttpClient from "./HttpClient";
import PathParameters from "./PathParameters";
import QueryParameters from "./QueryParameters";
import WorkingWithArrays from "./WorkingWithArrays";
import WorkingWithArraysAsynchronously from "./WorkingWithArraysAsynchronously";
import WorkingWithObjects from "./WorkingWithObjects";
import WorkingWithObjectsAsynchronously from "./WorkingWithObjectsAsynchronously";
import * as client from "./client";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function Lab5() {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  
  const fetchWelcome = async () => {
    try {
      const message = await client.fetchWelcomeMessage();
      setWelcomeMessage(message);
    } catch (error) {
      console.error("Error fetching welcome message:", error);
      setWelcomeMessage("Failed to fetch welcome message");
    }
  };
  
  return (
    <div id="wd-lab5">
      <h2>Lab 5</h2>
      <div className="list-group">
        <button
          className="list-group-item text-start border"
          onClick={fetchWelcome}
        >
          Welcome
        </button>
      </div>
      {welcomeMessage && (
        <div className="alert alert-success mt-2">{welcomeMessage}</div>
      )}
      <hr />
      <EnvironmentVariables />
      <HttpClient />
      <PathParameters />
      <QueryParameters />
      <WorkingWithArrays />
      <WorkingWithArraysAsynchronously />
      <WorkingWithObjects />
      <WorkingWithObjectsAsynchronously />
    </div>
  );
}


  
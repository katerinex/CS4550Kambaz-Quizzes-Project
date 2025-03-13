// src/Labs/index.tsx
import React from 'react';
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import Lab1 from "./Lab1";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";
import Lab4 from "./Lab4";
import Lab5 from "./Lab5";
import TOC from "./TOC";
import store from "./store";
import { Provider } from "react-redux";

export default function Labs() {
  const navigate = useNavigate();
  return (
    <Provider store={store}>
      <div className="p-3">
        <h1>Labs</h1>
        <TOC />
        <Routes>
          <Route path="/" element={<NavigateToLab1 navigate={navigate} />} />
          <Route path="Lab1" element={<Lab1 />} />
          <Route path="Lab2/*" element={<Lab2 />} />
          <Route path="Lab3/*" element={<Lab3 />} />
          <Route path="Lab4" element={<Lab4 />} />
          <Route path="Lab5" element={<Lab5 />} />
        </Routes>
      </div>
    </Provider>
  );
}

interface NavigateToLab1Props {
  navigate: ReturnType<typeof useNavigate>;
}

const NavigateToLab1: React.FC<NavigateToLab1Props> = ({ navigate }) => {
  const location = useLocation(); // Get the current location

  React.useEffect(() => {
    if (location.pathname === "/") { // Check if the path is exactly "/"
      navigate("Lab1");
    }
  }, [navigate, location.pathname]); // Add location.pathname to dependencies

  return null;
};

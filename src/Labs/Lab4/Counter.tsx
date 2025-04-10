// src/Labs/Lab4/Counter.tsx

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(7);
  console.log("render");

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div id="wd-counter-use-state">
      <h2>Counter: {count}</h2>
      <button
        onClick={increment}
        style={{ backgroundColor: "green", color: "white", padding: "10px", margin: "5px", border: "none", borderRadius: "5px", cursor: "pointer" }}
        id="wd-counter-up-click"
      >
        Up
      </button>
      <button
        onClick={decrement}
        style={{ backgroundColor: "red", color: "white", padding: "10px", margin: "5px", border: "none", borderRadius: "5px", cursor: "pointer" }}
        id="wd-counter-down-click"
      >
        Down
      </button>
    </div>
  );
}

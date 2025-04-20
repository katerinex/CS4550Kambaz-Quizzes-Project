// src/Labs/Lab5/QueryParameters.tsx
import { FormControl } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function QueryParameters() {
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");
  const [result, setResult] = useState<string | null>(null);

  const performOperation = async (operation: string) => {
    try {
      const response = await axios.get(
        `${REMOTE_SERVER}/lab5/calculator?operation=${operation}&a=${a}&b=${b}`
      );
      setResult(`${operation.charAt(0).toUpperCase() + operation.slice(1)} Result: ${response.data}`);
    } catch (error: any) {
      console.error(`Error performing ${operation}:`, error);
      setResult(`Error: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>
      <FormControl
        id="wd-query-parameter-a"
        className="mb-2"
        value={a}
        type="number"
        onChange={(e) => setA(e.target.value)}
      />
      <FormControl
        id="wd-query-parameter-b"
        className="mb-2"
        value={b}
        type="number"
        onChange={(e) => setB(e.target.value)}
      />
      <button
        id="wd-query-parameter-add"
        className="btn btn-primary me-2"
        onClick={() => performOperation("add")}
      >
        Add {a} + {b}
      </button>
      <button
        id="wd-query-parameter-subtract"
        className="btn btn-danger me-2"
        onClick={() => performOperation("subtract")}
      >
        Subtract {a} - {b}
      </button>
      <button
        id="wd-query-parameter-multiply"
        className="btn btn-success me-2"
        onClick={() => performOperation("multiply")}
      >
        Multiply {a} * {b}
      </button>
      <button
        id="wd-query-parameter-divide"
        className="btn btn-warning"
        onClick={() => performOperation("divide")}
      >
        Divide {a} / {b}
      </button>
      
      {result && (
        <div className="alert alert-info mt-2">{result}</div>
      )}
      <hr />
    </div>
  );
}
// src/Labs/Lab5/PathParameters.tsx
import { FormControl } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function PathParameters() {
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");
  const [result, setResult] = useState<string | null>(null);

  const performOperation = async (operation: string) => {
    try {
      const response = await axios.get(`${REMOTE_SERVER}/lab5/${operation}/${a}/${b}`);
      setResult(`${operation.charAt(0).toUpperCase() + operation.slice(1)} Result: ${response.data}`);
    } catch (error: any) {
      console.error(`Error performing ${operation}:`, error);
      setResult(`Error: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div>
      <h3>Path Parameters</h3>
      <FormControl
        className="mb-2"
        id="wd-path-parameter-a"
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />
      <FormControl
        className="mb-2"
        id="wd-path-parameter-b"
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
      />
      <button
        className="btn btn-primary me-2"
        id="wd-path-parameter-add"
        onClick={() => performOperation("add")}
      >
        Add {a} + {b}
      </button>
      <button
        className="btn btn-danger me-2"
        id="wd-path-parameter-subtract"
        onClick={() => performOperation("subtract")}
      >
        Subtract {a} - {b}
      </button>
      <button
        className="btn btn-success me-2"
        id="wd-path-parameter-multiply"
        onClick={() => performOperation("multiply")}
      >
        Multiply {a} * {b}
      </button>
      <button
        className="btn btn-warning"
        id="wd-path-parameter-divide"
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


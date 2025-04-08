// src/Labs/Lab4/ArrayStateVariable.tsx

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);

  // Event handler to append a random number to the array
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };

  // Event handler to remove an element by its index
  const deleteElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  return (
    <div id="wd-array-state-variables" className="container">
      <h2>Array State Variable</h2>
      <div className="row mb-3">
        <div className="col">
          <button
            onClick={addElement}
            className="btn btn-success">
            Add Element
          </button>
        </div>
      </div>
      <ul className="list-group">
        {array.map((item, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <span className="me-auto">{item}</span>
            <button
              onClick={() => deleteElement(index)}
              className="btn btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr/>
    </div>
  );
}
// src/Labs/Lab3/TernaryOperator.tsx
import React from 'react';

const TernaryOperator: React.FC = () => {  
  let loggedIn = true; 

  return (
    <div id="wd-ternary-operator">
      <h4>Logged In</h4>
      {loggedIn ? <p>Welcome</p> : <p>Please login</p>} <hr />
    </div>
  );
};

export default TernaryOperator;
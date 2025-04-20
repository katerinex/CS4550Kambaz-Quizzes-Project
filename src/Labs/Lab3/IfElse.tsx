// src/Labs/Lab3/IfElse.tsx
import React from 'react';

const IfElse: React.FC = () => {
  let true1 = true;
  let false1 = false;

  return (
    <div id="wd-if-else">
      <h4>If Else</h4>
      {true1 && <p>true1</p>}
      {!false1 ? <p>!false1</p> : <p>false1</p>}
      <hr />
    </div>
  );
};

export default IfElse;

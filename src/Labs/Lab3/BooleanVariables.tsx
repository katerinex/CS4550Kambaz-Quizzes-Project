// src/Labs/Lab3/BooleanVariables.tsx
import React from 'react'; 

const BooleanVariables: React.FC = () => { // Define a functional component
  let numberVariable = 123, floatingPointNumber = 234.345;
  let true1 = true, false1 = false;
  let false2 = true1 && false1;
  let true2 = true1 || false1;
  let true3 = !false2;
  let true4 = numberVariable === 123;
  let true5 = floatingPointNumber !== 321.432;
  let false3 = numberVariable < 100;

  return ( // Now the return is inside the function
    <div id="wd-boolean-variables">
      <h4>Boolean Variables</h4>
      true1     = {true1.toString()}     <br /> {/* Use toString() or String() */}
      false1    = {false1.toString()}    <br />
      false2    = {false2.toString()}    <br />
      true2     = {true2.toString()}     <br />
      true3     = {true3.toString()}     <br />
      true4     = {true4.toString()}     <br />
      true5     = {true5.toString()}     <br />
      false3    = {false3.toString()}    <hr />
    </div>
  );
};

export default BooleanVariables; 
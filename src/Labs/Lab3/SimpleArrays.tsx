// src/Labs/Lab3/SimpleArrays.tsx - Fixed with keys
export default function SimpleArrays() {
  var functionScoped = 2;
  let blockScoped = 5;
  const constant1 = functionScoped - blockScoped;
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2"];
  
  // Fix: Added unique key prop to each list item
  let htmlArray1 = [
    <li key="buy-milk">Buy milk</li>,
    <li key="feed-pets">Feed the pets</li>
  ];
  
  let variableArray1 = [
    functionScoped,
    blockScoped,
    constant1,
    numberArray1,
    stringArray1
  ];
  
  return (
    <div id="wd-simple-arrays">
      <h4>Simple Arrays</h4>
      numberArray1 = {numberArray1} <br />
      stringArray1 = {stringArray1} <br />
      variableArray1 = {variableArray1} <br />
      Todo list:
      <ol>{htmlArray1}</ol>
      <hr />
    </div>
  );
}
// 1. src/Labs/Lab3/AddingAndRemovingToFromArrays.tsx - Fixed with keys
export default function AddingAndRemovingToFromArrays() {
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2"];
  
  // Fix: Added unique key props to each list item
  let todoArray = [
    <li key="buy-milk">Buy milk</li>, 
    <li key="feed-pets">Feed the pets</li>
  ];
  
  numberArray1.push(6); // adding new items
  stringArray1.push("string3");
  
  // Fix: Added key prop to new item
  todoArray.push(<li key="walk-dogs">Walk the dogs</li>);
  
  numberArray1.splice(2, 1); // remove 1 item starting at 2
  stringArray1.splice(1, 1);
  
  return (
    <div id="wd-adding-removing-from-arrays">
      <h4>Add/remove to/from arrays</h4>
      numberArray1 = {numberArray1} <br />
      stringArray1 = {stringArray1} <br />
      Todo list:
      <ol>{todoArray}</ol>
      <hr />
    </div>
  );
}

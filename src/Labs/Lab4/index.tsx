// src/Labs/Lab4/index.tsx
import ReduxExamples from "./ReduxExamples";
import PassingFunctions from "./PassingFunctions";
import ArrayStateVariable from "./ArrayStateVariable";
import BooleanStateVariables from "./BooleanStateVariables";
import ChildStateComponent from "./ChildStateComponent";
import ClickEvent from "./ClickEvent";
import Counter from "./Counter";
import DateStateVariable from "./DateStateVariable";
import EventObject from "./EventObject";
import ObjectStateVariable from "./ObjectStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import StringStateVariables from "./StringStateVariables";
import { useState } from "react";
import AddRedux from "./ReduxExamples/AddRedux";
import CounterRedux from "./ReduxExamples/CounterRedux";
import HelloRedux from "./ReduxExamples/HelloRedux";

export default function Lab4() {
  const [counter, setCounter] = useState(0);

  const handleSayHello = () => {
    alert("Hello");
  };

  return (
    <div id="wd-passing-functions" className="container-fluid">
      <h2 className="mb-4">Lab 4 - React State and Redux Examples</h2>
      <ReduxExamples />
      <PassingFunctions theFunction={handleSayHello} />
      <ArrayStateVariable />
      <BooleanStateVariables />
      <ChildStateComponent counter={counter} setCounter={setCounter} />
      <ClickEvent />
      <Counter />
      <DateStateVariable />
      <EventObject />
      <ObjectStateVariable />
      <ParentStateComponent />
      <PassingDataOnEvent />
      <StringStateVariables />
      <AddRedux />
      <CounterRedux />
      <HelloRedux />
      <hr />
      <h2>End of Lab 4</h2>
      <hr />
    </div>
  );
}


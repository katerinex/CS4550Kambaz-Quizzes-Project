// src/Labs/Lab3/index.tsx
import Add from "./Add";
import Square from "./Square";
import Highlight from "./Highlight";
import VariablesAndConstants from "./VariablesAndConstants";
import { useSelector } from "react-redux";
import { ListGroup } from 'react-bootstrap';
// import TodoList from "./todos/TodoList";
import TodoList from "../Lab4/ReduxExamples/todos/TodoList";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import AddPathParameters from "./AddPathParameters";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import ArrowFunctions from "./ArrowFunctions";
import Classes from "./Classes";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import Destructing from "./Destructing";
import DestructingImports from "./DestructingImports";
import FilterFunction from "./FilterFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import ForLoops from "./ForLoops";
import FunctionDestructing from "./FunctionDestructing";
import House from "./House";
import IfElse from "./IfElse";
import JsonStringify from "./JsonStringify";
import LegacyFunctions from "./LegacyFunctions";
import MapFunction from "./MapFunction";
import PathParameters from "./PathParameters";
import SimpleArrays from "./SimpleArrays";
import Spreading from "./Spreading";
import Styles from "./Styles";
import TemplateLiterals from "./TemplateLiterals";
import TernaryOperator from "./TernaryOperator";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";

export default function Lab3() {
  const { todos } = useSelector((state: any) => state.todosReducer);
  return(
    <div id="wd-lab3">
      <h3>Lab 3</h3>
      <ListGroup>
        {todos.map((todo: any) => (
          <ListGroup.Item key={todo.id}>
            {todo.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
      <VariablesAndConstants/>
      <Add a={3} b={4} />
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <Highlight>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipitratione eaque illo minus cum, saepe totam
        vel nihil repellat nemo explicabo excepturi consectetur. Modi omnis minus sequi maiores, provident voluptates.
     </Highlight>
     <hr/>
     <TodoList/>
     <AddingAndRemovingToFromArrays/>
     <AddPathParameters/>
     <ArrayIndexAndLength/>
     <ArrowFunctions/>
     <BooleanVariables/>
     <Classes/>
     <ConditionalOutputIfElse/>
     <ConditionalOutputInline/>
     <Destructing/>
     <DestructingImports/>
     <FilterFunction/>
     <FindFunction/>
     <FindIndex/>
     <ForLoops/>
     <FunctionDestructing/>
     <House/>
     <IfElse/>
     <JsonStringify/>
     <LegacyFunctions/>
     <MapFunction/>
     <PathParameters/>
     <SimpleArrays/>
     <Spreading/>
     <Styles/>
     <TemplateLiterals/>
     <TernaryOperator/>
     <VariableTypes/>
    </div>
  );
}

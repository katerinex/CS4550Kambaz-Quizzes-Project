// src/App.tsx
import { HashRouter, Route, Routes } from "react-router-dom";
import Labs from "./Labs";
import Kambaz from "./Kambaz";
import 'bootstrap/dist/css/bootstrap.min.css';
import store from "./Kambaz/store"; 
import { Provider } from "react-redux"; 
export default function App() {
  return (
    <HashRouter>
      <Provider store={store}> 
        <Routes>
          <Route path="/" element={<Kambaz />} />
          <Route path="/Kambaz/*" element={<Kambaz />} />
          <Route path="/Labs/*" element={<Labs />} />
        </Routes>
      </Provider>
    </HashRouter>
  );
}

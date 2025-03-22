// src/Kambaz/Account/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "./Signin";
import Profile from "./Profile";
import Signup from "./Signup";
import Users from "./Users"; 
import AccountNavigation from "./Navigation";
import { useSelector } from "react-redux";
<Route path="/Users/:uid" element={<Users />} />

export default function Account() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  return (
    <div id="wd-account-screen" className="d-flex vh-100">
      <div className="d-none d-md-block" style={{ width: '200px', backgroundColor: '#000' }}>
        <AccountNavigation />
      </div>
      <div className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={currentUser ? "/Kambaz/Account/Profile" : "/Kambaz/Account/Signin"}
              />
            }
          />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Users" element={<Users />} /> {/* Add the Users route */}
        </Routes>
      </div>
    </div>
  );
}

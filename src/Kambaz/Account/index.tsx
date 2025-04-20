// src/Kambaz/Account/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "./Signin";
import Profile from "./Profile";
import Signup from "./Signup";
import Users from "./Users";
import AccountNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Account() {
  const { user } = useSelector((state: any) => state.accountReducer); // Changed from currentUser to user
  const location = useLocation();
  
  // Check if the current route is signin or signup
  const isAuthRoute = location.pathname.includes("/Signin") || location.pathname.includes("/Signup");
  
  return (
    <div id="wd-account-screen" className={`d-flex vh-100 ${isAuthRoute ? 'signin-signup-layout' : ''}`}>
      {/* Only show navigation sidebar if user is logged in or on non-auth routes */}
      {!isAuthRoute && (
        <div className="d-none d-md-block" style={{ width: '200px' }}>
          <AccountNavigation />
        </div>
      )}
      <div className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={user ? "/Kambaz/Account/Profile" : "/Kambaz/Account/Signin"}
              />
            }
          />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Users" element={<Users />} />
          <Route path="/Users/:uid" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}
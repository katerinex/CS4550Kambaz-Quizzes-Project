// src/Kambaz/Account/Navigation.tsx

import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import NEU2Image from '../../assets/NEU2.jpg';

export default function AccountNavigation() {
  const { user } = useSelector((state: any) => state.accountReducer); // Changed from currentUser to user
  const { pathname } = useLocation();
  
  const links = user
    ? [{ name: "Profile", path: "/Kambaz/Account/Profile" }]
    : [
      { name: "Signin", path: "/Kambaz/Account/Signin" },
      { name: "Signup", path: "/Kambaz/Account/Signup" },
    ];
    
  if (user && user.role === "ADMIN") {
    links.push({ name: "Users", path: "/Kambaz/Account/Users" });
  }
  
  return (
    <div id="wd-account-navigation" className="p-3">
      <img
        src={NEU2Image}
        alt="Northeastern Logo"
        style={{ width: "150px", marginBottom: "20px" }}
      />
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`nav-link ${pathname === link.path ? "active" : ""}`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
// src/Kambaz/Navigation.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup } from 'react-bootstrap';
import NEUImage from '../assets/NEU.jpg';
import './styles.css';
import CoursesNavigation, { CourseMenu } from "./Courses/Navigation";

export default function KambazNavigation() {
  const { pathname } = useLocation();
  const params = useParams();
  const courseId = params.cid; // Changed from courseId to cid to match params
  
  const [isCoursesNavOpen, setIsCoursesNavOpen] = useState(false);
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  
  // Check if we're in a course view path
  useEffect(() => {
    // If the URL contains /Kambaz/Courses/[courseId], show the course menu
    const isCourseView = pathname.match(/\/Kambaz\/Courses\/[^/]+/);
    setShowCourseMenu(!!isCourseView && !!courseId);
    
    // Apply body class for course menu
    if (!!isCourseView && !!courseId) {
      document.body.classList.add('has-course-menu');
    } else {
      document.body.classList.remove('has-course-menu');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('has-course-menu');
    };
  }, [pathname, courseId]);
  
  const handleCoursesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCoursesNavOpen(true);
  };
  
  const closeCoursesNav = () => {
    setIsCoursesNavOpen(false);
  };
  
  // Data structure for navigation links
  const links = [
    { label: "Dashboard", path: "/Kambaz/Dashboard", icon: AiOutlineDashboard, color: "text-danger" },
    { label: "Courses", path: "/Kambaz/Courses", icon: LiaBookSolid, color: "text-danger" },
    { label: "Calendar", path: "/Kambaz/Calendar", icon: IoCalendarOutline, color: "text-danger" },
    { label: "Inbox", path: "/Kambaz/Inbox", icon: FaInbox, color: "text-danger" },
    { label: "Labs", path: "/Labs", icon: LiaCogSolid, color: "text-danger" },
  ];
  
  return (
    <div className="d-flex">
      <ListGroup
        id="wd-kambaz-navigation"
        className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2 h-100"
      >
        <ListGroup.Item
          id="wd-neu-link"
          as="a"
          target="_blank"
          href="https://www.northeastern.edu/"
          action
          className="bg-black border-0 text-center p-0"
        >
          <img src={NEUImage} alt="Northeastern Logo" />
        </ListGroup.Item>
        
        <ListGroup.Item
          as={Link}
          to="/Kambaz/Account"
          className={`text-center border-0 bg-black
          ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}
        >
          <FaRegCircleUser className={`${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
          <span>Account</span>
        </ListGroup.Item>
        
        {links.map((link) => {
          // For Courses link, render as anchor tag
          if (link.label === "Courses") {
            return (
              <ListGroup.Item
                key={link.path}
                as="a"
                href="#"
                onClick={handleCoursesClick}
                className={`bg-black text-center border-0
                ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}
              >
                {React.createElement(link.icon, { className: link.color })}
                <span>{link.label}</span>
              </ListGroup.Item>
            );
          }
          
          // For other links, render as Link component
          return (
            <ListGroup.Item
              key={link.path}
              as={Link}
              to={link.path}
              className={`bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}
            >
              {React.createElement(link.icon, { className: link.color })}
              <span>{link.label}</span>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      
      {/* Course Menu - Show when in a course view */}
      {showCourseMenu && (
        <div className="course-menu-container">
          <CourseMenu courseId={courseId} />
        </div>
      )}
      
      {/* Canvas-style Courses Sidebar */}
      <CoursesNavigation isOpen={isCoursesNavOpen} onClose={closeCoursesNav} />
    </div>
  );
}
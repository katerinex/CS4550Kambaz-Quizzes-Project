// src/Kambaz/Courses/Navigation.tsx
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaCalendarDay, FaTachometerAlt, FaUsers, FaRocket, FaClipboardList } from "react-icons/fa";

interface CourseNavigationProps {
  courseId: string | undefined;
}

export default function CourseNavigation({ courseId }: CourseNavigationProps) {
  const { pathname } = useLocation();
  
  // Function to check if the route is active
  const isActive = (path: string) => {
    return pathname.includes(path);
  };
  
  return (
    <div className="wd-course-navigation list-group" style={{ width: "200px" }}>
      <Link
        to={`/Kambaz/Courses/${courseId}/Home`}
        className={`list-group-item list-group-item-action ${isActive("/Home") ? "active" : ""}`}
      >
        <FaHome className="me-2" /> Home
      </Link>
      <Link
        to={`/Kambaz/Courses/${courseId}/Modules`}
        className={`list-group-item list-group-item-action ${isActive("/Modules") ? "active" : ""}`}
      >
        <FaBook className="me-2" /> Modules
      </Link>
      <Link
        to={`/Kambaz/Courses/${courseId}/Assignments`}
        className={`list-group-item list-group-item-action ${isActive("/Assignments") ? "active" : ""}`}
      >
        <FaCalendarDay className="me-2" /> Assignments
      </Link>
      <Link
        to={`/Kambaz/Courses/${courseId}/Quizzes`}
        className={`list-group-item list-group-item-action ${isActive("/Quizzes") ? "active" : ""}`}
      >
        <FaClipboardList className="me-2" /> Quizzes
      </Link>
      <Link
        to={`/Kambaz/Courses/${courseId}/Grades`}
        className={`list-group-item list-group-item-action ${isActive("/Grades") ? "active" : ""}`}
      >
        <FaTachometerAlt className="me-2" /> Grades
      </Link>
      <Link
        to={`/Kambaz/Courses/${courseId}/People`}
        className={`list-group-item list-group-item-action ${isActive("/People") ? "active" : ""}`}
      >
        <FaUsers className="me-2" /> People
      </Link>
      <Link
        to={`/Kambaz/Courses/${courseId}/Settings`}
        className={`list-group-item list-group-item-action ${isActive("/Settings") ? "active" : ""}`}
      >
        <FaRocket className="me-2" /> Settings
      </Link>
    </div>
  );
}
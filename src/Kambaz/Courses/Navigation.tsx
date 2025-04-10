// src/Kambaz/Courses/Navigation.tsx
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './CoursesNavigation.css';

// ===== COURSES SIDEBAR COMPONENT =====
interface CoursesNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const CoursesNavigation = ({ isOpen, onClose }: CoursesNavigationProps) => {
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Prevent scrolling on body when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="courses-sidebar-overlay">
      <div
        ref={sidebarRef}
        className="courses-sidebar"
      >
        <div className="courses-sidebar-header">
          <h2>Courses</h2>
          <button
            className="courses-sidebar-close"
            onClick={onClose}
            aria-label="Close courses sidebar"
          >
            ×
          </button>
        </div>
        <div className="courses-sidebar-section">
          <Link to="/Kambaz/Courses" className="all-courses-link" onClick={onClose}>
            All Courses
          </Link>
        </div>
        {courses && courses.length > 0 ? (
          <div className="courses-sidebar-section">
            {courses.map((course: any) => (
              <div key={course._id} className="course-sidebar-item">
                <Link to={`/Kambaz/Courses/${course._id}`} onClick={onClose}>
                  {course.name}
                </Link>
                <div className="course-sidebar-term">
                  {course.term || 'Current Term'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="courses-sidebar-empty">
            <p>You are not enrolled in any courses.</p>
          </div>
        )}
        <div className="courses-sidebar-footer">
          <p>
            Welcome to your courses! To customize the list of courses, click on the "All Courses" link and star the courses to display.
          </p>
        </div>
      </div>
    </div>
  );
};

// ===== COURSE MENU COMPONENT =====
// Add the CSS needed for this component:
// You may want to add this to CoursesNavigation.css or create a separate file

// .course-menu {
//   width: 200px;
//   margin-right: 20px;
// }
// .course-menu .list-group-item {
//   border-radius: 0;
//   border-left: none;
//   border-right: none;
//   padding: 10px 15px;
// }
// .course-menu .nav-link {
//   color: #495057;
//   padding: 8px 0;
//   display: block;
//   text-decoration: none;
// }
// .course-menu .nav-link:hover {
//   color: #212529;
//   text-decoration: none;
// }
// .course-menu .nav-link.active {
//   color: #007bff;
//   font-weight: 500;
// }

interface CourseMenuProps {
  courseId: string | undefined;
}

export const CourseMenu = ({ courseId }: CourseMenuProps) => {
  const { pathname } = useLocation();
  
  // Navigation items for course menu
  const navItems = [
    { path: "Home", label: "Home" },
    { path: "Modules", label: "Modules" },
    { path: "Assignments", label: "Assignments" },
    { path: "Quizzes", label: "Quizzes" },
    { path: "Grades", label: "Grades" },
    { path: "People", label: "People" },
    { path: "Settings", label: "Settings" }
  ];

  return (
    <div className="course-menu">
      <ul className="list-group">
        {navItems.map((item) => {
          const isActive = pathname.includes(`/Kambaz/Courses/${courseId}/${item.path}`);
          return (
            <li key={item.path} className="list-group-item">
              <Link 
                to={`/Kambaz/Courses/${courseId}/${item.path}`}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Export both components
export default CoursesNavigation;
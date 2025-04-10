//src/Kambaz/Courses/CoursesDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './CoursesDropdown.css';

const CoursesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Sort courses alphabetically
  const sortedCourses = [...(courses || [])].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  
  return (
    <div className="courses-dropdown-container" ref={dropdownRef}>
      <button
        className="courses-dropdown-toggle"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        Courses <span className="caret">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="courses-dropdown-menu">
          <div className="courses-dropdown-header">
            <h6>My Courses</h6>
            <Link
              to="/Kambaz/Courses"
              className="all-courses-link"
              onClick={() => setIsOpen(false)}
            >
              All Courses
            </Link>
          </div>
          
          <div className="courses-list">
            {sortedCourses.length > 0 ? (
              sortedCourses.slice(0, 8).map((course: any) => (
                <Link
                  key={course._id}
                  to={`/Kambaz/Courses/${course._id}`}
                  className="course-item"
                  onClick={() => setIsOpen(false)}
                >
                  {course.name}
                </Link>
              ))
            ) : (
              <p className="no-courses">No courses available</p>
            )}
          </div>
          
          {sortedCourses.length > 8 && (
            <div className="courses-dropdown-footer">
              <Link
                to="/Kambaz/Courses"
                className="more-courses-link"
                onClick={() => setIsOpen(false)}
              >
                More...
              </Link>
            </div>
          )}
          
          {sortedCourses.length > 0 && (
            <div className="courses-dropdown-footer">
              <div className="text-center">
                <small className="text-muted">
                  Click All Courses to view all available courses.
                </small>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesDropdown;
//src/Kambaz/Courses/CourseList.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import * as courseClient from "./client";
import { setCourses, fetchCoursesStart, fetchCoursesFailure } from "./reducer";
// Import React logo
import reactLogo from "../../assets/react.svg";

const CourseList = () => {
  const { courses, loading, error } = useSelector((state: any) => state.coursesReducer);
  const { user } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  const [enrolling, setEnrolling] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    dispatch(fetchCoursesStart());
    try {
      const allCourses = await courseClient.findAllCourses();
      dispatch(setCourses(allCourses));
    } catch (err) {
      let errorMessage = "Failed to fetch courses";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      dispatch(fetchCoursesFailure(errorMessage));
    }
  };

  const handleUpdateEnrollment = async (courseId: string, enrolled: boolean) => {
    // This would be implemented to handle enrollment/unenrollment
    console.log(`Update enrollment for course ${courseId}: ${enrolled}`);
  };

  // Check if user is admin or faculty
  const isAdmin = user && user.role === "ADMIN";
  const isFaculty = user && user.role === "FACULTY";
  const canEdit = isAdmin || isFaculty;

  const toggleView = () => {
    setViewMode(viewMode === "card" ? "list" : "card");
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>All Courses</h1>
        <div className="d-flex">
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={toggleView}
          >
            {viewMode === "card" ? "List View" : "Card View"}
          </Button>
          
          {user && (
            <Button
              variant="primary"
              onClick={() => setEnrolling(!enrolling)}
            >
              {enrolling ? "My Courses" : "All Courses"}
            </Button>
          )}
        </div>
      </div>
      <hr />

      {error && (
        <div className="alert alert-danger">
          Error loading courses: {error}
        </div>
      )}

      {user && <h2>Welcome, {user.firstName || user.username}</h2>}
      <hr />

      {canEdit && (
        <div className="mb-4">
          <h3>Course Administration</h3>
          <div className="d-flex justify-content-end mb-3">
            <Link to="/Kambaz/Courses/Create" className="btn btn-primary">
              Add New Course
            </Link>
          </div>
        </div>
      )}

      <h3>Available Courses ({courses?.length || 0})</h3>

      {loading ? (
        <div className="col-12 text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading courses...</p>
        </div>
      ) : (
        <>
          {viewMode === "card" ? (
            // Card View
            <div className="courses-grid">
              {courses && courses.length > 0 ? (
                courses.map((course: any) => (
                  <div key={course._id || `course-${Math.random()}`} className="course-card-wrapper">
                    <div className="card h-100 course-card">
                      <div className="course-card-logo">
                        <img
                          src={reactLogo}
                          className="card-img-top"
                          alt="React Logo"
                          loading="lazy"
                        />
                      </div>
                      <div className="card-body course-card-body">
                        <h5 className="card-title">{course.name}</h5>
                        <p className="card-text course-description">
                          {course.description || "No description available"}
                        </p>
                      </div>
                      <div className="card-footer d-flex">
                        <Link
                          to={`/Kambaz/Courses/${course._id}`}
                          className="btn btn-primary"
                        >
                          Go
                        </Link>

                        {canEdit && (
                          <>
                            <Link
                              to={`/Kambaz/Courses/${course._id}/Edit`}
                              className="btn btn-warning mx-2"
                            >
                              Edit
                            </Link>

                            <Button variant="danger">
                              Delete
                            </Button>
                          </>
                        )}
                      </div>

                      {enrolling && !canEdit && (
                        <div className="card-footer">
                          <Button
                            onClick={() => handleUpdateEnrollment(course._id, !course.enrolled)}
                            className={`btn ${course.enrolled ? "btn-danger" : "btn-success"} w-100`}
                          >
                            {course.enrolled ? "Unenroll" : "Enroll"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p>No courses available. {enrolling ? "Try selecting 'All Courses' to see available courses." : "You are not enrolled in any courses."}</p>
                </div>
              )}
            </div>
          ) : (
            // List View
            <div className="list-group w-100">
              {courses && courses.length > 0 ? (
                courses.map((course: any) => (
                  <div key={course._id || `course-${Math.random()}`} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">{course.name}</h5>
                      <p className="mb-1 transparent-text">
                        {course.description || "No description available"}
                      </p>
                    </div>
                    <div className="d-flex">
                      <Link
                        to={`/Kambaz/Courses/${course._id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Go
                      </Link>
                      
                      {canEdit && (
                        <>
                          <Link
                            to={`/Kambaz/Courses/${course._id}/Edit`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Edit
                          </Link>
                          
                          <Button size="sm" variant="danger">
                            Delete
                          </Button>
                        </>
                      )}
                      
                      {enrolling && !canEdit && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateEnrollment(course._id, !course.enrolled)}
                          variant={course.enrolled ? "danger" : "success"}
                          className="ms-2"
                        >
                          {course.enrolled ? "Unenroll" : "Enroll"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3">
                  <p>No courses available. {enrolling ? "Try selecting 'All Courses' to see available courses." : "You are not enrolled in any courses."}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add custom styles to make course description transparent */}
      <style>{`
        /* Transparent text styling for course descriptions */
        .transparent-text {
          color: rgba(0, 0, 0, 0.6) !important;
          background-color: transparent !important;
        }
        
        /* Ensure no background color on list items */
        .list-group-item {
          background-color: #ffffff !important;
          border: 1px solid rgba(0, 0, 0, 0.125);
          margin-bottom: 0.5rem;
          border-radius: 0.25rem !important;
        }
        
        /* Fix for course card descriptions */
        .course-description {
          color: rgba(0, 0, 0, 0.6) !important;
          background-color: transparent !important;
        }
        
        /* Ensure the card body has white background */
        .card-body {
          background-color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default CourseList;
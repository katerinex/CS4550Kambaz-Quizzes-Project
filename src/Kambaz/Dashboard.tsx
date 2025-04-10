// src/Kambaz/Dashboard.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from 'react-bootstrap';
import * as accountClient from "./Account/client";
import * as coursesClient from "./Courses/client";
import { setCurrentUser } from "./Account/reducer";
import { 
  setCourses, 
  setCourse,  
  addCourseStart,
  addCourseSuccess,
  addCourseFailure,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseFailure,
  updateCourseStart,
  updateCourseSuccess,
  updateCourseFailure,
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure
} from "./Courses/reducer";
import CoursesDropdown from "./Courses/CoursesDropdown";
import CourseForm from "./Courses/CourseForm";
import { Course } from "./types";
import reactLogo from "../assets/react.svg";

// Memoized course card component
const CourseCard = React.memo(({
  course,
  canEdit,
  enrolling,
  onDelete,
  onSetCourse,
  onEnrollment
}: {
  course: Course,
  canEdit: boolean,
  enrolling: boolean,
  onDelete: (id: string) => void,
  onSetCourse: (course: Course) => void,
  onEnrollment: (id: string, enrolled: boolean) => void
}) => {
  return (
    <div className="course-card-wrapper">
      <div className="card h-100 course-card">
        <div className="course-card-logo">
          <img 
            src={reactLogo} 
            className="card-img-top" 
            alt="React Logo" 
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.parentElement) {
                target.parentElement.innerHTML = `
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="-11.5 -10.23174 23 20.46348"
                    width="100%"
                    height="120px"
                  >
                    <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
                    <g stroke="#61dafb" stroke-width="1" fill="none">
                      <ellipse rx="11" ry="4.2"/>
                      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                    </g>
                  </svg>
                `;
              }
            }}
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
              <Button
                variant="warning"
                className="mx-2"
                onClick={() => onSetCourse(course)}
              >
                Edit
              </Button>
              
              <Button 
                variant="danger"
                onClick={() => onDelete(course._id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
        
        {enrolling && !canEdit && (
          <div className="card-footer">
            <Button
              onClick={() => onEnrollment(course._id, !course.enrolled)}
              className={`btn ${course.enrolled ? "btn-danger" : "btn-success"} w-100`}
            >
              {course.enrolled ? "Unenroll" : "Enroll"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

// Course list item component
const CourseListItem = React.memo(({
  course,
  canEdit,
  enrolling,
  onDelete,
  onSetCourse,
  onEnrollment
}: {
  course: Course,
  canEdit: boolean,
  enrolling: boolean,
  onDelete: (id: string) => void,
  onSetCourse: (course: Course) => void,
  onEnrollment: (id: string, enrolled: boolean) => void
}) => (
  <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
    <div>
      <h5 className="mb-1">{course.name}</h5>
      <p className="mb-1 list-description">{course.description || "No description available"}</p>
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
          <Button
            size="sm"
            variant="warning"
            className="me-2"
            onClick={() => onSetCourse(course)}
          >
            Edit
          </Button>
          
          <Button 
            size="sm"
            variant="danger"
            onClick={() => onDelete(course._id)}
          >
            Delete
          </Button>
        </>
      )}
      
      {enrolling && !canEdit && (
        <Button
          size="sm"
          onClick={() => onEnrollment(course._id, !course.enrolled)}
          variant={course.enrolled ? "danger" : "success"}
          className="ms-2"
        >
          {course.enrolled ? "Unenroll" : "Enroll"}
        </Button>
      )}
    </div>
  </div>
));

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State from Redux
  const { 
    courses, 
    course: selectedCourse, // Get the current selected course from Redux
    loading: coursesLoading,
    error: coursesError 
  } = useSelector((state: any) => state.coursesReducer);
  
  const { user, loading: userLoading } = useSelector((state: any) => state.accountReducer);
  
  // Component state
  const [course, setCourseState] = useState<Course | null>(null); // Renamed to avoid confusion
  const [enrolling, setEnrolling] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [dashboardView, setDashboardView] = useState<"card" | "list">("card");
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12 // Show 12 courses per page
  });

  // Synchronize local course state with Redux when selectedCourse changes
  useEffect(() => {
    if (selectedCourse) {
      setCourseState(selectedCourse);
    }
  }, [selectedCourse]);

  // Memoized values
  const isAdmin = useMemo(() => user && user.role === "ADMIN", [user]);
  const isFaculty = useMemo(() => user && user.role === "FACULTY", [user]);
  const canEdit = useMemo(() => isAdmin || isFaculty, [isAdmin, isFaculty]);
  
  // Calculate paginated courses
  const displayedCourses = useMemo(() => {
    if (!courses) return [];
    
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    
    return courses.slice(startIndex, endIndex);
  }, [courses, pagination.page, pagination.limit]);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!courses) return 1;
    return Math.ceil(courses.length / pagination.limit);
  }, [courses, pagination.limit]);

  // Method to manually refresh course data
  const refreshCourses = useCallback(async () => {
    try {
      dispatch(fetchCoursesStart());
      const fetchedCourses = await coursesClient.findAllCourses();
      // Use setCourses action instead of fetchCoursesSuccess
      dispatch(setCourses(fetchedCourses));
    } catch (error: any) {
      console.error("Error refreshing courses:", error);
      dispatch(fetchCoursesFailure(error.message || "Failed to refresh courses"));
    }
  }, [dispatch]);

  // Fetch courses only once when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      // Prevent fetching if already loading or we already have courses
      if (coursesLoading || (courses && courses.length > 0)) return;
      
      try {
        dispatch(fetchCoursesStart());
        const fetchedCourses = await coursesClient.findAllCourses();
        dispatch(fetchCoursesSuccess(fetchedCourses));
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        dispatch(fetchCoursesFailure(error.message || "Failed to fetch courses"));
      }
    };

    fetchCourses();
  }, [dispatch, courses, coursesLoading]);

  // Fetch the user profile
  const fetchProfile = useCallback(async () => {
    // Skip if already loading or we already have user data
    if (userLoading || user) return;
    
    try {
      const userProfile = await accountClient.profile();
      dispatch(setCurrentUser(userProfile));
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        navigate("/Kambaz/Account/Signin");
      }
    }
  }, [dispatch, navigate, user, userLoading]);

  // Load profile data once when component mounts
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Add new course
  const addNewCourse = () => {
    setCourseState(null);
    // Clear the selected course in Redux store
    dispatch(setCourse(null));
    setIsFormModalOpen(true);
  };

  // Show edit form for a course
  const handleEditCourse = (selectedCourse: Course) => {
    setCourseState(selectedCourse);
    // Set the selected course in Redux store
    dispatch(setCourse(selectedCourse));
    setIsFormModalOpen(true);
  };

  // Show delete confirmation for a course
  const handleShowDeleteModal = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteModalOpen(true);
  };

  // Create or update a course
  const handleSubmitCourse = async (formData: Course) => {
    try {
      if (formData._id) {
        // Update existing course
        dispatch(updateCourseStart());
        const updatedCourse = await coursesClient.updateCourse(formData);
        dispatch(updateCourseSuccess(updatedCourse));
      } else {
        // Create new course
        dispatch(addCourseStart());
        const newCourse = await coursesClient.createCourse(formData);
        dispatch(addCourseSuccess(newCourse));
      }
      // Clear the selected course in Redux store
      dispatch(setCourse(null));
      setIsFormModalOpen(false);
    } catch (error: any) {
      console.error("Error submitting course:", error);
      if (formData._id) {
        dispatch(updateCourseFailure(error.message || "Failed to update course"));
      } else {
        dispatch(addCourseFailure(error.message || "Failed to create course"));
      }
    }
  };

  // Delete a course
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      dispatch(deleteCourseStart());
      await coursesClient.deleteCourse(courseToDelete);
      dispatch(deleteCourseSuccess(courseToDelete));
      setDeleteModalOpen(false);
      setCourseToDelete(null);
    } catch (error: any) {
      console.error("Error deleting course:", error);
      dispatch(deleteCourseFailure(error.message || "Failed to delete course"));
    }
  };

  // Update course enrollment status
  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    try {
      if (!courses) return;
      
      // Find the course to update
      const courseToUpdate = courses.find((c: Course) => c._id === courseId);
      if (!courseToUpdate) return;

      // Create updated course object with enrollment status
      const updatedCourse = {
        ...courseToUpdate,
        enrolled
      };

      // Update the course
      dispatch(updateCourseStart());
      const result = await coursesClient.updateCourse(updatedCourse);
      dispatch(updateCourseSuccess(result));
    } catch (error: any) {
      console.error("Error updating enrollment:", error);
      dispatch(updateCourseFailure(error.message || "Failed to update enrollment"));
    }
  };

  // Toggle view handler
  const toggleView = useCallback(() => {
    setDashboardView(prev => prev === "card" ? "list" : "card");
  }, []);

  // Toggle enrolling handler
  const toggleEnrolling = useCallback(() => {
    setEnrolling(!enrolling);
  }, [enrolling]);

  // Page change handler
  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  }, []);

  // Show a simple loading state
  if (!user) {
    return (
      <div className="p-4" id="wd-dashboard">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        <hr />
        <div className="p-3">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4" id="wd-dashboard">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 id="wd-dashboard-title">
            Dashboard {isAdmin ? "(ADMIN)" : ""}
          </h1>
          <div className="d-flex">
            <div className="me-2">
              <CoursesDropdown />
            </div>

            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={toggleView}
            >
              {dashboardView === "card" ? "List View" : "Card View"}
            </Button>

            <Button
              variant="primary"
              onClick={toggleEnrolling}
            >
              {enrolling ? "My Courses" : "All Courses"}
            </Button>
          </div>
        </div>
        <hr />
        
        {coursesError && (
          <div className="alert alert-danger">
            Error loading courses: {coursesError}
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="ms-3"
              onClick={refreshCourses}
            >
              Refresh Courses
            </Button>
          </div>
        )}

        {user && <h2 id="wd-dashboard-published">Welcome, {user.firstName || user.username}</h2>}
        <hr />
        
        {canEdit && (
          <div className="mb-4">
            <div className="d-flex justify-content-end mb-3">
              <Button variant="primary" onClick={addNewCourse}>
                Add New Course
              </Button>
            </div>
          </div>
        )}
        
        <h3>Published Courses ({courses?.length || 0})</h3>
        
        {coursesLoading ? (
          <div className="p-3 text-center">
            <p>Loading courses...</p>
          </div>
        ) : (
          <div className="row" id="wd-dashboard-courses">
            <div className={dashboardView === "card" ? "courses-grid" : "list-group w-100"}>
              {displayedCourses && displayedCourses.length > 0 ? (
                dashboardView === "card" ? (
                  // Card View
                  displayedCourses.map((course: Course) => (
                    <CourseCard
                      key={course._id || `course-${Math.random()}`}
                      course={course}
                      canEdit={canEdit}
                      enrolling={enrolling}
                      onDelete={handleShowDeleteModal}
                      onSetCourse={handleEditCourse}
                      onEnrollment={updateEnrollment}
                    />
                  ))
                ) : (
                  // List View
                  displayedCourses.map((course: Course) => (
                    <CourseListItem
                      key={course._id || `course-${Math.random()}`}
                      course={course}
                      canEdit={canEdit}
                      enrolling={enrolling}
                      onDelete={handleShowDeleteModal}
                      onSetCourse={handleEditCourse}
                      onEnrollment={updateEnrollment}
                    />
                  ))
                )
              ) : (
                <div className="col-12">
                  <p>No courses available. {enrolling ? "Try selecting 'All Courses' to enroll in available courses." : ""}</p>
                </div>
              )}
            </div>
            
            {/* Pagination controls */}
            {courses && courses.length > pagination.limit && (
              <nav className="mt-4 d-flex justify-content-center">
                <ul className="pagination">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${pagination.page === page ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${pagination.page === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        )}

        {/* Custom styles to match Canvas UI and fix the issues */}
        <style>{`
          .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
          }
          .course-card-wrapper {
            display: flex;
            width: 100%;
          }
          .course-card {
            display: flex;
            flex-direction: column;
            width: 100%;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid #dee2e6;
            overflow: hidden;
          }
          .course-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          .course-card-logo {
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #9ad9ee;
            overflow: hidden;
          }
          .course-card-body {
            flex-grow: 1;
            padding: 1rem;
          }
          .course-card .card-title {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #2d3b45;
          }
          .course-description {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #5a6268;
            font-size: 0.9rem;
            background-color: transparent; 
            padding: 0; 
          }
          .list-description {
            color: #5a6268;
            font-size: 0.9rem;
            background-color: transparent;
            padding: 0;
            max-width: 600px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .course-card .card-footer {
            background-color: #f8f9fa;
            border-top: 1px solid #dee2e6;
            padding: 0.75rem;
          }
          /* Match Canvas button styles */
          .btn-primary {
            background-color: #0374B5;
            border-color: #0374B5;
          }
          .btn-primary:hover {
            background-color: #02659E;
            border-color: #02659E;
          }
          /* Improved loading styles */
          .static-loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
            background-color: transparent;
            border: none;
            margin: 2rem 0;
          }
          .loading-text {
            color: #6c757d;
            font-size: 1rem;
            font-weight: 400;
            position: relative;
            padding-left: 30px;
          }
          .loading-text:before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            border: 2px solid #0374B5;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: translateY(-50%) rotate(360deg); }
          }
          /* Add content-visibility for performance */
          .courses-grid > div {
            content-visibility: auto;
            contain-intrinsic-size: 350px;
          }
          .list-group-item {
            content-visibility: auto;
            contain-intrinsic-size: 80px;
          }
          @media (max-width: 768px) {
            .courses-grid {
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }
          }
        `}</style>
      </div>

      {/* Course Form Modal */}
      <Modal 
        show={isFormModalOpen} 
        onHide={() => {
          setIsFormModalOpen(false);
          // Clear the selected course in Redux store when closing modal
          dispatch(setCourse(null));
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{course ? "Edit Course" : "Add New Course"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CourseForm
            course={course}
            onSubmit={handleSubmitCourse}
            onCancel={() => {
              setIsFormModalOpen(false);
              // Clear the selected course in Redux store when canceling
              dispatch(setCourse(null));
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteModalOpen}
        onHide={() => setDeleteModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this course? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleDeleteCourse}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
// src/Kambaz/Dashboard.tsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spinner, Modal } from 'react-bootstrap';
import * as client from "./Account/client";
import { setCurrentUser } from "./Account/reducer";
// Import React logo - adjust path if needed
import reactLogo from "../assets/react.svg";

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  description: string;
  enrolled?: boolean;
}

interface DashboardProps {
  courses: Course[];
  course?: Course;
  setCourse?: React.Dispatch<React.SetStateAction<Course>>;
  addNewCourse?: () => void;
  deleteCourse?: (courseId: string) => void;
  updateCourse?: (updatedCourse: Course) => void;
  enrolling: boolean;
  setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
}

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
  enrolling,
  setEnrolling,
  updateEnrollment,
}: DashboardProps) {
  // Get user from Redux state - match the property name in your reducer
  const { user } = useSelector((state: any) => state.accountReducer);
  const { loading: coursesLoading, error: coursesError } = useSelector((state: any) => state.coursesReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Async function to fetch the user profile from the backend
  const fetchProfile = async () => {
    try {
      // Set a loading timeout to show a message if loading takes too long
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000);

      console.log("Dashboard: Fetching user profile...");
      const userProfile = await client.profile();
      console.log("Dashboard: Profile response:", userProfile);
      dispatch(setCurrentUser(userProfile));
      
      // Clear the timeout if we get a response
      clearTimeout(timeoutId);
    } catch (error: any) {
      console.error("Error fetching profile in Dashboard:", error);
      if (error.response?.status === 401) {
        navigate("/Kambaz/Account/Signin");
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Prefetch the React logo to improve load time
    const img = new Image();
    img.src = reactLogo;
  }, []);

  const handleAddCourse = () => {
    if (addNewCourse) {
      addNewCourse();
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (deleteCourse) {
      deleteCourse(id);
    }
  };

  const handleUpdateCourse = () => {
    if (updateCourse && course) {
      updateCourse(course);
      setShowUpdateModal(false);
    }
  };

  const handleSetCourse = (newCourse: Course) => {
    if (setCourse) {
      setCourse(newCourse);
      // Open update modal when a course is selected
      setShowUpdateModal(true);
    }
  };

  // Handle enrollment
  const handleEnrollment = (courseId: string, enrolled: boolean) => {
    updateEnrollment(courseId, enrolled);
  };

  // Render a better loading indicator
  if (loadingProfile) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your dashboard...</p>
        {loadingTimeout && (
          <div className="alert alert-info mt-3">
            This is taking longer than expected. Please be patient...
          </div>
        )}
      </div>
    );
  }

  // Check if user is admin or faculty
  const isAdmin = user && user.role === "ADMIN";
  const isFaculty = user && user.role === "FACULTY";
  const canEdit = isAdmin || isFaculty;

  return (
    <div className="p-4" id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard {isAdmin ? "ADMIN" : ""}
        <button
          onClick={() => setEnrolling(!enrolling)}
          className="float-end btn btn-primary"
        >
          {enrolling ? "My Courses" : "All Courses"}
        </button>
      </h1>
      <hr />
      
      {coursesError && (
        <div className="alert alert-danger">
          Error loading courses: {coursesError}
        </div>
      )}

      {user && <h2 id="wd-dashboard-published">Welcome, {user.firstName || user.username}</h2>}
      <hr />
      
      {canEdit && (
        <div className="mb-4">
          <h3>New Course</h3>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="success" className="me-2">Save</Button>
            <Button variant="primary" onClick={handleAddCourse}>Add</Button>
          </div>
        </div>
      )}
      
      <h3>Published Courses ({courses?.length || 0})</h3>
      
      <div className="row" id="wd-dashboard-courses">
        {coursesLoading ? (
          <div className="col-12 text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading courses...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-4 g-4 courses-grid">
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id || `course-${Math.random()}`} className="col course-card-wrapper">
                  <div className="card h-100 course-card">
                    {/* React logo image */}
                    <div className="bg-info p-3 course-card-logo">
                      <img 
                        src={reactLogo} 
                        className="card-img-top" 
                        alt="React Logo" 
                        style={{ 
                          height: "120px", 
                          width: "100%", 
                          objectFit: "contain",
                          filter: "brightness(1.2)" // Make logo more visible
                        }}
                        loading="lazy" // Add lazy loading
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
                      
                      {/* Only show Edit and Delete buttons for admin or faculty */}
                      {canEdit && (
                        <>
                          <Link
                            to={`/Kambaz/Courses/${course._id}/Edit`}
                            className="btn btn-warning mx-2"
                            onClick={() => {
                              handleSetCourse(course);
                            }}
                          >
                            Edit
                          </Link>
                          
                          <Button 
                            variant="danger"
                            onClick={() => {
                              handleDeleteCourse(course._id);
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {/* Show enrollment buttons for students */}
                    {enrolling && !canEdit && (
                      <div className="card-footer">
                        <Button
                          onClick={() => handleEnrollment(course._id, !course.enrolled)}
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
                <p>No courses available. {enrolling ? "Try selecting 'All Courses' to enroll in available courses." : "You are not enrolled in any courses."}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Style tag to ensure consistent card sizing */}
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
        }

        .course-card-logo {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .course-card-body {
          flex-grow: 1;
        }

        .course-description {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
          .courses-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>

      {/* Modal for updating course */}
      {course && (
        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* You can add form fields here to edit course details */}
            <p>Are you sure you want to update this course?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateCourse}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
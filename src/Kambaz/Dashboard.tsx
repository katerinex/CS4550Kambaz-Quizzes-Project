// src/Kambaz/Dashboard.tsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from 'react-bootstrap';
import * as client from "./Account/client";
import { setCurrentUser } from "./Account/reducer";

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

  // Async function to fetch the user profile from the backend
  const fetchProfile = async () => {
    try {
      console.log("Dashboard: Fetching user profile...");
      const userProfile = await client.profile();
      console.log("Dashboard: Profile response:", userProfile);
      dispatch(setCurrentUser(userProfile));
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
    }
  };

  const handleSetCourse = (newCourse: Course) => {
    if (setCourse) {
      setCourse(newCourse);
    }
  };

  const displayCourse = () => {
    if (course) {
      console.log("Current course:", course);
    }
  };

  const displayCurrentUser = () => {
    if (user) {
      console.log("Current user:", user);
    } else {
      console.log("User is null or undefined");
    }
  };

  // Render a loading indicator while the profile is being fetched
  if (loadingProfile) {
    return <div>Loading user data...</div>;
  }

  // Debug information to help troubleshoot
  console.log("Dashboard render - User:", user);
  console.log("Dashboard render - Courses:", courses);

  return (
    <div className="p-4" id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
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
      <div className="row" id="wd-dashboard-courses">
        {coursesLoading ? (
          <div className="col-12">
            <p>Loading courses...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-5 g-4">
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id || `course-${Math.random()}`} className="col" style={{ width: "300px" }}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="wd-dashboard-course-title card-title">
                        {enrolling && (
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              // More robust validation
                              if (!course || !course._id || course._id === "undefined") {
                                console.error("Invalid course ID detected:", course);
                                alert("Cannot enroll in this course - missing course ID");
                                return; // Prevent enrollment with invalid course ID
                              }
                              
                              console.log(`Enrolling in course with ID: ${course._id}`);
                              updateEnrollment(course._id, !course.enrolled);
                            }}
                            className={`btn ${course.enrolled ? "btn-danger" : "btn-success"} float-end`}
                          >
                            {course.enrolled ? "Unenroll" : "Enroll"}
                          </button>
                        )}
                        {course.name}
                      </h5>
                      <p className="card-text">{course.description}</p>
                      <Link
                        to={`/Kambaz/Courses/${course._id}`}
                        className="btn btn-primary"
                      >
                        Go
                      </Link>
                    </div>
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
      
      {/* Development buttons - can be removed in production */}
      <div className="mt-4">
        <Button key="add-btn" variant="outline-primary" className="me-2" onClick={handleAddCourse}>Add Course</Button>
        <Button key="delete-btn" variant="outline-danger" className="me-2" onClick={() => handleDeleteCourse("someId")}>Delete Course</Button>
        <Button key="update-btn" variant="outline-primary" className="me-2" onClick={handleUpdateCourse}>Update Course</Button>
        <Button key="set-btn" variant="outline-secondary" className="me-2" onClick={() => handleSetCourse({} as Course)}>Set Course</Button>
        <Button key="display-course-btn" variant="outline-info" className="me-2" onClick={displayCourse}>Display Course</Button>
        <Button key="display-user-btn" variant="outline-info" onClick={displayCurrentUser}>Display Current User</Button>
      </div>
    </div>
  );
}
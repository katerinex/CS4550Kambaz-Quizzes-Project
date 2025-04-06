// src/Kambaz/index.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import Calendar from "./Calendar";
import Inbox from "./Inbox";
import "./styles.css";
import { useEffect, useState } from "react";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import { useDispatch, useSelector } from "react-redux";
import {
  setCourses,
  fetchCoursesStart,
  fetchCoursesFailure,
} from "./Courses/reducer";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";
import { Course } from "./types";
import axios from "axios";

export default function Kambaz() {
  // Changed from currentUser to user to match your Redux state structure
  const { user } = useSelector((state: any) => state.accountReducer);
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const findCoursesForUser = async () => {
    if (!user || !user._id) {
      console.error("User or user ID is missing.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    dispatch(fetchCoursesStart());
    
    try {
      console.log("Finding courses for user ID:", user._id);
      
      // First, let's check if we can fetch all courses to verify course data exists
      console.log("Fetching all courses to verify course data...");
      const allCourses = await courseClient.findAllCourses();
      console.log("All courses available in system:", allCourses);
      
      if (!Array.isArray(allCourses) || allCourses.length === 0) {
        console.warn("No courses found in the system or invalid response format");
      }
      
      // Then check the user courses endpoint
      console.log("Fetching enrolled courses for user:", user._id);
      const userCourses = await userClient.findCoursesForUser(user._id);
      console.log("User courses response:", userCourses);
      
      // Validate the response
      if (!Array.isArray(userCourses)) {
        console.error("Enrolled courses not returned as an array:", userCourses);
        dispatch(fetchCoursesFailure("Invalid response format from server"));
        setError("Failed to load enrolled courses. Please try again later.");
        setIsLoading(false);
        return;
      }
      
      // Filter out any courses without valid IDs
      const validCourses = userCourses.filter((course: any) => course && course._id);
      console.log("Valid enrolled courses:", validCourses);
        
      dispatch(setCourses(validCourses));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      let errorMessage = "Failed to fetch your enrolled courses";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      dispatch(fetchCoursesFailure(errorMessage));
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (!user || !user._id) {
      console.error("User or user ID is missing.");
      return;
    }
    
    // Add validation for courseId
    if (!courseId || courseId === "undefined") {
      console.error("Course ID is missing or undefined:", courseId);
      return;
    }
    
    console.log(`Updating enrollment - User: ${user._id}, Course: ${courseId}, Enrolled: ${enrolled}`);
    
    setIsLoading(true);
    dispatch(fetchCoursesStart());
    
    try {
      if (enrolled) {
        await userClient.enrollIntoCourse(user._id, courseId);
        console.log(`Successfully enrolled user ${user._id} in course ${courseId}`);
      } else {
        await userClient.unenrollFromCourse(user._id, courseId);
        console.log(`Successfully unenrolled user ${user._id} from course ${courseId}`);
      }
      
      // Update the courses array with the new enrollment status
      const updatedCourses = courses.map((course: Course) => {
        if (course._id === courseId) {
          return { ...course, enrolled: enrolled };
        } else {
          return course;
        }
      });
      
      dispatch(setCourses(updatedCourses));
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating enrollment:", error);
      let errorMessage = "Failed to update enrollment";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      dispatch(fetchCoursesFailure(errorMessage));
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    if (!user || !user._id) {
      console.error("User or user ID is missing.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    dispatch(fetchCoursesStart());
    
    try {
      console.log("Fetching all courses");
      const allCourses = await courseClient.findAllCourses();
      console.log("All courses:", allCourses);
      
      // Validate all courses response
      if (!Array.isArray(allCourses)) {
        console.error("All courses not returned as an array:", allCourses);
        dispatch(fetchCoursesFailure("Invalid response format from server"));
        setError("Failed to load courses. Please try again later.");
        setIsLoading(false);
        return;
      }
      
      // Filter out courses without valid IDs
      const validAllCourses = allCourses.filter((course: any) => course && course._id);
      console.log(`Found ${validAllCourses.length} valid courses`);
      
      if (validAllCourses.length === 0) {
        console.warn("No valid courses found in the system");
        dispatch(setCourses([]));
        setIsLoading(false);
        return;
      }
      
      // Get user's enrolled courses to mark enrollment status
      console.log("Finding courses for user ID:", user._id);
      let enrolledCourseIds: string[] = [];
      
      try {
        const enrolledCourses = await userClient.findCoursesForUser(user._id);
        console.log("User enrolled courses:", enrolledCourses);
        
        if (Array.isArray(enrolledCourses)) {
          // Extract just the IDs for comparison
          enrolledCourseIds = enrolledCourses
            .filter((course: any) => course && course._id)
            .map((course: any) => course._id);
            
          console.log("Enrolled course IDs:", enrolledCourseIds);
        } else {
          console.warn("Enrolled courses not returned as an array:", enrolledCourses);
        }
      } catch (enrollError) {
        console.error("Error fetching enrolled courses:", enrollError);
        // Continue with empty enrollments rather than failing completely
      }
      
      // Mark courses as enrolled based on the IDs we collected
      const processedCourses = validAllCourses.map((course: any) => ({
        ...course,
        enrolled: enrolledCourseIds.includes(course._id)
      }));
      
      console.log("Processed courses with enrollment status:", processedCourses);
      
      dispatch(setCourses(processedCourses));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all courses:", error);
      let errorMessage = "Failed to fetch available courses";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      dispatch(fetchCoursesFailure(errorMessage));
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      console.log("User is available, loading data...", user);
      if (enrolling) {
        fetchCourses();
      } else {
        findCoursesForUser();
      }
    } else {
      console.log("No user available yet");
      setIsLoading(false);
    }
  }, [user, enrolling]);

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          {error && (
            <div className="alert alert-danger">
              <h4>Error Loading Data</h4>
              <p>{error}</p>
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={() => {
                  setError(null);
                  if (enrolling) {
                    fetchCourses();
                  } else {
                    findCoursesForUser();
                  }
                }}
              >
                Try Again
              </button>
            </div>
          )}
          
          {isLoading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-3">Loading courses...</span>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="Dashboard" />} />
              <Route path="/Account/*" element={<Account />} />
              <Route
                path="/Dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard
                      courses={courses}
                      enrolling={enrolling}
                      setEnrolling={setEnrolling}
                      updateEnrollment={updateEnrollment}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Courses/:cid/*"
                element={
                  <ProtectedRoute>
                    <Courses courses={courses} />
                  </ProtectedRoute>
                }
              />
              <Route path="/Calendar" element={<Calendar />} />
              <Route path="/Inbox" element={<Inbox />} />
            </Routes>
          )}
        </div>
      </div>
    </Session>
  );
}
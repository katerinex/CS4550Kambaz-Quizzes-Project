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
      const fetchedCourses = await userClient.findCoursesForUser(
        user._id
      );
      console.log("Fetched courses:", fetchedCourses);
      
      // Filter out any courses without valid IDs
      const validCourses = Array.isArray(fetchedCourses) 
        ? fetchedCourses.filter((course: any) => course && course._id)
        : [];
        
      dispatch(setCourses(validCourses));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      let errorMessage = "Failed to fetch user courses";
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
      } else {
        await userClient.unenrollFromCourse(user._id, courseId);
      }
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
      
      console.log("Finding courses for user ID:", user._id);
      const enrolledCourses = await userClient.findCoursesForUser(
        user._id
      );
      console.log("User enrolled courses:", enrolledCourses);
      
      // Filter out any courses without valid IDs before processing
      const validAllCourses = Array.isArray(allCourses)
        ? allCourses.filter((course: any) => course && course._id)
        : [];
        
      const validEnrolledCourses = Array.isArray(enrolledCourses)
        ? enrolledCourses.filter((course: any) => course && course._id)
        : [];
      
      const fetchedCourses = validAllCourses.map((course: any) => {
        if (validEnrolledCourses.find((c: any) => c._id === course._id)) {
          return { ...course, enrolled: true };
        } else {
          return course;
        }
      });
      console.log("Processed courses with enrollment status:", fetchedCourses);
      
      dispatch(setCourses(fetchedCourses));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      let errorMessage = "Failed to fetch courses";
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
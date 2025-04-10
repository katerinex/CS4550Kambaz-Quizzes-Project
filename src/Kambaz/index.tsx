// src/Kambaz/index.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import Account from "./Account";
import Dashboard from "./Dashboard"; // Import the combined Dashboard component
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import CourseList from "./Courses/CourseList";
import AllCourses from "./Courses/AllCourses";
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
import * as userClient from "./Account/client";
import { Course } from "./types";
import axios from "axios";

export default function Kambaz() {
  const { user } = useSelector((state: any) => state.accountReducer);
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleNetworkError = async (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        setError(`Server Error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setError("No response from server. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const findCoursesForUser = async () => {
    if (!user || !user._id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    dispatch(fetchCoursesStart());
    
    try {
      const userCourses = await userClient.findCoursesForUser(user._id);
      
      if (!Array.isArray(userCourses)) {
        dispatch(fetchCoursesFailure("Invalid response format from server"));
        setError("Failed to load enrolled courses. Please try again later.");
        setIsLoading(false);
        return;
      }
      
      const validCourses = userCourses.filter((course: any) => course && course._id);
      
      dispatch(setCourses(validCourses));
      setIsLoading(false);
    } catch (error) {
      await handleNetworkError(error);
      
      let errorMessage = "Failed to fetch your enrolled courses";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      dispatch(fetchCoursesFailure(errorMessage));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      findCoursesForUser();
    } else {
      setIsLoading(false);
    }
  }, [user]);

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
                  findCoursesForUser();
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
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Courses"
                element={
                  <ProtectedRoute>
                    <AllCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Courses/list"
                element={
                  <ProtectedRoute>
                    <CourseList />
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
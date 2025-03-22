//src/Kambaz/index.tsx

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
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { courses } = useSelector((state: any) => state.coursesReducer); // Get courses from Redux
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const dispatch = useDispatch();

  const findCoursesForUser = async () => {
    if (!currentUser || !currentUser._id) {
      console.error("Current user or user ID is missing.");
      return;
    }
    dispatch(fetchCoursesStart());
    try {
      const fetchedCourses = await userClient.findCoursesForUser(
        currentUser._id
      );
      dispatch(setCourses(fetchedCourses));
    } catch (error) {
      console.error("Error fetching user courses:", error);
      let errorMessage = "Failed to fetch user courses";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      dispatch(fetchCoursesFailure(errorMessage));
    }
  };

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (!currentUser || !currentUser._id) {
      console.error("Current user or user ID is missing.");
      return;
    }
    dispatch(fetchCoursesStart());
    try {
      if (enrolled) {
        await userClient.enrollIntoCourse(currentUser._id, courseId);
      } else {
        await userClient.unenrollFromCourse(currentUser._id, courseId);
      }
      const updatedCourses = courses.map((course: Course) => { // Added Course type
        if (course._id === courseId) {
          return { ...course, enrolled: enrolled };
        } else {
          return course;
        }
      });
      dispatch(setCourses(updatedCourses));
    } catch (error) {
      console.error("Error updating enrollment:", error);
      let errorMessage = "Failed to update enrollment";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      dispatch(fetchCoursesFailure(errorMessage));
    }
  };

  const fetchCourses = async () => {
    if (!currentUser || !currentUser._id) {
      console.error("Current user or user ID is missing.");
      return;
    }
    dispatch(fetchCoursesStart());
    try {
      const allCourses = await courseClient.findAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(
        currentUser._id
      );
      const fetchedCourses = allCourses.map((course: any) => {
        if (enrolledCourses.find((c: any) => c._id === course._id)) {
          return { ...course, enrolled: true };
        } else {
          return course;
        }
      });
      dispatch(setCourses(fetchedCourses));
    } catch (error) {
      console.error("Error fetching courses:", error);
      let errorMessage = "Failed to fetch courses";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      dispatch(fetchCoursesFailure(errorMessage));
    }
  };

  useEffect(() => {
    if (currentUser && currentUser._id) {
      if (enrolling) {
        fetchCourses();
      } else {
        findCoursesForUser();
      }
    }
  }, [currentUser, enrolling]);

  return (
    <Session>
      <div id="wd-kambaz" style={{ display: "flex" }}>
        <KambazNavigation />
        <div className="wd-main-content-offset p-3" style={{ flex: 1 }}>
        <Routes>
            <Route path="/Account/*" element={<Account />} />
            <Route
              path="/Dashboard"
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
              path="/Dashboard/Edit"
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
            <Route path="/*" element={<Navigate to="/Account" replace />} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}
// src/Kambaz/Courses/Quizzes/index.tsx

import React, { useEffect } from "react";
import { useParams, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findQuizzesForCourse } from "./client";
import { fetchQuizzesSuccess, fetchQuizzesStart, fetchQuizzesFailure } from "./reducer";
import QuizList from "./QuizList";
import QuizDetails from "./QuizDetails";
import QuizEditor from "./QuizEditor";
import QuizPreview from "./QuizPreview";
import QuizTake from "./QuizTake";
import LastAttemptDetails from "./LastAttemptDetails";

// Define roles that have editing permissions
const EDITOR_ROLES = ['FACULTY', 'ADMIN', 'TA'];

// Define ProtectedRoute component to handle role-based access
const ProtectedRoute = ({ element, allowedRoles, redirectPath }: {
  element: JSX.Element,
  allowedRoles: string[],
  redirectPath: string
}) => {
  const { user } = useSelector((state: any) => state.accountReducer);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }
  return element;
};

interface QuizzesProps {
  courseId?: string;
}

const Quizzes: React.FC<QuizzesProps> = ({ courseId }) => {
  const { cid } = useParams<{ cid?: string }>();
  const activeCourseId = courseId || cid;
  const dispatch = useDispatch();

  // Get current user from Redux store
  const { user } = useSelector((state: any) => state.accountReducer);

  // Check if user has editor permissions
  const hasEditorPermissions = user && EDITOR_ROLES.includes(user.role);

  useEffect(() => {
    // Only fetch quizzes if we have a courseId
    if (!activeCourseId) return;

    const fetchQuizzes = async () => {
      console.log("Fetching quizzes for course:", activeCourseId);
      dispatch(fetchQuizzesStart());
      try {
        const fetchedQuizzes = await findQuizzesForCourse(activeCourseId);
        console.log("Fetched quizzes:", fetchedQuizzes);
        dispatch(fetchQuizzesSuccess(fetchedQuizzes));
      } catch (err: any) {
        console.error("Error fetching quizzes:", err);
        dispatch(fetchQuizzesFailure(err.message || "Failed to fetch quizzes"));
      }
    };

    fetchQuizzes();
  }, [activeCourseId, dispatch]);

  return (
    <div className="quizzes-container">
      <Routes>
        {/* The quiz list is accessible to all users */}
        <Route path="/" element={<QuizList />} />

        {/* Details page accessible to all but shows different UI based on role */}
        <Route path=":qid" element={<QuizDetails />} />

        {/* Editor routes - only for faculty/admin/TA */}
        {hasEditorPermissions && (
          <>
            <Route
              path=":qid/edit"
              element={
                <ProtectedRoute
                  element={<QuizEditor />}
                  allowedRoles={EDITOR_ROLES}
                  redirectPath={`/Kambaz/Courses/${activeCourseId}/Quizzes`}
                />
              }
            />
            <Route
              path="new/edit"
              element={
                <ProtectedRoute
                  element={<QuizEditor />}
                  allowedRoles={EDITOR_ROLES}
                  redirectPath={`/Kambaz/Courses/${activeCourseId}/Quizzes`}
                />
              }
            />
            {/* Preview route - only for faculty/admin/TA */}
            <Route
              path=":qid/preview"
              element={
                <ProtectedRoute
                  element={<QuizPreview />}
                  allowedRoles={EDITOR_ROLES}
                  redirectPath={`/Kambaz/Courses/${activeCourseId}/Quizzes/:qid`}
                />
              }
            />
          </>
        )}

        {/* Take quiz route - accessible to all users with specific behavior based on role */}
        <Route path=":qid/take" element={<QuizTake />} />

        <Route path=":qid/attempt/:attemptId" element={<LastAttemptDetails />}/>
      </Routes>
    </div>
  );
};

export default Quizzes;
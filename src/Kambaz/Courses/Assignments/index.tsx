// src/Kambaz/Courses/Assignments/index.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AssignmentsPage from "./AssignmentsPage";

interface AssignmentsProps {
  courseId: string;
}

const Assignments = ({ courseId }: AssignmentsProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // If the component is accessed directly, redirect to the assignments page
    if (!courseId) {
      navigate("/Kambaz/Dashboard");
    }
  }, [courseId, navigate]);

  // Simply render the AssignmentsPage component, which handles all assignment functionality
  return <AssignmentsPage />;
};

export default Assignments;
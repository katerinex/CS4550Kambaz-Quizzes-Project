// src/Kambaz/Courses/index.tsx
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import Quizzes from "./Quizzes"; // Import Quizzes component
import PeopleTable from "./People/Table";
import { FaAlignJustify } from "react-icons/fa6";
import { Navigate, Route, Routes, useParams, useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";

interface Enrollment {
  user: string;
  course: string;
}

export default function Courses({ courses }: { courses: any[]; }) {
  const { cid } = useParams<{ cid: string }>();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  // Changed from currentUser to user to match Redux state
  const { user } = useSelector((state: any) => state.accountReducer);
  const enrollments = useSelector((state: any) => state.enrollmentsReducer || []);
  const navigate = useNavigate();
  
  // Debug logging
  console.log("Course component - Course:", course);
  console.log("Course component - User:", user);
  console.log("Course component - Enrollments:", enrollments);
  
  if (!course) {
    return <div>Course not found.</div>;
  }
  
  // Check if the user is enrolled either through the course's enrolled property
  // or through the enrollments array
  const isEnrolledThroughProperty = course.enrolled === true;
  const isEnrolledThroughArray = Array.isArray(enrollments) && enrollments.some(
    (enrollment: Enrollment) => enrollment.user === user?.id && enrollment.course === cid
  );
  const isEnrolled = isEnrolledThroughProperty || isEnrolledThroughArray;
  
  // Only redirect students who aren't enrolled
  if (user?.role === "STUDENT" && !isEnrolled) {
    console.log("Student not enrolled, redirecting to dashboard");
    navigate("/Kambaz/Dashboard");
    return null;
  }
  
  // Get the current section name (e.g., Home, Modules, etc.)
  const sectionName = pathname.split("/")[4] || "Home";
  
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course.name} &gt; {sectionName}
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation courseId={cid} />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules courseId={cid} />} />
            <Route path="Assignments" element={<Assignments courseId={cid} />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="Quizzes/*" element={<Quizzes />} />
            <Route path="People" element={<PeopleTable />} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
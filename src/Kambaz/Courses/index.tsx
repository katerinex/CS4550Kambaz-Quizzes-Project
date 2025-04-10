// src/Kambaz/Courses/index.tsx
import { useState } from "react";
import CoursesNavigation, { CourseMenu } from "./Navigation"; // Import both components
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import Quizzes from "./Quizzes";
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
  const { user } = useSelector((state: any) => state.accountReducer);
  const enrollments = useSelector((state: any) => state.enrollmentsReducer || []);
  const navigate = useNavigate();
  
  // State for controlling the courses sidebar
  const [isNavOpen, setIsNavOpen] = useState(false);


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
        <FaAlignJustify 
          className="me-4 fs-4 mb-1" 
          onClick={() => setIsNavOpen(true)} 
          style={{ cursor: 'pointer' }} 
        />
        {course.name} &gt; {sectionName}
      </h2>
      <hr />
      
      {/* Render the sidebar when needed */}
      <CoursesNavigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      
      <div className="d-flex">
        <div className="d-none d-md-block">
          {/* Use the exported CourseMenu component */}
          <CourseMenu courseId={cid} />
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
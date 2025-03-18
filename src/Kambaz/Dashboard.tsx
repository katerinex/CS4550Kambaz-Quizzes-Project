// src/Kambaz/Dashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from 'react-bootstrap';

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
  const { currentUser } = useSelector((state: any) => state.accountReducer);

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
    if (currentUser) {
      console.log("Current user:", currentUser);
    }
  };

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
      <h2 id="wd-dashboard-published">Published Courses</h2>
      <hr />
      <div className="row" id="wd-dashboard-courses">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {courses.map((course) => ( 
            <div key={course._id} className="col" style={{ width: "300px" }}>
              <div className="card">
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    {enrolling && (
                      <button
                        onClick={(event) => {
                          event.preventDefault();
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
          ))}
        </div>
      </div>
      <Button onClick={handleAddCourse}>Add Course</Button>
      <Button onClick={() => handleDeleteCourse("someId")}>
        Delete Course
      </Button>
      <Button onClick={handleUpdateCourse}>Update Course</Button>
      <Button onClick={() => handleSetCourse({} as Course)}>
        Set Course
      </Button>
      <Button onClick={displayCourse}>Display Course</Button>
      <Button onClick={displayCurrentUser}>Display Current User</Button>
    </div>
  );
}
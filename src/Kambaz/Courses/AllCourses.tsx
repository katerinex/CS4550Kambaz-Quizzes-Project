//src/Kambaz/Courses/AllCourses.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Spinner, Tabs, Tab, Form, InputGroup } from 'react-bootstrap';
import * as courseClient from './client';
import * as userClient from '../Account/client';
import { setCourses, fetchCoursesStart, fetchCoursesFailure } from './reducer';
import reactLogo from '../../assets/react.svg';

const AllCourses = () => {
  // Only destructure what we use from the Redux state
  const { user } = useSelector((state: any) => state.accountReducer);
  const [activeTab, setActiveTab] = useState('enrolled');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const dispatch = useDispatch();

  // Check if user is admin or faculty
  const isAdmin = user && user.role === "ADMIN";
  const isFaculty = user && user.role === "FACULTY";
  const canEdit = isAdmin || isFaculty;

  useEffect(() => {
    fetchAllCoursesData();
  }, [user]);

  const fetchAllCoursesData = async () => {
    if (!user || !user._id) return;
    
    setIsLoading(true);
    dispatch(fetchCoursesStart());
    
    try {
      // Get all courses
      const allCourses = await courseClient.findAllCourses();
      
      // Get user's enrolled courses
      const userEnrolledCourses = await userClient.findCoursesForUser(user._id);
      
      // Set enrolled flag on all courses
      const enrolledIds = userEnrolledCourses.map((course: any) => course._id);
      
      const processedCourses = allCourses.map((course: any) => ({
        ...course,
        enrolled: enrolledIds.includes(course._id)
      }));
      
      // Separate enrolled and available courses
      const enrolled = processedCourses.filter((course: any) => course.enrolled);
      const available = processedCourses.filter((course: any) => !course.enrolled);
      
      setEnrolledCourses(enrolled);
      setAvailableCourses(available);
      dispatch(setCourses(processedCourses));
      
      setIsLoading(false);
    } catch (error) {
      let errorMessage = "Failed to fetch courses";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(fetchCoursesFailure(errorMessage));
      setIsLoading(false);
    }
  };

  const handleEnrollment = async (courseId: string, enroll: boolean) => {
    if (!user || !user._id) return;
    
    setIsLoading(true);
    
    try {
      if (enroll) {
        await userClient.enrollIntoCourse(user._id, courseId);
      } else {
        await userClient.unenrollFromCourse(user._id, courseId);
      }
      
      // Refresh the courses
      await fetchAllCoursesData();
    } catch (error) {
      console.error("Error updating enrollment:", error);
      setIsLoading(false);
    }
  };

  // Filter courses based on search term
  const filterCourses = (courses: any[]) => {
    if (!searchTerm) return courses;
    
    return courses.filter(course => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredEnrolled = filterCourses(enrolledCourses);
  const filteredAvailable = filterCourses(availableCourses);

  return (
    <div className="p-4">
      <h1 className="mb-3">Courses</h1>
      
      {/* Search Bar */}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button 
            variant="outline-secondary" 
            onClick={() => setSearchTerm('')}
          >
            Clear
          </Button>
        )}
      </InputGroup>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'enrolled')}
        className="mb-3"
      >
        <Tab eventKey="enrolled" title={`My Courses (${filteredEnrolled.length})`}>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your courses...</p>
            </div>
          ) : filteredEnrolled.length > 0 ? (
            <div className="courses-grid">
              {filteredEnrolled.map((course) => (
                <div key={course._id} className="course-card-wrapper">
                  <div className="card h-100 course-card">
                    <div className="bg-info p-3 course-card-logo">
                      <img
                        src={reactLogo}
                        className="card-img-top"
                        alt="React Logo"
                        style={{
                          height: "120px",
                          width: "100%",
                          objectFit: "contain",
                          filter: "brightness(1.2)"
                        }}
                        loading="lazy"
                      />
                    </div>
                    <div className="card-body course-card-body">
                      <h5 className="card-title">{course.name}</h5>
                      <p className="card-text course-description">
                        {course.description || "No description available"}
                      </p>
                    </div>
                    <div className="card-footer d-flex">
                      <Link
                        to={`/Kambaz/Courses/${course._id}`}
                        className="btn btn-primary"
                      >
                        Go
                      </Link>
                      
                      {canEdit && (
                        <>
                          <Link
                            to={`/Kambaz/Courses/${course._id}/Edit`}
                            className="btn btn-warning mx-2"
                          >
                            Edit
                          </Link>
                          
                          <Button variant="danger">
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {!canEdit && (
                      <div className="card-footer">
                        <Button
                          onClick={() => handleEnrollment(course._id, false)}
                          className="btn btn-danger w-100"
                        >
                          Unenroll
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              {searchTerm ? "No enrolled courses match your search." : "You are not enrolled in any courses."}
            </div>
          )}
        </Tab>
        
        <Tab eventKey="available" title={`All Courses (${filteredAvailable.length})`}>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading available courses...</p>
            </div>
          ) : filteredAvailable.length > 0 ? (
            <div className="courses-grid">
              {filteredAvailable.map((course) => (
                <div key={course._id} className="course-card-wrapper">
                  <div className="card h-100 course-card">
                    <div className="bg-info p-3 course-card-logo">
                      <img
                        src={reactLogo}
                        className="card-img-top"
                        alt="React Logo"
                        style={{
                          height: "120px",
                          width: "100%",
                          objectFit: "contain",
                          filter: "brightness(1.2)"
                        }}
                        loading="lazy"
                      />
                    </div>
                    <div className="card-body course-card-body">
                      <h5 className="card-title">{course.name}</h5>
                      <p className="card-text course-description">
                        {course.description || "No description available"}
                      </p>
                    </div>
                    <div className="card-footer d-flex">
                      {canEdit && (
                        <>
                          <Link
                            to={`/Kambaz/Courses/${course._id}`}
                            className="btn btn-primary"
                          >
                            Go
                          </Link>
                          
                          <Link
                            to={`/Kambaz/Courses/${course._id}/Edit`}
                            className="btn btn-warning mx-2"
                          >
                            Edit
                          </Link>
                          
                          <Button variant="danger">
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {!canEdit && (
                      <div className="card-footer">
                        <Button
                          onClick={() => handleEnrollment(course._id, true)}
                          className="btn btn-success w-100"
                        >
                          Enroll
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              {searchTerm ? "No available courses match your search." : "There are no available courses to enroll in."}
            </div>
          )}
        </Tab>
      </Tabs>
      
      {/* Style tag to ensure consistent card sizing */}
      <style>{`
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .course-card-wrapper {
          display: flex;
          width: 100%;
        }

        .course-card {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .course-card-logo {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .course-card-body {
          flex-grow: 1;
        }

        .course-description {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          color: rgba(0, 0, 0, 0.5);
          background-color: transparent !important;
        }
        
        /* Additional styles to ensure no green background */
        p.course-description,
        .card-text.course-description {
          background: none !important;
        }
        
        .card-body {
          background-color: white !important;
        }

        @media (max-width: 768px) {
          .courses-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default AllCourses;
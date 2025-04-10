// src/Kambaz/Courses/Quizzes/QuizList.tsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Dropdown, Spinner, Alert, Modal } from "react-bootstrap";
import { FaPlus, FaEllipsisV, FaCheck, FaBan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { findQuizzesForCourse, deleteQuiz, updateQuiz, findQuizAttemptsByQuizAndUser } from "./client";
import {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  deleteQuizStart,
  deleteQuizSuccess,
  deleteQuizFailure,
  togglePublishStart,
  togglePublishSuccess,
  togglePublishFailure
} from "./reducer";
import "./QuizList.css";

// Define roles 
const EDITOR_ROLES = ['FACULTY', 'ADMIN', 'TA'];

const QuizList: React.FC = () => {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // For confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  // Select quizzes, loading, and error states from Redux
  const { quizzes, loading, error } = useSelector((state: any) => state.quizReducer);

  // Get current user from Redux store
  const { user } = useSelector((state: any) => state.accountReducer);

  // Check if user has editor permissions
  const hasEditorPermissions = user && EDITOR_ROLES.includes(user.role);


  const [attemptsByQuiz, setAttemptsByQuiz] = useState<{ [quizId: string]: number }>({});


  // Fetch quizzes on component mount
  useEffect(() => {
    // const fetchQuizzes = async () => {
    //   if (!cid) return;

    //   dispatch(fetchQuizzesStart());
    //   try {
    //     // Fetch quizzes for the specific course
    //     const fetchedQuizzes = await findQuizzesForCourse(cid);
    //     dispatch(fetchQuizzesSuccess(fetchedQuizzes));
    //   } catch (err: any) {
    //     dispatch(fetchQuizzesFailure(err.message || "Failed to fetch quizzes"));
    //   }
    // };
    const fetchQuizzes = async () => {
      if (!cid) return;

      dispatch(fetchQuizzesStart());
      try {
        const fetchedQuizzes = await findQuizzesForCourse(cid);
        dispatch(fetchQuizzesSuccess(fetchedQuizzes));

        // Fetch attempts per quiz for the logged-in student
        if (user && user.role === "STUDENT") {
          const attemptsMap: { [quizId: string]: number } = {};
          for (const quiz of fetchedQuizzes) {
            const attempts = await findQuizAttemptsByQuizAndUser(quiz._id, user._id);
            attemptsMap[quiz._id] = attempts.length;
          }
          setAttemptsByQuiz(attemptsMap);
        }
      } catch (err: any) {
        dispatch(fetchQuizzesFailure(err.message || "Failed to fetch quizzes"));
      }
    };

    fetchQuizzes();
  }, [cid, dispatch]);


  // Check availability status of a quiz
  const getAvailabilityStatus = (quiz: any): string => {
    const now = new Date();
    const availableDate = new Date(quiz.availableDate);
    const untilDate = new Date(quiz.untilDate);

    if (now > untilDate) {
      return "Closed";
    } else if (now >= availableDate && now <= untilDate) {
      return "Available";
    } else {
      return `Not available until ${availableDate.toLocaleDateString()}`;
    }
  };

  // Navigate to create new quiz - only for editors
  const handleAddQuiz = () => {
    if (hasEditorPermissions) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/new/edit`);
    }
  };

  // Toggle published status - only for editors
  const togglePublishStatus = async (id: string) => {
    if (!hasEditorPermissions) return;

    dispatch(togglePublishStart());
    try {
      const quiz = quizzes.find((q: any) => q._id === id);
      if (!quiz) return;

      // We're not using the returned updated quiz directly, but keeping the API call
      await updateQuiz(id, {
        published: !quiz.published
      });

      dispatch(togglePublishSuccess({ ...quiz, published: !quiz.published }));
    } catch (error: any) {
      dispatch(togglePublishFailure(error.message || "Failed to toggle publish status"));
    }
  };

  // Open delete confirmation modal - only for editors
  const confirmDelete = (id: string) => {
    if (!hasEditorPermissions) return;

    setQuizToDelete(id);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const cancelDelete = () => {
    setQuizToDelete(null);
    setShowDeleteModal(false);
  };

  // Delete a quiz - only for editors
  const handleDeleteQuiz = async () => {
    if (!quizToDelete || !hasEditorPermissions) return;

    dispatch(deleteQuizStart());
    try {
      await deleteQuiz(quizToDelete);
      dispatch(deleteQuizSuccess(quizToDelete));
      setShowDeleteModal(false);
      setQuizToDelete(null);
    } catch (error: any) {
      dispatch(deleteQuizFailure(error.message || "Failed to delete quiz"));
      setShowDeleteModal(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        {error}
        <Button
          variant="outline-danger"
          className="ms-3"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="quiz-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Quizzes</h1>
        {/* Only show Add Quiz button to users with editor permissions */}
        {hasEditorPermissions && (
          <Button
            variant="primary"
            onClick={handleAddQuiz}
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" /> Quiz
          </Button>
        )}
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state text-center p-5 bg-light rounded">
          {hasEditorPermissions ? (
            <p className="mb-3">No quizzes yet. Click the "+ Quiz" button to create your first quiz.</p>
          ) : (
            <p className="mb-3">No quizzes available for this course yet.</p>
          )}
        </div>
      ) : (
        <div className="quizzes-list">
          {quizzes.map((quiz: any) => {
            const attempts = attemptsByQuiz[quiz._id] || 0;
            const maxAttempts = quiz.multipleAttempts ? quiz.attemptsAllowed : 1;
            const attemptsExceeded = attempts >= maxAttempts;

            return (
              <div key={quiz._id} className="quiz-item card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      {/* Only show publish/unpublish button to editors */}
                      {hasEditorPermissions ? (
                        <button
                          className={`publish-status-btn me-3 btn ${quiz.published ? 'btn-success' : 'btn-secondary'}`}
                          onClick={() => togglePublishStatus(quiz._id)}
                          aria-label={quiz.published ? "Published" : "Unpublished"}
                        >
                          {quiz.published ? <FaCheck /> : <FaBan />}
                        </button>
                      ) : (
                        <span
                          className={`publish-status-indicator me-3 ${quiz.published ? 'text-success' : 'text-secondary'}`}
                        >
                          {quiz.published ? <FaCheck /> : <FaBan />}
                        </span>
                      )}
                      <h5 className="card-title mb-0">
                        <Link to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}>
                          {quiz.title}
                        </Link>
                      </h5>
                    </div>

                    {/* Only show context menu to users with editor permissions */}
                    {hasEditorPermissions && (
                      <Dropdown>
                        <Dropdown.Toggle variant="light" id={`dropdown-${quiz._id}`} className="btn-sm">
                          <FaEllipsisV />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item as={Link} to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/edit`}>Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => confirmDelete(quiz._id)}>Delete</Dropdown.Item>
                          <Dropdown.Item onClick={() => togglePublishStatus(quiz._id)}>
                            {quiz.published ? "Unpublish" : "Publish"}
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/preview`}>Preview</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>

                  <div className="quiz-metadata mt-2">
                    <div className="row">
                      <div className="col-md-4">
                        <small className="text-muted d-block">
                          <strong>Availability:</strong> {getAvailabilityStatus(quiz)}
                        </small>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted d-block">
                          <strong>Due:</strong> {formatDate(quiz.dueDate)}
                        </small>
                      </div>
                      <div className="col-md-2">
                        <small className="text-muted d-block">
                          <strong>Points:</strong> {quiz.points}
                        </small>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted d-block">
                          <strong>Questions:</strong> {quiz.questions.length}
                        </small>
                      </div>
                      {/* Show score for students who have attempted the quiz */}
                      {user && user.role === 'STUDENT' && quiz.userAttempts && quiz.userAttempts[user._id] && (
                        <div className="col-md-12 mt-2">
                          <small className="text-success d-block">
                            <strong>Your Score:</strong> {quiz.userAttempts[user._id].score}/{quiz.points}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Only show Take Quiz button for students if quiz is published and available */}
                  {user && user.role === 'STUDENT' && quiz.published && getAvailabilityStatus(quiz) === "Available" && (
                    <div className="mt-3">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/take`)}
                        disabled={attemptsExceeded}
                      >
                        {attemptsExceeded ? "No More Attempts" : "Take Quiz"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this quiz? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteQuiz}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuizList;
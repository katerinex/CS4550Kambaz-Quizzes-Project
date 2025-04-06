
// src/Kambaz/Courses/Quizzes/QuizDetails.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Card, Row, Col, ListGroup, Spinner, Alert, Badge, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { findQuizById } from "./client";
import { fetchQuizStart, fetchQuizSuccess, fetchQuizFailure } from "./reducer";
import "./QuizDetails.css";

// Define roles that have editing permissions
const EDITOR_ROLES = ['FACULTY', 'ADMIN', 'TA'];

const QuizDetails: React.FC = () => {
  // Using useState to potentially manage local component state
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get quiz, loading, and error state from Redux
  const { currentQuiz: quiz, loading, error } = useSelector((state: any) => state.quizReducer);
  
  // Get user from Redux state
  const { user } = useSelector((state: any) => state.accountReducer);
  
  // Check if user has editor permissions
  const hasEditorPermissions = user && EDITOR_ROLES.includes(user.role);
  const isStudent = user && user.role === 'STUDENT';

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid) return;
      
      dispatch(fetchQuizStart());
      try {
        const fetchedQuiz = await findQuizById(qid);
        dispatch(fetchQuizSuccess(fetchedQuiz));
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load quiz";
        dispatch(fetchQuizFailure(errorMessage));
        console.error("Error fetching quiz:", err);
      }
    };

    fetchQuiz();
  }, [qid, dispatch]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  // Check if student can take the quiz based on availability and attempts
  const canTakeQuiz = (): boolean => {
    if (!quiz || !isStudent) return false;
    
    // Check if published
    if (!quiz.published) return false;
    
    // Check availability
    const now = new Date();
    const availableDate = new Date(quiz.availableDate);
    const untilDate = new Date(quiz.untilDate);
    
    if (now < availableDate || now > untilDate) return false;
    
    // Check attempts if multiple attempts are limited
    if (quiz.multipleAttempts && quiz.attemptsAllowed > 0) {
      const userAttempts = quiz.userAttempts?.[user._id]?.attempts || 0;
      if (userAttempts >= quiz.attemptsAllowed) return false;
    }
    
    return true;
  };

  // Get student attempts info
  const getStudentAttemptsInfo = (): React.ReactNode => {
    if (!isStudent || !quiz || !quiz.userAttempts || !quiz.userAttempts[user._id]) {
      return <p>You haven't attempted this quiz yet.</p>;
    }
    
    const userQuizData = quiz.userAttempts[user._id];
    const attempts = userQuizData.attempts || 0;
    const lastScore = userQuizData.score || 0;
    const maxAttempts = quiz.multipleAttempts ? quiz.attemptsAllowed : 1;
    
    return (
      <div className="student-attempts-info">
        <p>
          <strong>Your attempts:</strong> {attempts} of {maxAttempts}
        </p>
        {attempts > 0 && (
          <p>
            <strong>Last score:</strong> {lastScore} out of {quiz.points} 
            ({((lastScore / quiz.points) * 100).toFixed(1)}%)
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading quiz details...</span>
        </Spinner>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <Alert variant="danger" className="m-4" role="alert">
        {error || "Quiz not found"}
        <Button 
          variant="link" 
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          className="d-block mt-3"
        >
          Return to Quiz List
        </Button>
      </Alert>
    );
  }

  // Mixed layout approach using both Table and ListGroup to satisfy component usage
  return (
    <div className="quiz-details-container">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1>{quiz.title}</h1>
          <div className="mb-3">
            {quiz.published ? (
              <Badge bg="success">Published</Badge>
            ) : (
              <Badge bg="secondary">Unpublished</Badge>
            )}
          </div>
        </div>
        <div>
          {hasEditorPermissions ? (
            // Editor actions
            <>
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`)}
              >
                Preview
              </Button>
              <Button 
                variant="primary"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)}
              >
                Edit
              </Button>
            </>
          ) : isStudent && quiz.published ? (
            // Student actions for published quizzes
            <>
              {canTakeQuiz() ? (
                <Button 
                  variant="success"
                  onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`)}
                >
                  Start Quiz
                </Button>
              ) : (
                <Button 
                  variant="secondary"
                  disabled
                >
                  {new Date() < new Date(quiz.availableDate) 
                    ? "Not Available Yet" 
                    : new Date() > new Date(quiz.untilDate)
                      ? "Closed"
                      : "No Attempts Remaining"}
                </Button>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Student-specific attempt information */}
      {isStudent && (
        <Card className="mb-4">
          <Card.Header as="h5">Your Progress</Card.Header>
          <Card.Body>
            {getStudentAttemptsInfo()}
          </Card.Body>
        </Card>
      )}

      <Card className="mb-4">
        <Card.Header as="h5">Quiz Details</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              {/* Canvas-style two-column layout using ListGroup for first column */}
              <ListGroup variant="flush" className="quiz-properties mb-4">
                <ListGroup.Item>
                  <strong>Quiz Type:</strong> <span>{quiz.quizType}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Points:</strong> <span>{quiz.points}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Assignment Group:</strong> <span>{quiz.assignmentGroup}</span>
                </ListGroup.Item>
                {hasEditorPermissions && (
                  <>
                    <ListGroup.Item>
                      <strong>Shuffle Answers:</strong> <span>{quiz.shuffleAnswers ? "Yes" : "No"}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Time Limit:</strong> <span>{quiz.timeLimit} Minutes</span>
                    </ListGroup.Item>
                  </>
                )}
                <ListGroup.Item>
                  <strong>Multiple Attempts:</strong> <span>{quiz.multipleAttempts ? "Yes" : "No"}</span>
                </ListGroup.Item>
                {quiz.multipleAttempts && (
                  <ListGroup.Item>
                    <strong>How Many Attempts:</strong> <span>{quiz.attemptsAllowed}</span>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
            
            <Col md={6}>
              {/* Table layout for the second column */}
              <Table className="quiz-details-table mb-0">
                <tbody>
                  {hasEditorPermissions && (
                    <>
                      <tr>
                        <td>Show Correct Answers:</td>
                        <td>{quiz.showCorrectAnswers ? "Yes" : "No"}</td>
                      </tr>
                      {quiz.accessCode && (
                        <tr>
                          <td>Access Code:</td>
                          <td>{quiz.accessCode}</td>
                        </tr>
                      )}
                      <tr>
                        <td>One Question at a Time:</td>
                        <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
                      </tr>
                      <tr>
                        <td>Webcam Required:</td>
                        <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
                      </tr>
                      <tr>
                        <td>Lock Questions After Answering:</td>
                        <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td>Due Date:</td>
                    <td>{formatDate(quiz.dueDate)}</td>
                  </tr>
                  <tr>
                    <td>Available From:</td>
                    <td>{formatDate(quiz.availableDate)}</td>
                  </tr>
                  <tr>
                    <td>Available Until:</td>
                    <td>{formatDate(quiz.untilDate)}</td>
                  </tr>
                  <tr>
                    <td>Questions:</td>
                    <td>{quiz.questions.length}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {quiz.description && (
        <Card className="mb-4">
          <Card.Header as="h5">Description</Card.Header>
          <Card.Body>
            <Row>
              <Col xs={12}>
                <div>
                  {showFullDescription ? quiz.description : 
                    quiz.description.length > 200 ? 
                      quiz.description.substring(0, 200) + '...' : 
                      quiz.description
                  }
                  {quiz.description.length > 200 && (
                    <Button 
                      variant="link" 
                      onClick={() => setShowFullDescription(!showFullDescription)} 
                      className="p-0 ms-2"
                    >
                      {showFullDescription ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <div className="quiz-actions">
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          className="me-3"
        >
          Back to Quizzes
        </Button>
        
        <Link 
          to={`/Kambaz/Courses/${cid}`}
          className="btn btn-outline-secondary"
        >
          Course Home
        </Link>
      </div>
    </div>
  );
};

export default QuizDetails;
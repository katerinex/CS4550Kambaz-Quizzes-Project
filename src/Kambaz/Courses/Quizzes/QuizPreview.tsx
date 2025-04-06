
//src/Kambaz/Courses/Quizzes/QuizPreview.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Alert, Badge, Card, Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import QuizTake from "./QuizTake"; 
import { findQuizById } from "./client"; 
import { fetchQuizSuccess } from "./reducer"; 

// Define roles 
const EDITOR_ROLES = ['FACULTY', 'ADMIN', 'TA'];

// Interface for quiz answers
interface QuizAnswer {
  questionId: string;
  answer: string | string[] | boolean;
  isCorrect: boolean;
}

interface QuizAttempt {
  attemptId: string;
  quizId: string;
  userId: string;
  timestamp: string;
  score: number;
  totalPoints: number;
  answers: QuizAnswer[];
}

const QuizPreview: React.FC = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State for quiz answers and score
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Get user and quiz from Redux state
  const { user } = useSelector((state: any) => state.accountReducer);
  const { quizzes, currentQuiz } = useSelector((state: any) => state.quizReducer);
  const quiz = quizzes.find((q: any) => q._id === qid) || currentQuiz;
  
  // Check if user has editor permissions
  const hasEditorPermissions = user && EDITOR_ROLES.includes(user.role);
  
  // Load quiz data and previous attempts
  useEffect(() => {
    const loadQuizAndAttempts = async () => {
      if (!quiz && qid) {
        try {
          const fetchedQuiz = await findQuizById(qid);
          dispatch(fetchQuizSuccess(fetchedQuiz));
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      }
      
      if (quiz) {
        setTotalPoints(quiz.points || 0);
        
        // Load previous attempts from localStorage
        const storedAttempts = localStorage.getItem(`quiz_attempts_${qid}_${user?.id}`);
        if (storedAttempts) {
          const parsedAttempts = JSON.parse(storedAttempts);
          setAttempts(parsedAttempts);
        }
      }
    };
    
    loadQuizAndAttempts();
  }, [qid, quiz, user, dispatch]);
  
  // Redirect non-editors
  useEffect(() => {
    if (!hasEditorPermissions) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
    }
  }, [hasEditorPermissions, navigate, cid, qid]);
  
  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: string | string[] | boolean, isCorrect: boolean) => {
    const existingIndex = answers.findIndex(a => a.questionId === questionId);
    const newAnswers = [...answers];
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, answer, isCorrect };
    } else {
      newAnswers.push({ questionId, answer, isCorrect });
    }
    
    setAnswers(newAnswers);
    
    // Calculate current score
    const score = newAnswers.reduce((sum, answer) => sum + (answer.isCorrect ? 1 : 0), 0);
    setCurrentScore(score);
  };
  
  // Handle quiz submission
  const handleSubmitQuiz = () => {
    // Create a new attempt
    const attemptId = `attempt_${Date.now()}`;
    const newAttempt: QuizAttempt = {
      attemptId,
      quizId: qid || '',
      userId: user?.id || '',
      timestamp: new Date().toISOString(),
      score: currentScore,
      totalPoints,
      answers: [...answers]
    };
    
    // Update attempts
    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);
    setCurrentAttempt(newAttempt);
    
    // Save to localStorage
    localStorage.setItem(
      `quiz_attempts_${qid}_${user?.id}`, 
      JSON.stringify(updatedAttempts)
    );
    
    // Show results
    setShowResults(true);
  };
  
  // Start a new attempt
  const handleStartNewAttempt = () => {
    setAnswers([]);
    setCurrentScore(0);
    setCurrentAttempt(null);
    setShowResults(false);
  };
  
  // Return to editing
  const handleEditQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
  };
  
  if (!hasEditorPermissions) {
    return (
      <Alert variant="danger" className="m-4">
        <h4>Access Denied</h4>
        <p>You don't have permission to preview this quiz.</p>
        <Button
          variant="primary"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
        >
          Return to Quiz Details
        </Button>
      </Alert>
    );
  }
  
  if (showResults) {
    return (
      <Container className="quiz-preview-container">
        <div className="preview-header bg-info text-white p-2 mb-3 text-center">
          <h5 className="mb-0">Preview Mode - Your answers are stored for your next preview</h5>
        </div>
        
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h4>Quiz Results for Attempt #{currentAttempt ? attempts.findIndex(a => a.attemptId === currentAttempt.attemptId) + 1 : attempts.length}</h4>
          </Card.Header>
          <Card.Body>
            <h5>Score: {currentScore} out of {totalPoints} points ({Math.round((currentScore / totalPoints) * 100)}%)</h5>
            
            <h6 className="mt-4 mb-3">Question Results:</h6>
            {quiz?.questions?.map((question: any, index: number) => {
              const answer = answers.find(a => a.questionId === question.id);
              return (
                <Card key={question.id} className="mb-3">
                  <Card.Header className={`d-flex justify-content-between ${answer?.isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                    <span>Question {index + 1}: {question.title || question.questionText.substring(0, 30)}</span>
                    <Badge bg={answer?.isCorrect ? 'light' : 'light'} text={answer?.isCorrect ? 'dark' : 'dark'}>
                      {answer?.isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <div dangerouslySetInnerHTML={{ __html: question.questionText }}></div>
                    
                    <div className="mt-3">
                      <strong>Your Answer:</strong>
                      {question.questionType === 'multiple_choice' && (
                        <div>
                          {question.choices.find((c: any) => c.id === answer?.answer)?.text || 'Not answered'}
                        </div>
                      )}
                      {question.questionType === 'true_false' && (
                        <div>
                          {answer?.answer ? 'True' : 'False'}
                        </div>
                      )}
                      {question.questionType === 'fill_blank' && (
                        <div>
                          {Array.isArray(answer?.answer) 
                            ? answer.answer.join(', ') 
                            : String(answer?.answer) || 'Not answered'}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <strong>Correct Answer:</strong>
                      {question.questionType === 'multiple_choice' && (
                        <div>
                          {question.choices.find((c: any) => c.isCorrect)?.text || 'No correct answer defined'}
                        </div>
                      )}
                      {question.questionType === 'true_false' && (
                        <div>
                          {question.correctAnswer ? 'True' : 'False'}
                        </div>
                      )}
                      {question.questionType === 'fill_blank' && (
                        <div>
                          {question.blankAnswers.map((a: any) => a.text).join(' or ') || 'No correct answer defined'}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </Card.Body>
        </Card>
        
        <div className="preview-footer mt-3 d-flex justify-content-center">
          <Button
            variant="success"
            onClick={handleStartNewAttempt}
            className="me-3"
          >
            Try Again
          </Button>
          <Button
            variant="secondary"
            onClick={handleEditQuiz}
            className="me-3"
          >
            Edit Quiz
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
          >
            Back to Details
          </Button>
        </div>
        
        {attempts.length > 1 && (
          <Card className="mt-4">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">Previous Attempts</h5>
            </Card.Header>
            <Card.Body>
              <Row className="fw-bold mb-2">
                <Col xs={3}>Attempt</Col>
                <Col xs={3}>Date</Col>
                <Col xs={3}>Score</Col>
                <Col xs={3}>Percentage</Col>
              </Row>
              {attempts.slice().reverse().map((attempt, index) => (
                <Row 
                  key={attempt.attemptId} 
                  className={`py-2 border-bottom ${currentAttempt && attempt.attemptId === currentAttempt.attemptId ? 'bg-light' : ''}`}
                >
                  <Col xs={3}>#{attempts.length - index}</Col>
                  <Col xs={3}>{new Date(attempt.timestamp).toLocaleString()}</Col>
                  <Col xs={3}>{attempt.score} / {attempt.totalPoints}</Col>
                  <Col xs={3}>{Math.round((attempt.score / attempt.totalPoints) * 100)}%</Col>
                </Row>
              ))}
            </Card.Body>
          </Card>
        )}
      </Container>
    );
  }
  
  return (
    <Container className="quiz-preview-container">
      <div className="preview-header bg-info text-white p-2 mb-3 text-center">
        <h5 className="mb-0">Preview Mode - Your answers will be stored for your next preview</h5>
      </div>
      
      {/* Modified QuizTake component with onAnswerChange prop */}
      <QuizTake 
        previewMode={true}
        savedAnswers={answers}
        onAnswerChange={handleAnswerChange}
      />
      
      <div className="preview-footer mt-3 d-flex justify-content-center">
        <Button
          variant="primary"
          onClick={handleSubmitQuiz}
          className="me-3"
        >
          Submit Quiz
        </Button>
        <Button
          variant="secondary"
          onClick={handleEditQuiz}
          className="me-3"
        >
          Edit Quiz
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
        >
          Back to Details
        </Button>
      </div>
      
      {attempts.length > 0 && (
        <Alert variant="info" className="mt-4">
          <strong>Previous Attempts:</strong> You have {attempts.length} previous {attempts.length === 1 ? 'attempt' : 'attempts'} at this quiz.
          Your last score was {attempts[attempts.length - 1].score} out of {attempts[attempts.length - 1].totalPoints} points 
          ({Math.round((attempts[attempts.length - 1].score / attempts[attempts.length - 1].totalPoints) * 100)}%).
        </Alert>
      )}
    </Container>
  );
};

export default QuizPreview;
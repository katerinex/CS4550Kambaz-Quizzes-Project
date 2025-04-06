//src/Kambaz/Courses/Quizzes/QuizTake.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spinner, Alert, Form, Modal, ProgressBar } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { findQuizById, updateQuiz, Quiz } from "./client";
import { fetchQuizStart, fetchQuizSuccess, fetchQuizFailure } from "./reducer";
import "./QuizTake.css"; // You may need to create this CSS file

// Define roles that have editing permissions
const EDITOR_ROLES = ['FACULTY', 'ADMIN', 'TA'];


interface QuizQuestion {
  _id: string;
  title: string;
  questionText?: string;
  questionType: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  choices?: string[];
  correctAnswer: string | boolean;
  possibleAnswers?: string[];
  points: number;
}

interface UserAttempt {
  attempts: number;
  score: number;
  lastSubmission?: string;
  answers?: Answer[];
}

interface UserAttempts {
  [userId: string]: UserAttempt;
}

// Extend the Quiz interface to include userAttempts
interface QuizWithAttempts extends Quiz {
  questions: QuizQuestion[];
  userAttempts?: UserAttempts;
}

interface Answer {
  questionId: string;
  answer: string | boolean | null;
  isCorrect?: boolean;
}

const QuizTake: React.FC = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get quiz, loading, and error state from Redux
  const { currentQuiz: quiz, loading, error } = useSelector((state: any) => state.quizReducer);
  
  // Get user from Redux state
  const { user } = useSelector((state: any) => state.accountReducer);
  
  // State for the current quiz session
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessCodeError, setAccessCodeError] = useState('');
  
  // Check if user has editor permissions - for preview mode
  const hasEditorPermissions = user && EDITOR_ROLES.includes(user.role);
  const isStudent = user && user.role === 'STUDENT';
  const isPreviewMode = hasEditorPermissions;

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid) return;
      
      dispatch(fetchQuizStart());
      try {
        const fetchedQuiz = await findQuizById(qid);
        dispatch(fetchQuizSuccess(fetchedQuiz));
        
        // Initialize answers array
        if (fetchedQuiz.questions) {
          setAnswers(fetchedQuiz.questions.map((q: QuizQuestion) => ({
            questionId: q._id,
            answer: null
          })));
        }
        
        // Set timer if specified
        if (fetchedQuiz.timeLimit && fetchedQuiz.timeLimit > 0) {
          setTimeRemaining(fetchedQuiz.timeLimit * 60); // Convert to seconds
        }
        
        // Check if access code is required
        if (fetchedQuiz.accessCode && !isPreviewMode) {
          setShowAccessCodeModal(true);
        }
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load quiz";
        dispatch(fetchQuizFailure(errorMessage));
        console.error("Error fetching quiz:", err);
      }
    };

    fetchQuiz();
    
    // Cleanup function
    return () => {
      // Clear any timers if necessary
      if (timeRemaining !== null) {
        // Clean up timer code if needed
      }
    };
  }, [qid, dispatch, isPreviewMode]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (quizStarted && timeRemaining !== null && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            // Time's up - auto submit
            if (timer) clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizStarted, timeRemaining]);

  // Check if student can take the quiz based on availability and attempts
  const canTakeQuiz = (): boolean => {
    if (!quiz || (!isStudent && !isPreviewMode)) return false;
    
    // In preview mode, always allow
    if (isPreviewMode) return true;
    
    // Check if published
    if (!quiz.published) return false;
    
    // Check availability
    const now = new Date();
    const availableDate = new Date(quiz.availableDate || '');
    const untilDate = new Date(quiz.untilDate || '');
    
    if (now < availableDate || now > untilDate) return false;
    
    // Check attempts if multiple attempts are limited
    if (quiz.multipleAttempts && quiz.attemptsAllowed && quiz.attemptsAllowed > 0) {
      const typedQuiz = quiz as QuizWithAttempts;
      const userAttempts = typedQuiz.userAttempts?.[user._id]?.attempts || 0;
      if (userAttempts >= (quiz.attemptsAllowed || 1)) return false;
    }
    
    return true;
  };

  // Handle starting the quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Handle access code submission
  const handleAccessCodeSubmit = () => {
    if (quiz && quiz.accessCode === accessCode) {
      setShowAccessCodeModal(false);
    } else {
      setAccessCodeError('Invalid access code. Please try again.');
    }
  };

  // Handle answer selection
  const handleAnswerChange = (questionId: string, answer: string | boolean) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId ? { ...a, answer } : a
      )
    );
  };

  // Navigate to next/previous question
  const handleNavigateQuestion = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit quiz answers
  const handleSubmitQuiz = async () => {
    if (!quiz || !user) return;
    
    const typedQuiz = quiz as QuizWithAttempts;
    
    // Calculate score
    let correctAnswers = 0;
    const scoredAnswers = answers.map(answer => {
      const question = typedQuiz.questions.find(q => q._id === answer.questionId);
      let isCorrect = false;
      
      if (question) {
        switch (question.questionType) {
          case 'multiple-choice':
            isCorrect = question.correctAnswer === answer.answer;
            break;
          case 'true-false':
            isCorrect = question.correctAnswer === answer.answer;
            break;
          case 'fill-in-blank':
            // For fill in blank, we might need to check against multiple correct answers
            isCorrect = (question.possibleAnswers || []).includes(answer.answer as string);
            break;
          default:
            isCorrect = false;
        }
        
        if (isCorrect) correctAnswers += question.points || 0;
      }
      
      return { ...answer, isCorrect };
    });
    
    const totalScore = correctAnswers;
    setQuizScore(totalScore);
    setAnswers(scoredAnswers);
    setQuizSubmitted(true);
    
    // Save results if not in preview mode
    if (!isPreviewMode) {
      try {
        // Create userAttempts structure if it doesn't exist
        const userAttempts = typedQuiz.userAttempts || {};
        const currentUserAttempts = userAttempts[user._id] || { attempts: 0, score: 0 };
        
        // Update attempts and score
        currentUserAttempts.attempts = (currentUserAttempts.attempts || 0) + 1;
        currentUserAttempts.score = totalScore;
        currentUserAttempts.lastSubmission = new Date().toISOString();
        currentUserAttempts.answers = scoredAnswers;
        
        // Create a proper update object that conforms to the Quiz type
        const quizUpdate: Partial<Quiz> = {
          // Include only properties that exist in the Quiz interface
          // For the userAttempts, we'll add it to a custom property
          _id: typedQuiz._id,
          custom: {
            userAttempts: {
              ...userAttempts,
              [user._id]: currentUserAttempts
            }
          }
        };
        
        // Update quiz with new attempts data
        await updateQuiz(qid as string, quizUpdate);
      } catch (error) {
        console.error("Error saving quiz results:", error);
      }
    }
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading quiz...</span>
        </Spinner>
      </div>
    );
  }

  // Render error state
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

  // Type the quiz properly
  const typedQuiz = quiz as QuizWithAttempts;

  // Render access code modal
  if (showAccessCodeModal) {
    return (
      <Modal show={true} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>Access Code Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This quiz requires an access code to begin.</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Enter Access Code:</Form.Label>
              <Form.Control 
                type="text" 
                value={accessCode} 
                onChange={(e) => setAccessCode(e.target.value)}
                isInvalid={!!accessCodeError}
              />
              <Form.Control.Feedback type="invalid">
                {accessCodeError}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAccessCodeSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // Check if user can take quiz
  if (!canTakeQuiz()) {
    return (
      <Alert variant="warning" className="m-4">
        <h4>Unable to Take Quiz</h4>
        {!quiz.published ? (
          <p>This quiz is not currently published.</p>
        ) : new Date() < new Date(quiz.availableDate || '') ? (
          <p>This quiz is not available until {new Date(quiz.availableDate || '').toLocaleString()}.</p>
        ) : new Date() > new Date(quiz.untilDate || '') ? (
          <p>This quiz closed on {new Date(quiz.untilDate || '').toLocaleString()}.</p>
        ) : (
          <p>You have reached the maximum number of attempts for this quiz.</p>
        )}
        <Button 
          variant="primary" 
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
        >
          View Quiz Details
        </Button>
      </Alert>
    );
  }

  // Render quiz intro screen
  if (!quizStarted) {
    return (
      <div className="quiz-intro-container p-4">
        <Card>
          <Card.Header as="h4">{quiz.title}</Card.Header>
          <Card.Body>
            <div className="quiz-instructions mb-4">
              <h5>Quiz Instructions</h5>
              <p>{quiz.description || "Answer all questions to the best of your ability."}</p>
              
              <div className="quiz-meta-info">
                <p><strong>Time Limit:</strong> {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No time limit"}</p>
                <p><strong>Questions:</strong> {typedQuiz.questions.length}</p>
                <p><strong>Points:</strong> {quiz.points}</p>
                <p><strong>Question Display:</strong> {quiz.oneQuestionAtATime ? "One question at a time" : "All questions on one page"}</p>
                {quiz.multipleAttempts && (
                  <p><strong>Attempts Allowed:</strong> {quiz.attemptsAllowed}</p>
                )}
                {isPreviewMode && (
                  <Alert variant="info">
                    <strong>Preview Mode:</strong> You are previewing this quiz as an instructor. Your answers will not be recorded.
                  </Alert>
                )}
              </div>
            </div>
            
            <div className="d-flex justify-content-between">
              <Button 
                variant="secondary" 
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleStartQuiz}
              >
                Begin Quiz
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Render quiz results after submission
  if (quizSubmitted) {
    return (
      <div className="quiz-results-container p-4">
        <Card>
          <Card.Header as="h4">Quiz Results</Card.Header>
          <Card.Body>
            <div className="text-center mb-4">
              <h2>Your Score: {quizScore} / {quiz.points}</h2>
              <p className="text-muted">
                {((quizScore as number / quiz.points) * 100).toFixed(1)}%
              </p>
            </div>
            
            {quiz.showCorrectAnswers && (
              <div className="question-results">
                <h5>Question Results</h5>
                {typedQuiz.questions.map((question: QuizQuestion, index: number) => {
                  const answer = answers.find(a => a.questionId === question._id);
                  return (
                    <Card 
                      key={question._id} 
                      className={`mb-3 ${answer?.isCorrect ? 'border-success' : 'border-danger'}`}
                    >
                      <Card.Header className={answer?.isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}>
                        Question {index + 1}: {answer?.isCorrect ? 'Correct' : 'Incorrect'}
                      </Card.Header>
                      <Card.Body>
                        <p><strong>{question.title}</strong></p>
                        <div dangerouslySetInnerHTML={{ __html: question.questionText || '' }} />
                        
                        <div className="mt-3">
                          <p><strong>Your Answer:</strong> {answer?.answer?.toString() || 'Unanswered'}</p>
                          <p><strong>Correct Answer:</strong> {question.correctAnswer.toString()}</p>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            )}
            
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="primary" 
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
              >
                Return to Quiz Details
              </Button>
              {!isPreviewMode && quiz.multipleAttempts && 
                typedQuiz.userAttempts && 
                user && 
                typedQuiz.userAttempts[user._id] && 
                (typedQuiz.userAttempts[user._id].attempts || 0) < (quiz.attemptsAllowed || 1) && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    setQuizStarted(false);
                    setQuizSubmitted(false);
                    setCurrentQuestionIndex(0);
                    setQuizScore(null);
                    setAnswers(typedQuiz.questions.map((q: QuizQuestion) => ({
                      questionId: q._id,
                      answer: null
                    })));
                  }}
                >
                  Attempt Again
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Get current question
  const currentQuestion = typedQuiz.questions[currentQuestionIndex];

  // Render the active quiz
  return (
    <div className="quiz-active-container p-4">
      {/* Timer display */}
      {timeRemaining !== null && (
        <div className="quiz-timer mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span>Time Remaining:</span>
            <span className={timeRemaining < 60 ? 'text-danger' : ''}>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      )}
      
      {/* Progress display */}
      {quiz.oneQuestionAtATime && (
        <div className="quiz-progress mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Question {currentQuestionIndex + 1} of {typedQuiz.questions.length}</span>
            <span>Progress: {Math.round(((currentQuestionIndex + 1) / typedQuiz.questions.length) * 100)}%</span>
          </div>
          <ProgressBar 
            now={Math.round(((currentQuestionIndex + 1) / typedQuiz.questions.length) * 100)} 
            variant="primary" 
          />
        </div>
      )}
      
      <Card className="quiz-question-card">
        <Card.Header as="h5">
          Question {currentQuestionIndex + 1}: {currentQuestion.title}
        </Card.Header>
        <Card.Body>
          {/* Question text */}
          <div 
            className="question-text mb-4"
            dangerouslySetInnerHTML={{ __html: currentQuestion.questionText || '' }}
          />
          
          {/* Question answers based on type */}
          <div className="question-answers">
            {currentQuestion.questionType === 'multiple-choice' && currentQuestion.choices && (
              <Form>
                {currentQuestion.choices.map((choice: string, i: number) => (
                  <Form.Check
                    key={i}
                    type="radio"
                    id={`choice-${i}`}
                    label={choice}
                    name={`question-${currentQuestion._id}`}
                    checked={answers.find(a => a.questionId === currentQuestion._id)?.answer === choice}
                    onChange={() => handleAnswerChange(currentQuestion._id, choice)}
                    className="mb-2"
                  />
                ))}
              </Form>
            )}
            
            {currentQuestion.questionType === 'true-false' && (
              <Form>
                <Form.Check
                  type="radio"
                  id="true-option"
                  label="True"
                  name={`question-${currentQuestion._id}`}
                  checked={answers.find(a => a.questionId === currentQuestion._id)?.answer === true}
                  onChange={() => handleAnswerChange(currentQuestion._id, true)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="false-option"
                  label="False"
                  name={`question-${currentQuestion._id}`}
                  checked={answers.find(a => a.questionId === currentQuestion._id)?.answer === false}
                  onChange={() => handleAnswerChange(currentQuestion._id, false)}
                  className="mb-2"
                />
              </Form>
            )}
            
            {currentQuestion.questionType === 'fill-in-blank' && (
              <Form>
                <Form.Group>
                  <Form.Label>Your Answer:</Form.Label>
                  <Form.Control
                    type="text"
                    value={(answers.find(a => a.questionId === currentQuestion._id)?.answer as string) || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                  />
                </Form.Group>
              </Form>
            )}
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-between">
            {quiz.oneQuestionAtATime ? (
              <>
                <Button
                  variant="outline-secondary"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => handleNavigateQuestion('prev')}
                >
                  Previous
                </Button>
                
                {currentQuestionIndex < typedQuiz.questions.length - 1 ? (
                  <Button
                    variant="primary"
                    onClick={() => handleNavigateQuestion('next')}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={handleSubmitQuiz}
                  >
                    Submit Quiz
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="success"
                className="ms-auto"
                onClick={handleSubmitQuiz}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default QuizTake;
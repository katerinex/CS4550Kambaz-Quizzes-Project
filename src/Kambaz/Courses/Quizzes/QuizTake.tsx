//src/Kambaz/Courses/Quizzes/QuizTake.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Form,
  Button,
  ProgressBar,
  Badge,
  Container,
  Alert
} from "react-bootstrap";
import { findQuizById, createQuizAttempt, QuizAnswer, QuizAttempt, findQuizAttemptsByQuizAndUser } from "./client";
import { fetchQuizSuccess, createQuizAttemptSuccess } from "./reducer";

interface QuizTakeProps {
  previewMode?: boolean;
  savedAnswers?: QuizAnswer[];
  onAnswerChange?: (questionId: string, answer: any, isCorrect: boolean) => void;
}

const QuizTake: React.FC<QuizTakeProps> = ({
  previewMode = false,
  savedAnswers = [],
  onAnswerChange = () => { }
}) => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get quiz from Redux state
  const { quizzes, currentQuiz } = useSelector((state: any) => state.quizReducer);
  const quiz = quizzes.find((q: any) => q._id === qid) || currentQuiz;

  // Get user from Redux state
  const { user } = useSelector((state: any) => state.accountReducer);

  // State for quiz progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [existingAttempts, setExistingAttempts] = useState<QuizAttempt[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    // Fetch quiz if not in state
    const fetchQuiz = async () => {
      if (!quiz && qid) {
        try {
          const fetchedQuiz = await findQuizById(qid);
          dispatch(fetchQuizSuccess(fetchedQuiz));
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      }
    };

    fetchQuiz();
  }, [qid, quiz, dispatch]);

  // Initialize from saved answers if in preview mode
  useEffect(() => {
    if (previewMode && savedAnswers && savedAnswers.length > 0) {
      const initialAnswers: { [key: string]: any } = {};
      savedAnswers.forEach(answer => {
        initialAnswers[answer.questionId] = answer.answer;
      });
      setAnswers(initialAnswers);
    }
  }, [previewMode, savedAnswers]);

  // Set up timer
  useEffect(() => {
    if (quiz && quizStarted && !quizCompleted && timerActive) {
      const timeLimit = quiz.timeLimit || 20; // Default 20 minutes
      setTimeRemaining(timeLimit * 60); // Convert to seconds

      // Track time spent
      const startTime = Date.now();

      const timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prevTime - 1;
        });

        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, quizStarted, quizCompleted, timerActive]);

  useEffect(() => {
    const fetchAttempts = async () => {
      if (!previewMode && quiz && user && qid) {
        try {
          const attempts = await findQuizAttemptsByQuizAndUser(qid, user._id);
          setExistingAttempts(attempts);
        } catch (error) {
          console.error("Error fetching quiz attempts:", error);
        }
      }
    };
  
    fetchAttempts();
  }, [previewMode, quiz, user, qid]);

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex] || null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimerActive(true);
  };

  const handleAnswerQuestion = (questionId: string, answer: any) => {
    // Check if the answer is correct
    let isCorrect = false;

    if (currentQuestion.questionType === 'multiple_choice') {
      const correctChoice = currentQuestion.choices.find((c: any) => c.isCorrect);
      isCorrect = answer === correctChoice?.id;
    } else if (currentQuestion.questionType === 'true_false') {
      isCorrect = answer === currentQuestion.correctAnswer;
    } else if (currentQuestion.questionType === 'fill_blank') {
      // Check if answer matches any of the possible answers (case insensitive)
      const possibleAnswers = currentQuestion.blankAnswers.map((a: any) =>
        a.text.toLowerCase().trim()
      );
      isCorrect = possibleAnswers.includes(String(answer).toLowerCase().trim());
    }

    // Update local state
    setAnswers({
      ...answers,
      [questionId]: answer
    });

    // If in preview mode, notify parent of answer change
    if (previewMode && onAnswerChange) {
      onAnswerChange(questionId, answer, isCorrect);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setQuizCompleted(true);
    setTimerActive(false);
    console.log("IN HANDLE SUBMIT QUIZ");
    // If not in preview mode, submit to server
    if (!previewMode && user && qid) {
      // Convert answers object to array of QuizAnswer objects
      const answerArray: QuizAnswer[] = Object.keys(answers).map(questionId => {
        const answer = answers[questionId];
        const question = questions.find((q: any) => q.id === questionId);

        // Determine if the answer is correct
        let isCorrect = false;
        if (question) {
          if (question.questionType === 'multiple_choice') {
            const correctChoice = question.choices.find((c: any) => c.isCorrect);
            isCorrect = answer === correctChoice?.id;
          } else if (question.questionType === 'true_false') {
            isCorrect = answer === question.correctAnswer;
          } else if (question.questionType === 'fill_blank') {
            const possibleAnswers = question.blankAnswers.map((a: any) =>
              a.text.toLowerCase().trim()
            );
            isCorrect = possibleAnswers.includes(String(answer).toLowerCase().trim());
          }
        }

        return {
          questionId,
          answer,
          isCorrect
        };
      });

      // if (!previewMode && user && qid) {
      //   const existingAttempts = await findQuizAttemptsByQuizAndUser(qid, user._id);
      //   const maxAttempts = quiz.multipleAttempts ? quiz.attemptsAllowed : 1;
      //   if (existingAttempts.length >= maxAttempts) {
      //     alert("You have reached the maximum number of allowed attempts for this quiz.");
      //     return;
      //   }
      // }

      try {
        console.log("CREATING ATTEMPT");
        const newAttempt = await createQuizAttempt({
          quizId: qid,
          userId: user._id,
          answers: answerArray,
          timeSpent: timeSpent,
          timestamp: "",
          score: 0,
          totalPoints: 0
        });
        dispatch(createQuizAttemptSuccess(newAttempt));
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}?refreshAttempts=true`);

      } catch (err) {
        console.error("Failed to create quiz attempt:", err);
      }

    }
  };

  if (!quizStarted) {
    const maxAttempts = quiz.multipleAttempts ? quiz.attemptsAllowed : 1;
    const attemptsExceeded = existingAttempts.length >= maxAttempts;

    return (
      <Container className="mt-4" >
        <Card>
          <Card.Header className="bg-primary text-white">
            <h4>{quiz.title}</h4>
          </Card.Header>
          <Card.Body>
            {user && user.role === 'STUDENT' && quiz.webcamRequired && (
              <Alert variant="warning">
                <strong>Note:</strong> This quiz requires webcam monitoring during the examination.
              </Alert>
            )}
            <div className="quiz-instructions mb-4">
              <h5>Quiz Instructions</h5>
              <div dangerouslySetInnerHTML={{ __html: quiz.description || 'No instructions provided.' }}></div>
            </div>

            <div className="quiz-details mb-4">
              <p><strong>Time Limit:</strong> {quiz.timeLimit || 20} minutes</p>
              <p><strong>Points:</strong> {quiz.points || 0}</p>
              <p><strong>Questions:</strong> {questions.length}</p>
              {quiz.multipleAttempts && <p><strong>Attempts Allowed:</strong> {quiz.attemptsAllowed || 1}</p>}
              {quiz.accessCode && <p><strong>Access Code Required:</strong> Yes</p>}
            </div>

            {attemptsExceeded ? (
              <Alert variant="danger" className="mt-3">
                You have reached the maximum number of allowed attempts for this quiz.
              </Alert>
            ) : (
              <div className="text-center">
                <Button size="lg" variant="success" onClick={handleStartQuiz}>
                  Start Quiz
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (quizCompleted && !previewMode) {
    return (
      <Container className="mt-4">
        <Card>
          <Card.Header className="bg-success text-white">
            <h4>Quiz Completed</h4>
          </Card.Header>
          <Card.Body className="text-center">
            <h5 className="mb-4">Your quiz has been submitted successfully!</h5>
            <p>Your instructor will grade your quiz and provide feedback.</p>

            <Button
              variant="primary"
              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
              className="mt-3"
            >
              Return to Quiz Details
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!currentQuestion) {
    return <div>No questions found for this quiz.</div>;
  }

  return (
    <Container>
      <Card className="quiz-question-card mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Question {currentQuestionIndex + 1} of {questions.length}</h5>
              <Badge bg="primary">{currentQuestion.points || 1} {currentQuestion.points === 1 ? 'point' : 'points'}</Badge>
            </div>
            {timerActive && (
              <div className="quiz-timer">
                <Badge bg={timeRemaining < 60 ? 'danger' : 'warning'} className="p-2">
                  Time: {formatTime(timeRemaining)}
                </Badge>
              </div>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <div className="question-text mb-4">
            {currentQuestion.title && (
              <h5 className="question-title mb-3">{currentQuestion.title}</h5>
            )}
            <div dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}></div>
          </div>

          <Form>
            {currentQuestion.questionType === 'multiple_choice' && (
              <div className="multiple-choice-container">
                {currentQuestion.choices.map((choice: any) => (
                  <Form.Check
                    key={choice.id}
                    type="radio"
                    id={`choice-${choice.id}`}
                    name={`question-${currentQuestion.id}`}
                    label={choice.text}
                    checked={answers[currentQuestion.id] === choice.id}
                    onChange={() => handleAnswerQuestion(currentQuestion.id, choice.id)}
                    className="mb-3"
                  />
                ))}
              </div>
            )}

            {currentQuestion.questionType === 'true_false' && (
              <div className="true-false-container">
                <Form.Check
                  type="radio"
                  id={`true-option-${currentQuestion.id}`}
                  name={`question-${currentQuestion.id}`}
                  label="True"
                  checked={answers[currentQuestion.id] === true}
                  onChange={() => handleAnswerQuestion(currentQuestion.id, true)}
                  className="mb-3"
                />
                <Form.Check
                  type="radio"
                  id={`false-option-${currentQuestion.id}`}
                  name={`question-${currentQuestion.id}`}
                  label="False"
                  checked={answers[currentQuestion.id] === false}
                  onChange={() => handleAnswerQuestion(currentQuestion.id, false)}
                />
              </div>
            )}

            {currentQuestion.questionType === 'fill_blank' && (
              <div className="fill-blank-container">
                <Form.Group>
                  <Form.Label>Your Answer:</Form.Label>
                  <Form.Control
                    type="text"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerQuestion(currentQuestion.id, e.target.value)}
                    placeholder="Type your answer here"
                  />
                </Form.Group>
              </div>
            )}
          </Form>

          <div className="question-navigation d-flex justify-content-between mt-4">
            <Button
              variant="outline-secondary"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleNextQuestion}
              >
                Next
              </Button>
            ) : (
              previewMode ? (
                <Button variant="success" onClick={handleSubmitQuiz}>Submit Quiz</Button>
              ) : (
                <Button
                  variant="success"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length < questions.length}
                >
                  Submit Quiz
                </Button>
              )
            )}
          </div>
        </Card.Body>
        <Card.Footer>
          <ProgressBar
            now={(currentQuestionIndex + 1) / questions.length * 100}
            variant="info"
            className="mb-1"
          />
          <div className="question-dots d-flex justify-content-center mt-2">
            {questions.map((q: any, index: number) => (
              <Button
                key={index}
                variant={answers[q.id] ? "primary" : "outline-secondary"}
                size="sm"
                className="question-dot mx-1"
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </Card.Footer>
      </Card>

      {(quiz.oneQuestionAtATime === false || previewMode) && (
        <div className="quiz-submit-section text-center mb-4">
          <Button
            variant="success"
            size="lg"
            onClick={handleSubmitQuiz}
            disabled={!previewMode && Object.keys(answers).length < questions.length}
          >
            Submit Quiz
          </Button>
        </div>
      )}
    </Container>
  );
};

export default QuizTake;
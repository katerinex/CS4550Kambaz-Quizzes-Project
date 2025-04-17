import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { findQuizAttemptsByQuizAndUser, findQuizById } from "./client";

const LastAttemptDetails: React.FC = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string; attemptId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.accountReducer); // Get the current user from Redux
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastAttempt = async () => {
      try {
        setLoading(true);

        const attempts = await findQuizAttemptsByQuizAndUser(qid!, user._id);

        if (attempts.length > 0) {
          const lastAttempt = attempts[attempts.length - 1];

          const quiz = await findQuizById(qid!);

          const enrichedAnswers = lastAttempt.answers.map((answer: any) => {
            const question = quiz.questions.find((q: any) => q.id === answer.questionId); // Match `id` instead of `_id`
            let userAnswerText = answer.answer;

            if (question?.questionType === "multiple_choice") {
              const selectedChoice = question.choices.find((choice: any) => choice.id === answer.answer);
              userAnswerText = selectedChoice?.text || "Answer not found";
            }
            if (question?.questionType === "true_false") {
              userAnswerText = answer.answer === true ? "True" : "False";
            }

            return {
              question: question?.questionText || "Question not found",
              userAnswer: userAnswerText,
              isCorrect: answer.isCorrect,
            };
          });

          setAttempt({ ...lastAttempt, answers: enrichedAnswers });
        } else {
          setError("No attempts found.");
        }
      } catch (err) {
        console.error("Error fetching attempts or quiz:", err);
        setError("Failed to fetch attempts or quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchLastAttempt();
  }, [qid, user._id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="last-attempt-details-container">
      <h1>Last Attempt Details</h1>
      <Card className="mb-4">
        <Card.Header as="h5">Your Answers</Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {attempt.answers.map((answer: any, index: number) => (
              <ListGroup.Item key={index}>
                <strong>Question:</strong> {answer.question}
                <br />
                <strong>Your Answer:</strong>{" "}
                <span
                  style={{
                    color: answer.isCorrect ? "green" : "red", // Highlight only the user's answer
                  }}
                >
                  {Array.isArray(answer.userAnswer) ? answer.userAnswer.join(", ") : answer.userAnswer}
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Header as="h5">Score</Card.Header>
        <Card.Body>
          <p>
            <strong>Your Score:</strong> {attempt.score} / {attempt.totalPoints}
          </p>
        </Card.Body>
      </Card>
      <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}>
        Back to Quiz Page
      </Button>
    </div>
  );
};

export default LastAttemptDetails;
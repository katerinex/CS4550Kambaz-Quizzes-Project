// src/Kambaz/Courses/Quizzes/Details.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import quizzes from '../../Database/quizzes'; 
import { Quiz } from '../../../types/types';
export default function QuizDetails() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const quiz = quizzes.find((q: Quiz) => q._id === qid); // Type 'q' explicitly

    if (!quiz) {
        return <div>Quiz not found</div>;
    }
  return (
    <Card className="p-4">
      <Card.Title className="d-flex justify-content-between align-items-center mb-4">
        <div>{quiz.title}</div>
        <div>
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
        </div>
      </Card.Title>

      <Row>
        <Col md={6}>
          <h5>Basic Settings</h5>
          <dl className="row">
            <dt className="col-sm-4">Quiz Type</dt>
            <dd className="col-sm-8">{quiz.quizType.replace('_', ' ')}</dd>

            <dt className="col-sm-4">Points</dt>
            <dd className="col-sm-8">{quiz.points}</dd>

            <dt className="col-sm-4">Assignment Group</dt>
            <dd className="col-sm-8">{quiz.assignmentGroup}</dd>

            <dt className="col-sm-4">Time Limit</dt>
            <dd className="col-sm-8">{quiz.timeLimit} minutes</dd>
          </dl>
        </Col>

        <Col md={6}>
          <h5>Advanced Settings</h5>
          <dl className="row">
            <dt className="col-sm-6">Shuffle Answers</dt>
            <dd className="col-sm-6">{quiz.shuffleAnswers ? 'Yes' : 'No'}</dd>

            <dt className="col-sm-6">Multiple Attempts</dt>
            <dd className="col-sm-6">
              {quiz.multipleAttempts ? `Yes (${quiz.attemptCount} attempts)` : 'No'}
            </dd>

            <dt className="col-sm-6">One Question at a Time</dt>
            <dd className="col-sm-6">{quiz.oneQuestionAtATime ? 'Yes' : 'No'}</dd>

            <dt className="col-sm-6">Webcam Required</dt>
            <dd className="col-sm-6">{quiz.webcamRequired ? 'Yes' : 'No'}</dd>
          </dl>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <h5>Availability</h5>
          <dl className="row">
            <dt className="col-sm-2">Due Date</dt>
            <dd className="col-sm-4">
              {new Date(quiz.dueDate).toLocaleString()}
            </dd>

            <dt className="col-sm-2">Available From</dt>
            <dd className="col-sm-4">
              {new Date(quiz.availableDate).toLocaleString()}
            </dd>

            <dt className="col-sm-2">Available Until</dt>
            <dd className="col-sm-4">
              {new Date(quiz.untilDate).toLocaleString()}
            </dd>
          </dl>
        </Col>
      </Row>
    </Card>
  );
}

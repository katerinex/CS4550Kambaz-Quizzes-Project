
//src/Kambaz/Courses/Quizzes/QuizPreview.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import QuizTake from "./QuizTake"; // Reuse the QuizTake component

// Define roles that have editing permissions
const EDITOR_ROLES = ['FACULTY', 'ADMIN', 'TA'];

const QuizPreview: React.FC = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  
  // Get user from Redux state
  const { user } = useSelector((state: any) => state.accountReducer);
  
  // Check if user has editor permissions
  const hasEditorPermissions = user && EDITOR_ROLES.includes(user.role);

  // Redirect non-editors
  useEffect(() => {
    if (!hasEditorPermissions) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
    }
  }, [hasEditorPermissions, navigate, cid, qid]);

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

  return (
    <div className="quiz-preview-container">
      <div className="preview-header bg-info text-white p-2 mb-3 text-center">
        <h5 className="mb-0">Preview Mode - Student answers aren't saved</h5>
      </div>
      
      {/* Reuse the QuizTake component */}
      <QuizTake />
      
      <div className="preview-footer mt-3 d-flex justify-content-center">
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)}
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
    </div>
  );
};

export default QuizPreview;
// src/Kambaz/Courses/Quizzes/QuestionList.tsx
import React from "react";
import { Card, Button, ListGroup, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaGripVertical } from "react-icons/fa";
import "./QuestionList.css";

interface QuestionListProps {
  questions: any[];
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  onAdd: () => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onEdit, onDelete, onAdd }) => {
  return (
    <div className="question-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Quiz Questions</h4>
        <Button variant="primary" onClick={onAdd}>
          + New Question
        </Button>
      </div>
      {questions.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No questions added yet</Card.Title>
            <Card.Text>
              Click the button above to add your first question to this quiz.
            </Card.Text>
            <Button variant="primary" onClick={onAdd}>
              Add New Question
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-2">
            <span>Total points: {questions.reduce((sum, q) => sum + (q.points || 0), 0)}</span>
          </div>
          <ListGroup className="question-list">
            {questions.map((question, index) => (
              <ListGroup.Item
                key={question.id || index}
                className="question-list-item"
              >
                <div className="d-flex align-items-center">
                  <div className="drag-handle me-2">
                    <FaGripVertical />
                  </div>
                  <div className="question-content">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="question-title">
                        <strong>
                          {index + 1}. {question.title || (question.questionText ? question.questionText.substring(0, 50) : "Untitled Question")}
                          {question.questionText && !question.title && question.questionText.length > 50 ? "..." : ""}
                        </strong>
                      </div>
                      <Badge bg="primary">{question.points} pts</Badge>
                    </div>
                    <div className="question-type text-muted">
                      {question.questionType === "multiple_choice" && "Multiple Choice"}
                      {question.questionType === "true_false" && "True/False"}
                      {question.questionType === "fill_blank" && "Fill in the Blank"}
                    </div>
                  </div>
                  <div className="question-actions ms-auto">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(question.id)}
                      className="me-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(question.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
    </div>
  );
};

export default QuestionList;
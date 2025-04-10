// src/Kambaz/Courses/Modules/LessonControlButtons.tsx

import React from "react";
import { Button } from "react-bootstrap";
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";

interface LessonControlButtonsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Component for displaying control buttons for a lesson (view, edit, delete)
 */
const LessonControlButtons: React.FC<LessonControlButtonsProps> = ({
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="d-flex me-2">
      <Button
        variant="link"
        className="p-1 text-primary"
        onClick={onView}
        title="View lesson"
      >
        <FaEye />
      </Button>
      <Button
        variant="link"
        className="p-1 text-secondary"
        onClick={onEdit}
        title="Edit lesson"
      >
        <FaPencilAlt />
      </Button>
      <Button
        variant="link"
        className="p-1 text-danger"
        onClick={onDelete}
        title="Delete lesson"
      >
        <FaTrash />
      </Button>
    </div>
  );
};

export default LessonControlButtons;
// src/Kambaz/Courses/Assignments/EditAssignmentDatesModal.tsx

import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { batchUpdateAssignments } from "./reducer";
import { shiftAssignmentDates } from "./dateUtils";
import * as client from "./client";

interface EditAssignmentDatesModalProps {
  show: boolean;
  onHide: () => void;
  assignments: any[];
}

const EditAssignmentDatesModal = ({ 
  show, 
  onHide, 
  assignments 
}: EditAssignmentDatesModalProps) => {
  const dispatch = useDispatch();
  
  // Form state
  const [shiftAmount, setShiftAmount] = useState<number>(0);
  const [shiftUnit, setShiftUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [rangeType, setRangeType] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [adjustDueDates, setAdjustDueDates] = useState<boolean>(true);
  const [adjustAvailableDates, setAdjustAvailableDates] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Handle date shift
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Set up options for date shifting
      const options = {
        shiftDueDates: adjustDueDates,
        shiftAvailabilityDates: adjustAvailableDates,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        onlyWithDueDates: rangeType === "withDueDates"
      };
      
      // Calculate updated assignments
      const updatedAssignments = shiftAssignmentDates(
        assignments,
        shiftAmount,
        shiftUnit,
        options
      );
      
      // Only process if there are assignments to update
      if (updatedAssignments.length > 0) {
        // Update in the database
        for (const assignment of updatedAssignments) {
          await client.updateAssignment(assignment);
        }
        
        // Update in Redux store
        dispatch(batchUpdateAssignments(updatedAssignments));
      }
      
      // Close modal and reset form
      onHide();
      
    } catch (error) {
      console.error("Error updating assignment dates:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form when modal is closed
  const handleClose = () => {
    setShiftAmount(0);
    setShiftUnit('days');
    setRangeType("all");
    setStartDate("");
    setEndDate("");
    setAdjustDueDates(true);
    setAdjustAvailableDates(true);
    onHide();
  };
  
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Assignment Dates</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Shift dates by</Form.Label>
            <div className="d-flex">
              <Form.Control 
                type="number" 
                placeholder="Days" 
                className="me-2"
                value={shiftAmount}
                onChange={(e) => setShiftAmount(parseInt(e.target.value) || 0)}
              />
              <Form.Select
                value={shiftUnit}
                onChange={(e) => setShiftUnit(e.target.value as 'days' | 'weeks' | 'months')}
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </Form.Select>
            </div>
            <Form.Text className="text-muted">
              Use negative numbers to move dates earlier
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Assignment Range</Form.Label>
            <Form.Select
              value={rangeType}
              onChange={(e) => setRangeType(e.target.value)}
            >
              <option value="all">All assignments</option>
              <option value="withDueDates">Assignments with due dates</option>
              <option value="dateRange">Assignments with due dates in range</option>
            </Form.Select>
          </Form.Group>
          
          {rangeType === "dateRange" && (
            <div className="date-range d-flex">
              <Form.Group className="mb-3 me-2 flex-grow-1">
                <Form.Label>Start Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>End Date</Form.Label>
                <Form.Control 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </div>
          )}
          
          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox"
              id="adjustDueDates"
              label="Adjust due dates"
              checked={adjustDueDates}
              onChange={(e) => setAdjustDueDates(e.target.checked)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox"
              id="adjustAvailableDates"
              label="Adjust available from/until dates"
              checked={adjustAvailableDates}
              onChange={(e) => setAdjustAvailableDates(e.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting || (rangeType === "dateRange" && (!startDate || !endDate))}
        >
          {isSubmitting ? "Updating..." : "Update Dates"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAssignmentDatesModal;
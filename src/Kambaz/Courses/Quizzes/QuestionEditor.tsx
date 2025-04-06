// src/Kambaz/Courses/Quizzes/QuestionEditor.tsx
import React, { useState } from "react";
import { Form, FormControl, Button, Card, Row, Col, InputGroup, Dropdown } from "react-bootstrap";
import { FaBold, FaItalic, FaUnderline, FaList, FaListOl, FaLink, FaImage, FaTrash } from "react-icons/fa";
import "./QuestionEditor.css";

interface QuestionEditorProps {
  question: any;
  onSave: (question: any) => void;
  onCancel: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState(question || {
    title: "",
    points: 1,
    questionType: "multiple_choice",
    questionText: "",
    choices: [
      { id: "1", text: "", isCorrect: true },
      { id: "2", text: "", isCorrect: false },
      { id: "3", text: "", isCorrect: false },
    ],
    correctAnswer: true, // For true/false questions
    blankAnswers: [{ id: "1", text: "" }], // For fill in the blank questions
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let newValue: any = value;
    
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      newValue = parseInt(value, 10) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleChoiceChange = (id: string, field: 'text' | 'isCorrect', value: string | boolean) => {
    const updatedChoices = formData.choices.map((choice: any) => {
      if (choice.id === id) {
        return { ...choice, [field]: value };
      }
      // For radio-style selection (multiple choice), deselect others when selecting a new correct answer
      if (field === 'isCorrect' && value === true) {
        return { ...choice, isCorrect: choice.id === id };
      }
      return choice;
    });
    
    setFormData({
      ...formData,
      choices: updatedChoices
    });
  };

  const handleBlankAnswerChange = (id: string, value: string) => {
    const updatedAnswers = formData.blankAnswers.map((answer: any) => {
      if (answer.id === id) {
        return { ...answer, text: value };
      }
      return answer;
    });
    
    setFormData({
      ...formData,
      blankAnswers: updatedAnswers
    });
  };

  const addChoice = () => {
    const newId = String(formData.choices.length + 1);
    setFormData({
      ...formData,
      choices: [
        ...formData.choices,
        { id: newId, text: "", isCorrect: false }
      ]
    });
  };

  const removeChoice = (id: string) => {
    if (formData.choices.length <= 2) return; // Keep at least 2 choices
    
    setFormData({
      ...formData,
      choices: formData.choices.filter((choice: any) => choice.id !== id)
    });
  };

  const addBlankAnswer = () => {
    const newId = String(formData.blankAnswers.length + 1);
    setFormData({
      ...formData,
      blankAnswers: [
        ...formData.blankAnswers,
        { id: newId, text: "" }
      ]
    });
  };

  const removeBlankAnswer = (id: string) => {
    if (formData.blankAnswers.length <= 1) return; // Keep at least 1 possible answer
    
    setFormData({
      ...formData,
      blankAnswers: formData.blankAnswers.filter((answer: any) => answer.id !== id)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="question-editor-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="light" id="question-type-dropdown">
            {formData.questionType === "multiple_choice" && "Multiple Choice"}
            {formData.questionType === "true_false" && "True/False"}
            {formData.questionType === "fill_blank" && "Fill in the Blank"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item 
              onClick={() => setFormData({...formData, questionType: "multiple_choice"})}
              active={formData.questionType === "multiple_choice"}
            >
              Multiple Choice
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={() => setFormData({...formData, questionType: "true_false"})}
              active={formData.questionType === "true_false"}
            >
              True/False
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={() => setFormData({...formData, questionType: "fill_blank"})}
              active={formData.questionType === "fill_blank"}
            >
              Fill in the Blank
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <InputGroup className="w-auto">
          <InputGroup.Text>pts:</InputGroup.Text>
          <FormControl
            type="number"
            name="points"
            min="0"
            value={formData.points}
            onChange={handleChange}
            style={{ width: '60px' }}
          />
        </InputGroup>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Question Title</Form.Label>
                <FormControl 
                  type="text" 
                  name="title"
                  value={formData.title} 
                  onChange={handleChange}
                  placeholder="Question title (optional)"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-4">
            <Form.Label>Question</Form.Label>
            <div className="editor-toolbar mb-2">
              <button type="button" className="toolbar-btn"><FaBold /></button>
              <button type="button" className="toolbar-btn"><FaItalic /></button>
              <button type="button" className="toolbar-btn"><FaUnderline /></button>
              <button type="button" className="toolbar-btn"><FaList /></button>
              <button type="button" className="toolbar-btn"><FaListOl /></button>
              <button type="button" className="toolbar-btn"><FaLink /></button>
              <button type="button" className="toolbar-btn"><FaImage /></button>
            </div>
            <FormControl
              as="textarea" 
              rows={3} 
              name="questionText"
              value={formData.questionText} 
              onChange={handleChange}
              placeholder={
                formData.questionType === "multiple_choice" 
                  ? "Enter your question and multiple answers, then select the one correct answer" 
                  : formData.questionType === "true_false"
                    ? "Enter your question text, then select if True or False is the correct answer"
                    : "Enter your question text, then define all possible correct answers for the blank"
              }
            />
          </Form.Group>
          
          <h5 className="mb-3">Answers:</h5>
          
          {formData.questionType === "multiple_choice" && (
            <div className="choices-container">
              {formData.choices.map((choice: any) => (
                <div key={choice.id} className="choice-item mb-3">
                  <InputGroup>
                    <InputGroup.Radio
                      checked={choice.isCorrect}
                      onChange={() => handleChoiceChange(choice.id, 'isCorrect', true)}
                      aria-label={`Select as correct answer`}
                    />
                    <FormControl
                      value={choice.text}
                      onChange={(e) => handleChoiceChange(choice.id, 'text', e.target.value)}
                      placeholder={`Answer option ${choice.id}`}
                    />
                    <Button 
                      variant="outline-danger"
                      onClick={() => removeChoice(choice.id)}
                      disabled={formData.choices.length <= 2}
                    >
                      <FaTrash />
                    </Button>
                  </InputGroup>
                </div>
              ))}
              <Button 
                variant="outline-secondary" 
                onClick={addChoice}
                className="add-choice-btn"
              >
                + Add Another Answer
              </Button>
            </div>
          )}
          
          {formData.questionType === "true_false" && (
            <Row className="true-false-container">
              <Col md={6}>
                <Form.Check
                  type="radio"
                  id="true-option"
                  name="correctAnswer"
                  label="True"
                  checked={formData.correctAnswer === true}
                  onChange={() => setFormData({...formData, correctAnswer: true})}
                  className="mb-2"
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="radio"
                  id="false-option"
                  name="correctAnswer"
                  label="False"
                  checked={formData.correctAnswer === false}
                  onChange={() => setFormData({...formData, correctAnswer: false})}
                />
              </Col>
            </Row>
          )}
          
          {formData.questionType === "fill_blank" && (
            <div className="blank-answers-container">
              {formData.blankAnswers.map((answer: any) => (
                <div key={answer.id} className="blank-answer-item mb-3">
                  <InputGroup>
                    <InputGroup.Text>Possible Answer:</InputGroup.Text>
                    <FormControl
                      value={answer.text}
                      onChange={(e) => handleBlankAnswerChange(answer.id, e.target.value)}
                      placeholder="Enter a possible correct answer"
                    />
                    <Button 
                      variant="outline-danger"
                      onClick={() => removeBlankAnswer(answer.id)}
                      disabled={formData.blankAnswers.length <= 1}
                    >
                      <FaTrash />
                    </Button>
                  </InputGroup>
                </div>
              ))}
              <Button 
                variant="outline-secondary" 
                onClick={addBlankAnswer}
                className="add-blank-btn"
              >
                + Add Another Answer
              </Button>
            </div>
          )}
          
          <div className="d-flex justify-content-end mt-4">
            <Button variant="outline-secondary" onClick={onCancel} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Question
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuestionEditor;
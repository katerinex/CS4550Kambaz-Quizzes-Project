// src/Kambaz/Courses/Quizzes/Editor/index.tsx
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizSettings } from './types';

export default function QuizEditor() {
  const navigate = useNavigate();
  const { cid } = useParams();
  
  const [settings, setSettings] = useState<QuizSettings>({
    quizType: 'GRADED_QUIZ',
    points: 0,
    assignmentGroup: 'QUIZZES',
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    attemptCount: 1,
    showCorrectAnswers: true,
    accessCode: '',
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: '',
    availableDate: '',
    untilDate: ''
  });

  const handleChange = (field: keyof QuizSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the quiz settings
    console.log('Saving quiz settings:', settings);
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  return (
    <Card className="p-4">
      <Card.Title className="mb-4">Quiz Settings</Card.Title>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Quiz Type</Form.Label>
              <Form.Select
                value={settings.quizType}
                onChange={(e) => handleChange('quizType', e.target.value)}
              >
                <option value="GRADED_QUIZ">Graded Quiz</option>
                <option value="PRACTICE_QUIZ">Practice Quiz</option>
                <option value="GRADED_SURVEY">Graded Survey</option>
                <option value="UNGRADED_SURVEY">Ungraded Survey</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                value={settings.points}
                onChange={(e) => handleChange('points', parseInt(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignment Group</Form.Label>
              <Form.Select
                value={settings.assignmentGroup}
                onChange={(e) => handleChange('assignmentGroup', e.target.value)}
              >
                <option value="QUIZZES">Quizzes</option>
                <option value="EXAMS">Exams</option>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="PROJECT">Project</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Shuffle Answers"
                checked={settings.shuffleAnswers}
                onChange={(e) => handleChange('shuffleAnswers', e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time Limit (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={settings.timeLimit}
                onChange={(e) => handleChange('timeLimit', parseInt(e.target.value))}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Multiple Attempts"
                checked={settings.multipleAttempts}
                onChange={(e) => handleChange('multipleAttempts', e.target.checked)}
              />
            </Form.Group>

            {settings.multipleAttempts && (
              <Form.Group className="mb-3">
                <Form.Label>Number of Attempts</Form.Label>
                <Form.Control
                  type="number"
                  value={settings.attemptCount}
                  onChange={(e) => handleChange('attemptCount', parseInt(e.target.value))}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Show Correct Answers"
                checked={settings.showCorrectAnswers}
                onChange={(e) => handleChange('showCorrectAnswers', e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Access Code</Form.Label>
              <Form.Control
                type="text"
                value={settings.accessCode}
                onChange={(e) => handleChange('accessCode', e.target.value)}
                placeholder="Optional"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="One Question at a Time"
                checked={settings.oneQuestionAtATime}
                onChange={(e) => handleChange('oneQuestionAtATime', e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Webcam Required"
                checked={settings.webcamRequired}
                onChange={(e) => handleChange('webcamRequired', e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Lock Questions After Answering"
                checked={settings.lockQuestionsAfterAnswering}
                onChange={(e) => handleChange('lockQuestionsAfterAnswering', e.target.checked)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={settings.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Available From</Form.Label>
              <Form.Control
                type="datetime-local"
                value={settings.availableDate}
                onChange={(e) => handleChange('availableDate', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Available Until</Form.Label>
              <Form.Control
                type="datetime-local"
                value={settings.untilDate}
                onChange={(e) => handleChange('untilDate', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Quiz Settings
          </Button>
        </div>
      </Form>
    </Card>
  );
}

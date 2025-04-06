// src/Kambaz/Courses/Quizzes/QuizEditor.tsx
import { useState, useEffect } from "react";
import { Form, FormControl, Button, Row, Col, InputGroup, Nav, Tab } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  updateQuizSuccess, 
  createQuizSuccess, 
  fetchQuizSuccess, 
  clearCurrentQuiz 
} from "./reducer";
import { findQuizById, createQuiz, updateQuiz } from "./client";
import { FaCalendarAlt, FaBold, FaItalic, FaUnderline, FaList, FaListOl, FaLink, FaImage } from "react-icons/fa";
import "./QuizEditor.css";

const QuizEditor = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const { quizzes, currentQuiz } = useSelector((state: any) => state.quizReducer);
  const quiz = qid !== 'new' ? quizzes.find((q: any) => q._id === qid) || currentQuiz : null;
  
  // Get course data from Redux
  const { courses } = useSelector((state: any) => state.courseReducer || { courses: [] });
  const course = courses.find((c: any) => c._id === cid);
  const courseName = course?.name || cid;
  
  const defaultQuiz = {
    title: "Unnamed Quiz",
    description: "",
    quizType: "Graded Quiz",
    published: false,
    points: 0,
    course: cid || "",
    assignmentGroup: "Quizzes",
    availableDate: new Date().toISOString().slice(0, 16),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    untilDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    questions: [],
    timeLimit: 20,
    multipleAttempts: false,
    attemptsAllowed: 1,
    shuffleAnswers: true,
    showCorrectAnswers: false,
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false
  };

  const [formData, setFormData] = useState<any>(quiz || defaultQuiz);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("details");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch quiz if not in state but have ID
    const fetchQuiz = async () => {
      if (qid && qid !== 'new' && !quiz) {
        try {
          const fetchedQuiz = await findQuizById(qid);
          dispatch(fetchQuizSuccess(fetchedQuiz));
          setFormData(fetchedQuiz);
        } catch (error) {
          console.error("Error fetching quiz:", error);
          setError("Failed to load quiz. Please try again.");
        }
      }
    };

    if (qid && qid !== 'new' && !quiz) {
      fetchQuiz();
    } else if (quiz) {
      setFormData(quiz);
    } else if (qid === 'new') {
      setFormData(defaultQuiz);
    }

    // Cleanup function
    return () => {
      dispatch(clearCurrentQuiz());
    };
  }, [qid, cid, quiz, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let newValue: any = value;
    
    // Handle different input types
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      newValue = parseInt(value, 10);
    }
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Include course ID and publish status
      const quizToSave = {
        ...formData,
        course: cid || "", // Ensure non-undefined value
        published: publish || formData.published
      };

      let savedQuiz;
      
      if (qid === 'new') {
        // Create new quiz
        savedQuiz = await createQuiz(quizToSave);
        dispatch(createQuizSuccess(savedQuiz));
      } else if (qid) { // Ensure qid is not undefined
        // Update existing quiz
        savedQuiz = await updateQuiz(qid, quizToSave);
        dispatch(updateQuizSuccess(savedQuiz));
      }
      
      // Navigate based on action
      if (publish) {
        // If save and publish, navigate to quiz list
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } else {
        // If just save, navigate to quiz details
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${savedQuiz?._id || qid}`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      setError("Failed to save quiz. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel button click with null check for cid
  const handleCancel = () => {
    if (cid) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }
  };

  // Handle tab change
  const handleTabChange = (key: string | null) => {
    if (key) {
      setActiveTab(key);
    }
  };

  return (
    <div className="quiz-editor-container">
      <div className="quiz-editor-header">
        <Link to={`/Kambaz/Courses/${cid}`}>{courseName}</Link>
        <span>&gt;</span>
        <Link to={`/Kambaz/Courses/${cid}/Quizzes`}>Quizzes</Link>
        <span>&gt;</span>
        <span>{formData.title}</span>
      </div>
      
      {/* Points display in top right (in Canvas style) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="quiz-editor-title">{formData.title}</h2>
        <div className="d-flex align-items-center">
          <span className="me-2">Points</span>
          <FormControl
            type="number"
            name="points"
            min="0"
            value={formData.points}
            onChange={handleChange}
            style={{ width: '70px' }}
            className="me-3"
          />
          <span className="me-2">
            {formData.published ? "Published" : "Not Published"}
          </span>
        </div>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Tab.Container id="quiz-editor-tabs" activeKey={activeTab} onSelect={handleTabChange}>
        <Nav className="quiz-editor-tabs">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="questions">Questions</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="details">
            <Form className="quiz-editor-form" onSubmit={(e) => handleSubmit(e)}>
              <Form.Group className="mb-3">
                <Form.Label>Quiz Title</Form.Label>
                <FormControl 
                  type="text" 
                  name="title"
                  value={formData.title} 
                  onChange={handleChange}
                  required 
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Description</Form.Label>
                <div className="description-editor">
                  <div className="editor-toolbar">
                    <button type="button"><FaBold /></button>
                    <button type="button"><FaItalic /></button>
                    <button type="button"><FaUnderline /></button>
                    <button type="button"><FaList /></button>
                    <button type="button"><FaListOl /></button>
                    <button type="button"><FaLink /></button>
                    <button type="button"><FaImage /></button>
                  </div>
                  <FormControl 
                    as="textarea" 
                    rows={5} 
                    name="description"
                    value={formData.description || ''} 
                    onChange={handleChange}
                    className="editor-content border-0" 
                  />
                </div>
                <small className="text-muted">Use the toolbar to format your description</small>
              </Form.Group>
              
              <div className="options-section">
                <h4 className="options-section-title">Quiz Options</h4>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Quiz Type</Form.Label>
                      <Form.Select
                        name="quizType"
                        value={formData.quizType}
                        onChange={handleChange}
                      >
                        <option value="Graded Quiz">Graded Quiz</option>
                        <option value="Practice Quiz">Practice Quiz</option>
                        <option value="Graded Survey">Graded Survey</option>
                        <option value="Ungraded Survey">Ungraded Survey</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Assignment Group</Form.Label>
                      <Form.Select
                        name="assignmentGroup"
                        value={formData.assignmentGroup}
                        onChange={handleChange}
                      >
                        <option value="Quizzes">Quizzes</option>
                        <option value="Exams">Exams</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Project">Project</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="shuffle-answers"
                        label="Shuffle Answers"
                        name="shuffleAnswers"
                        checked={formData.shuffleAnswers}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Time Limit</Form.Label>
                      <InputGroup>
                        <FormControl
                          type="number"
                          name="timeLimit"
                          min="0"
                          value={formData.timeLimit}
                          onChange={handleChange}
                        />
                        <InputGroup.Text>Minutes</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="multiple-attempts"
                        label="Allow Multiple Attempts"
                        name="multipleAttempts"
                        checked={formData.multipleAttempts}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {formData.multipleAttempts && (
                      <div className="conditional-field">
                        <Form.Label>Number of attempts allowed</Form.Label>
                        <FormControl
                          type="number"
                          name="attemptsAllowed"
                          min="1"
                          value={formData.attemptsAllowed}
                          onChange={handleChange}
                          style={{ maxWidth: '100px' }}
                        />
                      </div>
                    )}
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="show-correct-answers"
                        label="Show Correct Answers"
                        name="showCorrectAnswers"
                        checked={formData.showCorrectAnswers}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Access Code (Optional)</Form.Label>
                      <FormControl
                        type="text"
                        name="accessCode"
                        value={formData.accessCode || ''}
                        onChange={handleChange}
                        placeholder="Leave blank for no access code"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="one-question-at-a-time"
                        label="One Question at a Time"
                        name="oneQuestionAtATime"
                        checked={formData.oneQuestionAtATime}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {formData.oneQuestionAtATime && (
                      <div className="conditional-field">
                        <Form.Check
                          type="checkbox"
                          id="lock-questions-after-answering"
                          label="Lock Questions After Answering"
                          name="lockQuestionsAfterAnswering"
                          checked={formData.lockQuestionsAfterAnswering}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="webcam-required"
                        label="Require Webcam"
                        name="webcamRequired"
                        checked={formData.webcamRequired}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              
              <div className="options-section">
                <h4 className="options-section-title">Assign</h4>
                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Due Date</Form.Label>
                      <div className="date-input-group">
                        <FormControl
                          type="datetime-local"
                          name="dueDate"
                          value={formData.dueDate ? formData.dueDate.slice(0, 16) : ''}
                          onChange={handleChange}
                        />
                        <span className="calendar-icon"><FaCalendarAlt /></span>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Available From</Form.Label>
                      <div className="date-input-group">
                        <FormControl
                          type="datetime-local"
                          name="availableDate"
                          value={formData.availableDate ? formData.availableDate.slice(0, 16) : ''}
                          onChange={handleChange}
                        />
                        <span className="calendar-icon"><FaCalendarAlt /></span>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Available Until</Form.Label>
                      <div className="date-input-group">
                        <FormControl
                          type="datetime-local"
                          name="untilDate"
                          value={formData.untilDate ? formData.untilDate.slice(0, 16) : ''}
                          onChange={handleChange}
                        />
                        <span className="calendar-icon"><FaCalendarAlt /></span>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              
              <div className="quiz-editor-actions">
                <Button 
                  variant="secondary" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="success" 
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={saving}
                >
                  {saving ? 'Publishing...' : 'Save & Publish'}
                </Button>
              </div>
            </Form>
          </Tab.Pane>
          
          <Tab.Pane eventKey="questions">
            <div className="p-4 text-center">
              <h4>Quiz Questions Editor</h4>
              <p className="text-muted">
                This tab would allow you to add and edit questions for this quiz. <br />
                Click "Details" tab to return to quiz settings.
              </p>
              <div className="d-flex justify-content-center mt-4">
                <Button variant="primary">Add New Question</Button>
              </div>

              {formData.questions.length === 0 ? (
                <div className="alert alert-secondary mt-4">
                  No questions added yet. Click the button above to add your first question.
                </div>
              ) : (
                <div className="mt-4">
                  <p>{formData.questions.length} questions in this quiz</p>
                </div>
              )}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default QuizEditor;
// src/Kambaz/Courses/Quizzes/QuizEditor.tsx
import { useState, useEffect } from "react";
import { Form, FormControl, Button, Row, Col, InputGroup, Nav, Tab } from "react-bootstrap";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  updateQuizSuccess, 
  createQuizSuccess, 
  fetchQuizSuccess, 
  clearCurrentQuiz 
} from "./reducer";
import { findQuizById, createQuiz, updateQuiz } from "./client";
import { FaCalendarAlt, FaBold, FaItalic, FaUnderline, FaList, FaListOl, FaLink, FaImage } from "react-icons/fa";
import QuestionList from "./QuestionList";
import QuestionEditor from "./QuestionEditor";
import "./QuizEditor.css";

const QuizEditor = () => {
  const { pathname } = useLocation();
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const { quizzes, currentQuiz } = useSelector((state: any) => state.quizReducer);
  const quiz = qid !== 'new' ? quizzes.find((q: any) => q._id === qid) || currentQuiz : null;
  const isNewQuiz = pathname.split("/")[5] === "new";
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
    course: cid,
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
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        course: cid, // Ensure non-undefined value
        published: publish || formData.published
      };

      let savedQuiz;
      console.log("QID", qid)
      if (isNewQuiz) {
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
      setIsEditingQuestion(false); // Reset question editing state when switching tabs
      setCurrentQuestion(null);
    }
  };

  // Question management functions
  const handleAddQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`, // Generate a temporary ID
      title: "",
      questionType: "multiple_choice",
      questionText: "",
      points: 1,
      choices: [
        { id: "1", text: "", isCorrect: true },
        { id: "2", text: "", isCorrect: false },
        { id: "3", text: "", isCorrect: false },
      ],
      correctAnswer: true, // For true/false questions
      blankAnswers: [{ id: "1", text: "" }], // For fill in the blank questions
    };
    
    setCurrentQuestion(newQuestion);
    setIsEditingQuestion(true);
  };

  const handleEditQuestion = (questionId: string) => {
    const questionToEdit = formData.questions.find((q: any) => q.id === questionId);
    if (questionToEdit) {
      setCurrentQuestion(questionToEdit);
      setIsEditingQuestion(true);
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = formData.questions.filter((q: any) => q.id !== questionId);
    
    // Update total points calculation
    const totalPoints = updatedQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
    
    setFormData({
      ...formData,
      questions: updatedQuestions,
      points: totalPoints
    });
  };

  // const handleSaveQuestion = (question: any) => {
  //   let updatedQuestions;
  //   const existingIndex = formData.questions.findIndex((q: any) => q.id === question.id);
    
  //   if (existingIndex >= 0) {
  //     // Update existing question
  //     updatedQuestions = [...formData.questions];
  //     updatedQuestions[existingIndex] = question;
  //   } else {
  //     // Add new question
  //     updatedQuestions = [...formData.questions, question];
  //   }
    
  //   // Update total points calculation
  //   const totalPoints = updatedQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
    
  //   setFormData({
  //     ...formData,
  //     questions: updatedQuestions,
  //     points: totalPoints
  //   });
    
  //   setIsEditingQuestion(false);
  //   setCurrentQuestion(null);
  // };
  const handleSaveQuestion = (question: any) => {
    if (
      question.questionType === "multiple_choice" &&
      question.choices.some((choice: any) => !choice.text.trim())
    ) {
      setError("All multiple choice options must have text.");
      return;
    }
  
    if (
      question.questionType === "fill_blank" &&
      question.blankAnswers.some((ans: any) => !ans.text.trim())
    ) {
      setError("All blank answer fields must be filled.");
      return;
    }
  
    const existingIndex = formData.questions.findIndex((q: any) => q.id === question.id);
    let updatedQuestions;
  
    if (existingIndex >= 0) {
      updatedQuestions = [...formData.questions];
      updatedQuestions[existingIndex] = question;
    } else {
      updatedQuestions = [...formData.questions, question];
    }
  
    const totalPoints = updatedQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
  
    setFormData({
      ...formData,
      questions: updatedQuestions,
      points: totalPoints,
    });
  
    setIsEditingQuestion(false);
    setCurrentQuestion(null);
  };

  const handleCancelQuestion = () => {
    setIsEditingQuestion(false);
    setCurrentQuestion(null);
  };

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

  // Calculate total quiz points from questions
  useEffect(() => {
    if (formData.questions && formData.questions.length > 0) {
      const totalPoints = formData.questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
      if (formData.points !== totalPoints) {
        setFormData((prev: any) => ({
          ...prev,
          points: totalPoints
        }));
      }
    }
  }, [formData.questions]);

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
            disabled={formData.questions && formData.questions.length > 0}
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
                      <Form.Label>Published</Form.Label>
                      <Form.Check 
                        type="checkbox" 
                        name="published"
                        checked={formData.published || false}
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Available Date</Form.Label>
                      <InputGroup>
                        <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                        <FormControl 
                          type="datetime-local" 
                          name="availableDate"
                          value={formData.availableDate.slice(0, 16)} 
                          onChange={handleChange} 
                          required 
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Due Date</Form.Label>
                      <FormControl 
                        type="datetime-local" 
                        name="dueDate"
                        value={formData.dueDate.slice(0, 16)} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Until Date</Form.Label>
                      <FormControl 
                        type="datetime-local" 
                        name="untilDate"
                        value={formData.untilDate.slice(0, 16)} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Time Limit (minutes)</Form.Label>
                      <FormControl 
                        type="number" 
                        name="timeLimit"
                        min="0"
                        value={formData.timeLimit || 20} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Multiple Attempts</Form.Label>
                      <Form.Check 
                        type="checkbox" 
                        name="multipleAttempts"
                        checked={formData.multipleAttempts || false}
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Attempts Allowed</Form.Label>
                      <FormControl 
                        type="number" 
                        name="attemptsAllowed"
                        min="1"
                        value={formData.attemptsAllowed || 1} 
                        onChange={handleChange} 
                        disabled={!formData.multipleAttempts}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Shuffle Answers</Form.Label>
                      <Form.Check 
                        type="checkbox" 
                        name="shuffleAnswers"
                        checked={formData.shuffleAnswers || false}
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Show Correct Answers</Form.Label>
                      <Form.Check 
                        type="checkbox" 
                        name="showCorrectAnswers"
                        checked={formData.showCorrectAnswers || false}
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>One Question at a Time</Form.Label>
                      <Form.Check 
                        type="checkbox" 
                        name="oneQuestionAtATime"
                        checked={formData.oneQuestionAtATime || false}
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Lock Questions After Answering</Form.Label>
                      <Form.Check 
                        type="checkbox" 
                        name="lockQuestionsAfterAnswering"
                        checked={formData.lockQuestionsAfterAnswering || false}
                        onChange={handleChange}
                        disabled={!formData.oneQuestionAtATime} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Require Webcam</Form.Label>
                      <Form.Check 
                        type="checkbox" 
                        name="webcamRequired"
                        checked={formData.webcamRequired || false}
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
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
            {isEditingQuestion ? (
              <QuestionEditor
                question={currentQuestion}
                onSave={handleSaveQuestion}
                onCancel={handleCancelQuestion}
              />
            ) : (
              <QuestionList
                questions={formData.questions || []}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
                onAdd={handleAddQuestion}
              />
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default QuizEditor;
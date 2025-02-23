import { Button, Container, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GoPlus } from "react-icons/go";

export default function QuizEditor() {
    return (
        <Container fluid id="wd-quiz-questions-editor" className="w-100">
            <hr />
            <Link to="/Kambaz/Courses/1234/Quizzes/123/456" id="wd-quiz-link"
                className="list-group-item border border-0">
                <div className="d-flex justify-content-center">
                    <Button variant="secondary" id="wd-new-quiz-question">
                        <GoPlus className="position-relative me-2 fs-5"/>
                          New Question
                    </Button>
                </div>
            </Link>
            <hr />
            <div className="d-flex justify-content-left">
                <Button variant="secondary" className="wd-margin-right">Cancel</Button>
                <Button variant="danger">Save</Button>
            </div>
        </Container>
    );
}
import { Container } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import QuizzesControls from "./QuizzesControls";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsPlus } from "react-icons/bs";
import QuizControlButtons from "./QuizControlButtons";
import { Link } from "react-router-dom";
import QuizIcons from "./QuizIcon";

export default function Quizzes() {
    return (
        <Container id="wd-assignments">
            <QuizzesControls /><br />
            <ListGroup className="rounded-0" id="wd-assignments">
                <ListGroup.Item className="wd-assignments-title p-0 mb-5 fs-5 border-gray" id="wd-assignments-title">
                    <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
                        <IoMdArrowDropdown className="me-2 fs-3" /> Assignments Quizzes
                        <div className="ms-auto">
                            <BsPlus className="fs-4" style={{ bottom: "2px" }} />
                        </div>
                    </div>
                    <ListGroup className="wd-quizzes rounded-0">
                        <ListGroup.Item className="green-left-border p-3 ps-1 d-flex align-items-center">
                            <QuizIcons />
                            <div className="float-end wd-margin-left" >
                                <Link to="/Kambaz/Courses/1234/Assignments/123" id="wd-assignment-link"
                                    className="list-group-item border border-0">
                                    A1 - ENV + HTML<br />
                                    <span style={{ fontSize: "16px" }}>Multiple Modules | <b>Not available until</b> May 6 at 12:00am | <b>Due</b> May 13 at 11:59pm | 100 pts</span>
                                </Link>
                            </div>
                            <div className="ms-auto">
                                <QuizControlButtons />
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="green-left-border p-3 ps-1 d-flex align-items-center">
                            <QuizIcons />
                            <div className="float-end wd-margin-left" >
                                <Link to="/Kambaz/Courses/1234/Assignments/123" id="wd-assignment-link"
                                    className="list-group-item border border-0">
                                    A2 - CSS + BOOTSTRAP<br />
                                    <span style={{ fontSize: "16px" }}> Multiple Modules | <b>Not available until</b> May 13 at 12:00am | <b>Due</b> May 20 at 11:59pm | 100 pts</span>
                                </Link>
                            </div>
                            <div className="ms-auto">
                                <QuizControlButtons />
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="green-left-border p-3 ps-1 d-flex align-items-center">
                            <QuizIcons />
                            <div className="float-end wd-margin-left" >
                                <Link to="/Kambaz/Courses/1234/Assignments/123" id="wd-assignment-link"
                                    className="list-group-item border border-0">
                                    A3 - JAVASCRIPT + REACT<br />
                                    <span style={{ fontSize: "16px" }}> Multiple Modules | <b>Not available until</b> May 20 at 12:00am | <b>Due</b> May 27 at 11:59pm | 100 pts</span>
                                </Link>
                            </div>
                            <div className="ms-auto">
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </Container>
    );
}
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import QuestionHeader from "./QuestionHeader";
import { ImArrowRight } from "react-icons/im";
import QuestionIcons from "./QuestionIcons";

export default function QuestionEditor() {
    return (
        <Container fluid id="wd-questions-editor">
            <Form.Group as={Row}>
                <Col md={4}>
                    <Form.Control type="text" className="wd-margin-bottom" placeholder="Question Name" id="wd-question-name" value="Easy Question" />
                </Col>
                <Col md={5}>
                    <Form.Select>
                        <option value="MULTIPLE CHOICE">Multiple Choice</option>
                        <option value="TRUE OR FALSE">True or False</option>
                        <option value="FILL IN THE BLANK">Fill in the Blank</option>
                    </Form.Select>
                </Col>
                <Col md={2} className="ms-auto">
                    <Form.Group as={Row} >
                        <Form.Label column sm={2} className="text-end">
                            <b>pts:</b>
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="number" className="wd-margin-bottom" placeholder="0" id="wd-question-points" value="4" />
                        </Col>
                    </Form.Group>
                </Col>
            </Form.Group>
            <QuestionHeader />
            <Form.Control as="textarea" rows={3} id="wd-question-description" placeholder="Insert Description" value="How much is 2 + 2?" />
            <br />
            <div id="wd-possible-answers">
                <b>Answers:</b>
                <Form.Group as={Row} className="mb-3" >
                    <Form.Label column sm={3} className="text-end">Possible Answer</Form.Label>
                    <Col sm={8}>
                        <Form.Control type="text" className="wd-margin-bottom" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3} className="text-end">Possible Answer</Form.Label>
                    <Col sm={8}>
                        <Form.Control type="text" className="wd-margin-bottom" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3} className="text-end text-success"><ImArrowRight className="green-icon" /> Correct Answer</Form.Label>
                    <Col sm={8}>
                        <Form.Control type="text" className="wd-margin-bottom" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 wd-thin-gray-borders-sharp wd-padded-top wd-margin-right">
                    <Form.Label column sm={3} className="text-end text-success"><ImArrowRight className="green-icon"  style={{ opacity: 0.5 }} /> Correct Answer</Form.Label>
                    <Col sm={8}>
                        <Form.Control type="text" className="wd-margin-bottom" />
                    </Col>
                    <Col className="ms-auto">
                        <QuestionIcons />
                    </Col>
                </Form.Group>
                <div className="ms-auto text-end">
                    <Button variant="light" className="bg-transparent border-0 text-danger"> + Add Another Answer</Button>
                </div>
                <div className="d-flex justify-content-left">
                    <Button variant="secondary" className="wd-margin-right">Cancel</Button>
                    <Button variant="danger">Update Question</Button>
                </div>
            </div>

        </Container>
    );
}

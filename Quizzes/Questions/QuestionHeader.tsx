import { Button, Col, Form, Row } from "react-bootstrap";
import { FaBold } from "react-icons/fa6";
import { GoItalic } from "react-icons/go";
import { FiUnderline } from "react-icons/fi";
import { MdOutlineFormatColorText } from "react-icons/md";
import { FaHighlighter } from "react-icons/fa6";
import { RiSuperscript2 } from "react-icons/ri";
import { IoEllipsisVertical } from "react-icons/io5";
import { PiLineVerticalThin } from "react-icons/pi";

export default function QuestionHeader() {
    return (
        <div>
            <hr />
            Enter your question and then multiple answers, then select one correct answer.
            <br /><br />
            <b>Question:</b>
            <div className="d-flex">

            </div>
            <hr />
            <div>
                <Form.Group as={Row} className="wd-margin-bottom align-items-center ms-auto justify-content-center">
                    <Col sm={1}>
                        <Form.Select className="border-0">
                            <option value="8">8pt</option>
                            <option value="10">10pt</option>
                            <option value="12">12pt</option>
                            <option value="14">14pt</option>
                            <option value="18">18pt</option>
                            <option value="24">24pt</option>
                            <option value="36">36pt</option>
                        </Form.Select>
                    </Col>
                    <Col sm={2}>
                        <Form.Select className="border-0">
                            <option value="Paragraph">Paragraph</option>
                            <option value="Heading 2">Heading 2</option>
                            <option value="Heading 3">Heading 3</option>
                            <option value="Heading 4">Heading 4</option>
                        </Form.Select>
                    </Col>
                    <Col sm={1}>
                        <PiLineVerticalThin className="fs-3 light-gray-font" />
                        <Button variant="light" className="border-0 bg-transparent">
                            <FaBold />
                        </Button>
                    </Col>
                    <Col sm={1}>
                        <Button variant="light" size="lg" className="border-0 bg-transparent">
                            <GoItalic />
                        </Button>
                    </Col>
                    <Col sm={1}>
                        <Button variant="light" size="lg" className="border-0 bg-transparent">
                            <FiUnderline />
                        </Button>
                    </Col>
                    <Col sm={1} className="d-flex">
                        <Button variant="light" size="lg" className="border-0 bg-transparent">
                            <MdOutlineFormatColorText />
                        </Button>
                        <Form.Select className="border-0">

                        </Form.Select>
                    </Col>
                    <Col sm={1} className="d-flex">
                        <Button variant="light" size="lg" className="border-0 bg-transparent">
                            <FaHighlighter />
                        </Button>
                        <Form.Select className="border-0">

                        </Form.Select>
                    </Col>
                    <Col sm={1} className="d-flex">
                        <Button variant="light" size="lg" className="border-0 bg-transparent">
                            <RiSuperscript2 />
                        </Button>
                        <Form.Select className="border-0">

                        </Form.Select>
                    </Col>
                    <Col sm={1}>
                        <PiLineVerticalThin className="fs-3 light-gray-font" />
                        <IoEllipsisVertical />
                    </Col>
                </Form.Group>
            </div>
        </div>

    );
}
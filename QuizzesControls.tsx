import { Button, FormControl, InputGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { RxMagnifyingGlass } from "react-icons/rx";

export default function QuizzesControls() {
    return (
        <div id="wd-quizzes-controls" className="text-nowrap">
            <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-elipses">
                <IoEllipsisVertical className="fs-4" />
            </Button>
            <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-quiz">
                <FaPlus className="position-relative me-2" />
                Quiz
            </Button>
            <InputGroup className="me-1 float-left" style={{ width: 300 }}>
                <InputGroup.Text>
                    <RxMagnifyingGlass />
                </InputGroup.Text>
                <FormControl 
                    type="text"
                    className="form-control-lg"
                    placeholder="Search for Quizzes"
                    id="wd-search-quiz"
                />
            </InputGroup>
        </div>
    );
}
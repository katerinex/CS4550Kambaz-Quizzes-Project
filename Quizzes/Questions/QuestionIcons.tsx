import { FaRegTrashCan } from "react-icons/fa6";
import { TiPencil } from "react-icons/ti";

export default function QuestionIcons() {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <TiPencil className="fs-5" transform="flip-h"/>
            <FaRegTrashCan />
        </div>
    );
}
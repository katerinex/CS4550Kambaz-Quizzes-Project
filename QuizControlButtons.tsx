import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";

export default function AssignmentControlButtons() {
    return (
        <div className="justify-content-end">
            <GreenCheckmark />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
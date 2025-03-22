// src/Kambaz/Courses/Modules/ModuleControlButtons.tsx
import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { useState } from "react";
import ModuleEditor from "./ModuleEditor";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6"; 

interface ModuleControlButtonsProps {
  moduleName: string;
  setModuleName: (name: string) => void;
  addModule: () => void;
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void; 
}

export default function ModuleControlButtons({
  moduleName,
  setModuleName,
  addModule,
  moduleId,
  deleteModule,
  editModule, // Destructure editModule
}: ModuleControlButtonsProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="float-end">
      <FaPencil
        onClick={() => editModule(moduleId)}
        className="text-primary me-3"
        style={{ cursor: "pointer" }}
      />
      <FaTrash
        className="text-danger me-2 mb-1"
        onClick={() => deleteModule(moduleId)}
        style={{ cursor: "pointer" }}
      />
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4 me-2" />
      <BsPlus className="fs-4" onClick={handleShow} style={{ cursor: "pointer" }} />
      <ModuleEditor
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
    </div>
  );
}
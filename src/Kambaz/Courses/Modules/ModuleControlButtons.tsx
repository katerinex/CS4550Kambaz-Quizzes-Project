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
  editModule,
}: ModuleControlButtonsProps) {
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
  };
  
  const handleShow = (editing: boolean = false) => {
    setIsEditing(editing);
    setShow(true);
    
    if (editing) {
      editModule(moduleId);
    }
  };

  // Stop event propagation to prevent toggling the module expansion
  const handleClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div className="float-end ms-auto" onClick={(e) => e.stopPropagation()}>
      <FaPencil
        onClick={(e) => handleClick(e, () => handleShow(true))}
        className="text-primary me-3"
        style={{ cursor: "pointer" }}
      />
      <FaTrash
        className="text-danger me-2 mb-1"
        onClick={(e) => handleClick(e, () => deleteModule(moduleId))}
        style={{ cursor: "pointer" }}
      />
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4 me-2" />
      <BsPlus 
        className="fs-4" 
        onClick={(e) => handleClick(e, () => handleShow(false))} 
        style={{ cursor: "pointer" }} 
      />
      
      <ModuleEditor
        show={show}
        handleClose={handleClose}
        dialogTitle={isEditing ? "Edit Module" : "Add Module"}
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
        isEditing={isEditing}
      />
    </div>
  );
}
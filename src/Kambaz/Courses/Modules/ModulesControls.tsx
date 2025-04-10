// src/Kambaz/Courses/Modules/ModulesControls.tsx


import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { Button, Dropdown } from "react-bootstrap";
import { useState } from "react";
import ModuleEditor from "./ModuleEditor";

// Updated interface to include collapseAll
interface ModulesControlsProps {
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
  collapseAll: () => void; // Added this property
}

export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
  collapseAll, // Added this parameter
}: ModulesControlsProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div
      id="wd-modules-controls"
      className="d-flex justify-content-end align-items-center mt-3 mb-3"
    >
      <Button
        variant="danger"
        size="lg"
        className="me-2"
        id="wd-add-module-btn"
        onClick={handleShow}
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Module
      </Button>
      
      <Dropdown className="me-2">
        <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark /> Publish All
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item id="wd-publish-all">
            <GreenCheckmark /> Publish All
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-all-modules-and-items">
            <GreenCheckmark /> Publish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-modules-only">
            <GreenCheckmark /> Publish modules only
          </Dropdown.Item>
          <Dropdown.Item id="wd-unpublish-all-modules-and-items">
            <span>Unpublish all modules and items</span>
          </Dropdown.Item>
          <Dropdown.Item id="wd-unpublish-modules-only">
            <span>Unpublish modules only</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
      <Button variant="light" size="lg" className="me-2" id="wd-view-progress">
        View Progress
      </Button>
      
      <Button 
        variant="light" 
        size="lg" 
        id="wd-collapse-all"
        onClick={collapseAll} // Used here
      >
        Collapse All
      </Button>
      
      <ModuleEditor
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
        isEditing={false}
      />
    </div>
  );
}
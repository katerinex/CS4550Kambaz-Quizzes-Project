// src/Kambaz/Courses/Modules/ModuleEditor.tsx

import { Modal, FormControl, Button } from "react-bootstrap";

interface ModuleEditorProps {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
  moduleName: string;
  setModuleName: (name: string) => void;
  addModule: () => void;
  isEditing?: boolean;
}

export default function ModuleEditor({
  show,
  handleClose,
  dialogTitle,
  moduleName,
  setModuleName,
  addModule,
  isEditing = false
}: ModuleEditorProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl 
          value={moduleName}
          onChange={(e) => { setModuleName(e.target.value); }} 
          placeholder="Enter module name"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            addModule();
            handleClose();
          }}
        >
          {isEditing ? "Update Module" : "Add Module"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}


// src/Kambaz/Courses/Modules/index.tsx

import { useState, useEffect, useRef } from "react";
import {
  FaChevronRight,
  FaChevronDown,
  FaEllipsisV,
  FaCheck,
  FaFileAlt,
  FaPlus,
  FaPencilAlt
} from "react-icons/fa";
import {
  Button,
  Dropdown,
  Modal,
  FormControl,
  Alert,
  Overlay,
  Tooltip
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addModule,
  setModules,
  deleteModule,
  updateModule,
  Module
} from "./reducer";
import * as coursesClient from "../client";
import * as modulesClient from "./client";

// Import components
import GreenCheckmark from "./GreenCheckmark";
import LessonControlButtons from "./LessonControlButtons";

interface ModulesProps {
  courseId: string | undefined;
}

interface Lesson {
  _id: string;
  name: string;
  description?: string;
  module: string;
  published?: boolean;
  points?: number;
}

export default function Modules(props: ModulesProps) {
  const { courseId } = props;
  const { cid } = useParams<{ cid?: string }>();
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<{[key: string]: boolean}>({});
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [showDropdownMenu, setShowDropdownMenu] = useState<string | null>(null);
  const [publishDropdownOpen, setPublishDropdownOpen] = useState(false);
  const [editingDescription, setEditingDescription] = useState<string | null>(null);
  const [tempDescription, setTempDescription] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  
  // Add state for current lesson being edited
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  // Add state for lesson points
  const [lessonPoints, setLessonPoints] = useState<number>(0);
  
  // Get current user from Redux store
  const { user } = useSelector((state: any) => state.accountReducer);
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();
  
  // Check if user is faculty/admin
  const isFaculty = user?.role === "FACULTY" || user?.role === "ADMIN";

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const courseIdToUse = courseId || cid;
     
      if (courseIdToUse) {
        console.log("Fetching modules for course:", courseIdToUse);
        const fetchedModules = await coursesClient.findModulesForCourse(
          courseIdToUse as string
        );
        console.log("Fetched modules:", fetchedModules);
        dispatch(setModules(fetchedModules));
       
        // Initialize modules expanded/collapsed state
        const initialExpandState: {[key: string]: boolean} = {};
        fetchedModules.forEach((module: Module) => {
          initialExpandState[module._id] = true;
        });
        setExpandedModules(initialExpandState);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Failed to fetch modules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModuleModal = (module: Module | null = null) => {
    if (module) {
      setCurrentModule(module);
      setModuleName(module.name);
      setModuleDescription(module.description || "");
    } else {
      setCurrentModule(null);
      setModuleName("");
      setModuleDescription("");
    }
    setShowModuleModal(true);
  };

  const handleOpenLessonModal = (module: Module) => {
    setCurrentModule(module);
    setLessonName("");
    setLessonDescription("");
    setLessonPoints(0);
    setCurrentLessonId(null);
    setShowLessonModal(true);
  };

  const handleCloseModuleModal = () => {
    setShowModuleModal(false);
  };

  const handleCloseLessonModal = () => {
    setShowLessonModal(false);
  };

  const handleAddOrUpdateModule = async () => {
    const courseIdToUse = courseId || cid;
    if (!courseIdToUse || !moduleName.trim()) return;
   
    try {
      setError(null);
     
      if (currentModule) {
        // Update existing module
        const updatedModule = {
          ...currentModule,
          name: moduleName,
          description: moduleDescription
        };
        await modulesClient.updateModule(updatedModule);
        dispatch(updateModule(updatedModule));
      } else {
        // Create new module
        const newModule = {
          _id: Date.now().toString(), // Generate temporary ID
          name: moduleName,
          description: moduleDescription,
          course: courseIdToUse,
          published: false // Default to unpublished
        };
       
        const module = await coursesClient.createModuleForCourse(courseIdToUse, newModule);
        dispatch(addModule(module));
      }
     
      setShowModuleModal(false);
      setModuleName("");
      setModuleDescription("");
    } catch (err) {
      console.error("Error adding/updating module:", err);
      setError(currentModule ? "Failed to update module." : "Failed to create module.");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await modulesClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    } catch (err) {
      console.error("Error deleting module:", err);
      setError("Failed to delete module. Please try again.");
    }
  };

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Expand all modules
  const expandAll = () => {
    const allExpanded: {[key: string]: boolean} = {};
    modules.forEach((module: Module) => {
      allExpanded[module._id] = true;
    });
    setExpandedModules(allExpanded);
    
    // Show tooltip feedback
    showFeedbackTooltip("All modules expanded");
  };

  // Collapse all modules
  const collapseAll = () => {
    const allCollapsed: {[key: string]: boolean} = {};
    modules.forEach((module: Module) => {
      allCollapsed[module._id] = false;
    });
    setExpandedModules(allCollapsed);
    
    // Show tooltip feedback
    showFeedbackTooltip("All modules collapsed");
  };

  // Toggle publish status for a single module - UPDATED
  const togglePublishStatus = (module: Module) => {
    const updatedModule = {
      ...module,
      published: !module.published
    };
   
    // First update in Redux store to make UI responsive
    dispatch(updateModule(updatedModule));
    
    // Then update in the database
    modulesClient.updateModule(updatedModule)
      .then(() => {
        showFeedbackTooltip(updatedModule.published ? 
          `"${module.name}" published` : 
          `"${module.name}" unpublished`);
      })
      .catch((err) => {
        console.error("Error toggling publish status:", err);
        // If server update fails, revert Redux state to match server
        dispatch(updateModule(module));
        setError("Failed to update module publish status.");
      });
  };

  // Publish all modules
  const publishAll = async () => {
    try {
      const updatedModules = modules.map((module: Module) => ({
        ...module,
        published: true
      }));
     
      // Update all modules in parallel
      await Promise.all(updatedModules.map((module: Module) =>
        modulesClient.updateModule(module)
      ));
     
      // Update Redux store
      updatedModules.forEach((module: Module) => {
        dispatch(updateModule(module));
      });
     
      setPublishDropdownOpen(false);
      showFeedbackTooltip("All modules published");
    } catch (err) {
      console.error("Error publishing all modules:", err);
      setError("Failed to publish all modules.");
    }
  };

  // Publish all modules and items - UPDATED
  const publishAllModulesAndItems = async () => {
    try {
      const updatedModules = modules.map((module: Module) => {
        // Create updated version with published lessons
        const updatedLessons = module.lessons ? module.lessons.map((lesson: Lesson) => ({
          ...lesson,
          published: true
        })) : [];
        
        return {
          ...module,
          published: true,
          lessons: updatedLessons
        };
      });
     
      // Update all modules in parallel and collect results
      const updateResults = await Promise.all(updatedModules.map((module: Module) =>
        modulesClient.updateModule(module)
      ));
      
      console.log("Update results:", updateResults);
     
      // Update Redux store with successful updates
      updateResults.forEach((updatedModule) => {
        if (updatedModule) {
          dispatch(updateModule(updatedModule));
        }
      });
     
      setPublishDropdownOpen(false);
      showFeedbackTooltip("All modules and items published");
    } catch (err) {
      console.error("Error publishing all modules and items:", err);
      setError("Failed to publish all modules and items.");
    }
  };

  // Publish modules only
  const publishModulesOnly = async () => {
    try {
      const updatedModules = modules.map((module: Module) => {
        // Keep lessons as they are, just update module publish status
        return {
          ...module,
          published: true
        };
      });
     
      // Update all modules in parallel
      await Promise.all(updatedModules.map((module: Module) =>
        modulesClient.updateModule(module)
      ));
     
      // Update Redux store
      updatedModules.forEach((module: Module) => {
        dispatch(updateModule(module));
      });
     
      setPublishDropdownOpen(false);
      showFeedbackTooltip("All modules published");
    } catch (err) {
      console.error("Error publishing modules only:", err);
      setError("Failed to publish modules only.");
    }
  };

  // Unpublish all modules and items
  const unpublishAllModulesAndItems = async () => {
    try {
      const updatedModules = modules.map((module: Module) => {
        // Create updated version with unpublished lessons
        return {
          ...module,
          published: false,
          lessons: module.lessons ? module.lessons.map((lesson: Lesson) => ({
            ...lesson,
            published: false
          })) : []
        };
      });
     
      // Update all modules in parallel
      await Promise.all(updatedModules.map((module: Module) =>
        modulesClient.updateModule(module)
      ));
     
      // Update Redux store
      updatedModules.forEach((module: Module) => {
        dispatch(updateModule(module));
      });
     
      setPublishDropdownOpen(false);
      showFeedbackTooltip("All modules and items unpublished");
    } catch (err) {
      console.error("Error unpublishing all modules and items:", err);
      setError("Failed to unpublish all modules and items.");
    }
  };

  // Unpublish modules only
  const unpublishModulesOnly = async () => {
    try {
      const updatedModules = modules.map((module: Module) => {
        // Keep lessons as they are, just update module publish status
        return {
          ...module,
          published: false
        };
      });
     
      // Update all modules in parallel
      await Promise.all(updatedModules.map((module: Module) =>
        modulesClient.updateModule(module)
      ));
     
      // Update Redux store
      updatedModules.forEach((module: Module) => {
        dispatch(updateModule(module));
      });
     
      setPublishDropdownOpen(false);
      showFeedbackTooltip("All modules unpublished");
    } catch (err) {
      console.error("Error unpublishing modules only:", err);
      setError("Failed to unpublish modules only.");
    }
  };

  const handleDropdownToggle = (moduleId: string | null) => {
    setShowDropdownMenu(moduleId);
  };

  // Start editing module description
  const startEditingDescription = (module: Module) => {
    setEditingDescription(module._id);
    setTempDescription(module.description || "");
  };

  // Save module description
  const saveModuleDescription = async (module: Module) => {
    try {
      const updatedModule = {
        ...module,
        description: tempDescription
      };
      
      await modulesClient.updateModule(updatedModule);
      dispatch(updateModule(updatedModule));
      setEditingDescription(null);
      showFeedbackTooltip("Description saved");
    } catch (err) {
      console.error("Error updating module description:", err);
      setError("Failed to update module description.");
    }
  };

  // Show feedback tooltip
  const showFeedbackTooltip = (message: string) => {
    setTooltipMessage(message);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  // Handle lesson editing
  const handleEditLesson = (module: Module, lesson: Lesson) => {
    setCurrentModule(module);
    setLessonName(lesson.name);
    setLessonDescription(lesson.description || "");
    setLessonPoints(lesson.points || 0);
    setShowLessonModal(true);
    
    // Store the lesson ID to know we're editing an existing lesson
    setCurrentLessonId(lesson._id);
  };
  
  // Handle lesson saving (new or update)
  const handleSaveLesson = async () => {
    if (!currentModule || !lessonName.trim()) return;
    
    try {
      setError(null);
      
      // Check if we're editing an existing lesson
      if (currentLessonId) {
        // Find the existing lesson in the module
        const updatedLessons = currentModule.lessons ? 
          currentModule.lessons.map((lesson: Lesson) => 
            lesson._id === currentLessonId ? 
              { 
                ...lesson, 
                name: lessonName, 
                description: lessonDescription,
                points: lessonPoints
              } : 
              lesson
          ) : [];
          
        const updatedModule = {
          ...currentModule,
          lessons: updatedLessons
        };
        
        await modulesClient.updateModule(updatedModule);
        dispatch(updateModule(updatedModule));
        showFeedbackTooltip("Lesson updated");
      } else {
        // Create new lesson
        const newLesson = {
          _id: `L${Date.now()}`,
          name: lessonName,
          description: lessonDescription,
          module: currentModule._id,
          published: false,
          points: lessonPoints
        };
        
        const updatedModule = {
          ...currentModule,
          lessons: [...(currentModule.lessons || []), newLesson]
        };
        
        await modulesClient.updateModule(updatedModule);
        dispatch(updateModule(updatedModule));
        showFeedbackTooltip("Lesson created");
      }
      
      setShowLessonModal(false);
      setLessonName("");
      setLessonDescription("");
      setLessonPoints(0);
      setCurrentLessonId(null);
    } catch (err) {
      console.error("Error saving lesson:", err);
      setError(currentLessonId ? "Failed to update lesson." : "Failed to create lesson.");
    }
  };
  
  // Handle lesson deletion
  const handleDeleteLesson = async (module: Module, lessonId: string) => {
    try {
      // Filter out the lesson to be deleted
      const updatedLessons = module.lessons ? 
        module.lessons.filter((lesson: Lesson) => lesson._id !== lessonId) : 
        [];
        
      const updatedModule = {
        ...module,
        lessons: updatedLessons
      };
      
      await modulesClient.updateModule(updatedModule);
      dispatch(updateModule(updatedModule));
      showFeedbackTooltip("Lesson removed");
    } catch (err) {
      console.error("Error deleting lesson:", err);
      setError("Failed to delete lesson.");
    }
  };
  
  // Toggle lesson publish status - UPDATED
  const toggleLessonPublishStatus = async (module: Module, lessonId: string) => {
    try {
      // Create a deep copy of the module to avoid modifying state directly
      const moduleCopy = JSON.parse(JSON.stringify(module));
      
      // Find and update the target lesson's publish status
      if (moduleCopy.lessons) {
        moduleCopy.lessons = moduleCopy.lessons.map((lesson: Lesson) => 
          lesson._id === lessonId ? 
            { ...lesson, published: !lesson.published } : 
            lesson
        );
      }
      
      // Update in Redux first for responsive UI
      dispatch(updateModule(moduleCopy));
      
      // Then update in the database
      const updatedModule = await modulesClient.updateModule(moduleCopy);
      
      // Find the lesson to show appropriate feedback
      const targetLesson = updatedModule.lessons?.find(l => l._id === lessonId);
      if (targetLesson) {
        showFeedbackTooltip(targetLesson.published ? 
          `"${targetLesson.name}" published` : 
          `"${targetLesson.name}" unpublished`);
      }
    } catch (err) {
      console.error("Error toggling lesson publish status:", err);
      // If server update fails, revert Redux state to match server
      dispatch(updateModule(module));
      setError("Failed to update lesson publish status.");
    }
  };
  
  // View progress functionality
  const handleViewProgress = () => {
    // This would typically navigate to a progress view or open a modal
    alert("View Progress functionality would be implemented here");
  };
  
  // For tooltip positioning
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    fetchModules();
  }, [cid, courseId]);

  return (
    <div className="p-3">
      {error && <Alert variant="danger">{error}</Alert>}
     
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {/* Canvas-style Header based on screenshots */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Modules</h2>
           
            <div className="d-flex" ref={tooltipRef}>
              {/* Tooltip for feedback */}
              <Overlay
                target={tooltipRef.current}
                show={showTooltip}
                placement="top"
              >
                <Tooltip id="button-tooltip">
                  {tooltipMessage}
                </Tooltip>
              </Overlay>
            
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={collapseAll}
              >
                Collapse All
              </Button>
              
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={expandAll}
              >
                Expand All
              </Button>
             
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={handleViewProgress}
              >
                View Progress
              </Button>
             
              {isFaculty && (
                <Dropdown
                  className="me-2"
                  show={publishDropdownOpen}
                  onToggle={(isOpen) => setPublishDropdownOpen(isOpen)}
                >
                  <Dropdown.Toggle variant="success" id="publish-all-dropdown">
                    <FaCheck className="me-1" /> Publish All
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={publishAll}>
                      <FaCheck className="text-success me-2" /> Publish All
                    </Dropdown.Item>
                    <Dropdown.Item onClick={publishAllModulesAndItems}>
                      <FaCheck className="text-success me-2" /> Publish all modules and items
                    </Dropdown.Item>
                    <Dropdown.Item onClick={publishModulesOnly}>
                      <FaCheck className="text-success me-2" /> Publish modules only
                    </Dropdown.Item>
                    <Dropdown.Item onClick={unpublishAllModulesAndItems}>
                      Unpublish all modules and items
                    </Dropdown.Item>
                    <Dropdown.Item onClick={unpublishModulesOnly}>
                      Unpublish modules only
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
             
              {isFaculty && (
                <Button
                  variant="primary"
                  onClick={() => handleOpenModuleModal()}
                >
                  <FaPlus className="me-1" /> Add Module
                </Button>
              )}
            </div>
          </div>
         
          {/* Modules List - styled similar to Canvas screenshot */}
          {modules && modules.length > 0 ? (
            <div className="border rounded">
              {modules.map((module: Module, index: number) => (
                <div key={module._id} className={index !== 0 ? "border-top" : ""}>
                  <div
                    className="p-3 bg-light d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                  >
                    <div 
                      className="me-2" 
                      onClick={() => toggleModuleExpand(module._id)}
                      aria-label={expandedModules[module._id] ? "Collapse module" : "Expand module"}
                    >
                      {expandedModules[module._id] ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </div>
                    <h6
                      className="mb-0 flex-grow-1"
                      onClick={() => toggleModuleExpand(module._id)}
                    >
                      {module.name}
                    </h6>
                   
                    <div className="d-flex align-items-center">
                      {module.published && (
                        <GreenCheckmark />
                      )}
                     
                      {isFaculty && (
                        <Dropdown
                          show={showDropdownMenu === module._id}
                          onToggle={() => handleDropdownToggle(
                            showDropdownMenu === module._id ? null : module._id
                          )}
                        >
                          <Dropdown.Toggle variant="link" className="p-0 text-dark">
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => {
                              handleOpenModuleModal(module);
                              handleDropdownToggle(null);
                            }}>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                              const updatedName = prompt("Enter new module name", module.name);
                              if (updatedName && updatedName.trim() !== "") {
                                const updatedModule = {
                                  ...module,
                                  name: updatedName
                                };
                                dispatch(updateModule(updatedModule));
                                modulesClient.updateModule(updatedModule)
                                  .then(() => {
                                    showFeedbackTooltip("Module renamed");
                                  })
                                  .catch(() => {
                                    setError("Failed to update module name.");
                                  });
                              }
                              handleDropdownToggle(null);
                            }}>
                              Quick Rename
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                              togglePublishStatus(module);
                              handleDropdownToggle(null);
                            }}>
                              {module.published ? "Unpublish" : "Publish"}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                              if (window.confirm("Are you sure you want to delete this module?")) {
                                handleDeleteModule(module._id);
                              }
                              handleDropdownToggle(null);
                            }}>
                              Remove
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                              handleDropdownToggle(null);
                              // Move functionality would go here
                              alert("Move functionality would be implemented here");
                            }}>
                              Move to...
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                              handleDropdownToggle(null);
                              // Duplicate functionality would go here
                              alert("Duplicate functionality would be implemented here");
                            }}>
                              Duplicate
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                 
                  {expandedModules[module._id] && (
                    <div>
                      {/* Module Description - with edit functionality */}
                      {editingDescription === module._id ? (
                        <div className="ps-4 py-2 border-top d-flex">
                          <FormControl
                            as="textarea"
                            rows={2}
                            value={tempDescription}
                            onChange={(e) => setTempDescription(e.target.value)}
                            placeholder="Add a description (optional)"
                            className="flex-grow-1 me-2"
                          />
                          <div>
                            <Button 
                              variant="success" 
                              size="sm"
                              className="me-1" 
                              onClick={() => saveModuleDescription(module)}
                            >
                              Save
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              onClick={() => setEditingDescription(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="ps-4 py-2 text-muted border-top d-flex align-items-center"
                          style={{ minHeight: '40px' }}
                        >
                          <div className="flex-grow-1">
                            {module.description || (isFaculty ? "No description" : "")}
                          </div>
                          {isFaculty && (
                            <Button 
                              variant="link" 
                              className="text-muted p-1" 
                              onClick={() => startEditingDescription(module)}
                              title="Edit description"
                            >
                              <FaPencilAlt size={14} />
                            </Button>
                          )}
                        </div>
                      )}
                     
                      {module.lessons && module.lessons.length > 0 ? (
                        <div>
                          {module.lessons
                            .filter((lesson: Lesson) => isFaculty || lesson.published)
                            .map((lesson: Lesson) => (
                              <div
                                key={lesson._id}
                                className="d-flex align-items-center p-3 border-top"
                              >
                                <div className="ms-4 me-2">
                                  <FaFileAlt className="text-muted" />
                                </div>
                                <div className="flex-grow-1">
                                  <div>{lesson.name}</div>
                                  {lesson.description && (
                                    <div className="small text-muted">{lesson.description}</div>
                                  )}
                                </div>
                               
                                <div className="d-flex align-items-center">
                                  {lesson.points !== undefined && (
                                    <span className="me-3 text-muted small">
                                      {lesson.points} pts
                                    </span>
                                  )}
                                 
                                  {lesson.published && !isFaculty && (
                                    <GreenCheckmark />
                                  )}
                                 
                                  {isFaculty && (
                                    <>
                                      <LessonControlButtons 
                                        onView={() => alert(`View lesson: ${lesson.name}`)}
                                        onEdit={() => handleEditLesson(module, lesson)}
                                        onDelete={() => {
                                          if (window.confirm(`Are you sure you want to delete "${lesson.name}"?`)) {
                                            handleDeleteLesson(module, lesson._id);
                                          }
                                        }}
                                      />
                                      <Dropdown>
                                        <Dropdown.Toggle variant="link" className="p-0 text-dark">
                                          <FaEllipsisV />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                          <Dropdown.Item onClick={() => handleEditLesson(module, lesson)}>
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item onClick={() => {
                                            alert(`Move lesson "${lesson.name}" to another module`);
                                          }}>
                                            Move to...
                                          </Dropdown.Item>
                                          <Dropdown.Item onClick={() => {
                                            toggleLessonPublishStatus(module, lesson._id);
                                          }}>
                                            {lesson.published ? "Unpublish" : "Publish"}
                                          </Dropdown.Item>
                                          <Dropdown.Item onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete "${lesson.name}"?`)) {
                                              handleDeleteLesson(module, lesson._id);
                                            }
                                          }}>
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      ) : (
                        <div className="p-3 text-muted border-top">
                          No items in this module
                        </div>
                      )}
                     
                      {isFaculty && (
                        <div className="p-3 border-top">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleOpenLessonModal(module)}
                          >
                            <FaPlus className="me-1" /> Add Item
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No modules found for this course. {isFaculty && "Add a new module to get started."}
            </div>
          )}
        </div>
      )}
     
      {/* Module Add/Edit Modal */}
      <Modal show={showModuleModal} onHide={handleCloseModuleModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentModule ? "Edit Module" : "Add Module"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Module Name</label>
            <FormControl
              placeholder="Module Name"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Module Description (optional)</label>
            <FormControl
              as="textarea"
              rows={3}
              placeholder="Module Description"
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModuleModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddOrUpdateModule}
            disabled={!moduleName.trim()}
          >
            {currentModule ? "Update Module" : "Add Module"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lesson Add/Edit Modal */}
      <Modal show={showLessonModal} onHide={handleCloseLessonModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentLessonId ? 
              `Edit Item in ${currentModule?.name}` : 
              `Add Item to ${currentModule?.name}`
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Item Name</label>
            <FormControl
              placeholder="Item Name"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Item Description (optional)</label>
            <FormControl
              as="textarea"
              rows={3}
              placeholder="Item Description"
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Points (optional)</label>
            <FormControl
              type="number"
              placeholder="Points"
              min="0"
              value={lessonPoints}
              onChange={(e) => setLessonPoints(parseInt(e.target.value) || 0)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLessonModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveLesson}
            disabled={!lessonName.trim()}
          >
            {currentLessonId ? "Update Item" : "Add Item"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
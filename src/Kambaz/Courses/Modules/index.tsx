// src/Kambaz/Courses/Modules/index.tsx
import { useState, useEffect } from "react";
import { 
  FaChevronRight, 
  FaChevronDown, 
  FaEdit, 
  FaPlus, 
  FaEllipsisV,
  FaCheck,
  FaFileAlt,
  FaTrash
} from "react-icons/fa";
import { 
  Button, 
  FormControl, 
  Alert
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addModule,
  setModules,
  deleteModule,
  updateModule
} from "./reducer";
import * as coursesClient from "../client";

interface ModulesProps {
  courseId: string | undefined;
}

interface Lesson {
  _id: string;
  name: string;
  description?: string;
  module: string;
  published?: boolean;
}

interface Module {
  _id: string;
  name: string;
  course: string;
  description?: string;
  lessons?: Lesson[];
  editing?: boolean;
  published?: boolean;
}

export default function Modules(props: ModulesProps) {
  const { courseId } = props;
  const { cid } = useParams<{ cid?: string }>();
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<{[key: string]: boolean}>({});
  
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
        const fetchedModules = await coursesClient.findModulesForCourse(
          courseIdToUse as string
        );
        dispatch(setModules(fetchedModules));
        
        // Initialize all modules as collapsed
        const initialExpandState: {[key: string]: boolean} = {};
        fetchedModules.forEach((module: Module) => {
          initialExpandState[module._id] = false;
        });
        setExpandedModules(initialExpandState);
      }
    } catch (error) {
      setError("Failed to fetch modules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const createModuleForCourse = async () => {
    const courseIdToUse = courseId || cid;
    if (!courseIdToUse || !moduleName.trim()) return;
    
    try {
      setError(null);
      const newModule = {
        name: moduleName,
        description: moduleDescription,
        course: courseIdToUse,
        _id: `M${Date.now()}`
      };
      
      const module = await coursesClient.createModuleForCourse(courseIdToUse, newModule);
      dispatch(addModule(module));
      setModuleName("");
      setModuleDescription("");
      
      // Expand the newly created module
      setExpandedModules(prev => ({
        ...prev,
        [module._id]: true
      }));
    } catch (error) {
      setError("Failed to create module. Please try again.");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      // API call to delete would go here
      // await coursesClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    } catch (error) {
      setError("Failed to delete module. Please try again.");
    }
  };
  
  // Function to demonstrate use of updateModule
  const handleUpdateModule = (module: Module) => {
    // This would be used when implementing edit functionality
    dispatch(updateModule({...module}));
  };

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const expandAll = () => {
    const allExpanded: {[key: string]: boolean} = {};
    modules.forEach((module: Module) => {
      allExpanded[module._id] = true;
    });
    setExpandedModules(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed: {[key: string]: boolean} = {};
    modules.forEach((module: Module) => {
      allCollapsed[module._id] = false;
    });
    setExpandedModules(allCollapsed);
  };

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
          <div className="d-flex justify-content-end mb-3">
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={expandAll}
            >
              Expand All
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={collapseAll}
            >
              Collapse All
            </Button>
          </div>
          
          {isFaculty && (
            <div className="d-flex mb-3">
              <div className="flex-grow-1 me-2">
                <FormControl
                  placeholder="New Module Name"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="mb-2"
                />
                <FormControl
                  as="textarea"
                  rows={2}
                  placeholder="Module Description (optional)"
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                />
              </div>
              <div className="d-flex align-items-end">
                <Button
                  variant="danger"
                  onClick={createModuleForCourse}
                  disabled={!moduleName.trim()}
                >
                  <FaPlus className="me-2" /> Add Module
                </Button>
              </div>
            </div>
          )}
          
          {modules && modules.length > 0 ? (
            modules.map((module: Module) => (
              <div className="mb-3" key={module._id}>
                <div 
                  className="p-2 bg-light d-flex align-items-center border rounded cursor-pointer"
                  onClick={() => toggleModuleExpand(module._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {expandedModules[module._id] ? (
                    <FaChevronDown className="me-2" />
                  ) : (
                    <FaChevronRight className="me-2" />
                  )}
                  <h6 className="mb-0 flex-grow-1">{module.name}</h6>
                  
                  {isFaculty && (
                    <div className="d-flex">
                      <Button 
                        variant="link" 
                        className="text-primary p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedModule = {
                            ...module, 
                            name: prompt("Enter new module name", module.name) || module.name
                          };
                          handleUpdateModule(updatedModule);
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-danger p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module._id);
                        }}
                      >
                        <FaTrash />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-muted p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Using FaEllipsisV for additional options
                          const updatedModule = {
                            ...module, 
                            published: !module.published
                          };
                          handleUpdateModule(updatedModule);
                        }}
                      >
                        <FaEllipsisV />
                      </Button>
                    </div>
                  )}
                </div>
                
                {expandedModules[module._id] && (
                  <>
                    {module.description && (
                      <div className="ps-4 pt-2 pb-1 border-start border-end border-bottom text-muted">
                        {module.description}
                      </div>
                    )}
                    
                    {isFaculty && (
                      <div className="ps-4 pt-2 pb-2 border-start border-end border-bottom">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            // Add lesson functionality would go here
                            console.log("Add lesson to module:", module._id);
                          }}
                        >
                          <FaPlus className="me-1" /> Add Lesson
                        </Button>
                      </div>
                    )}
                    
                    {module.lessons && module.lessons.length > 0 ? (
                      <div className="border-start border-end border-bottom rounded-bottom">
                        {module.lessons
                          .filter(lesson => isFaculty || lesson.published)
                          .map((lesson: Lesson) => (
                            <div 
                              key={lesson._id} 
                              className="d-flex align-items-center p-2 border-top"
                            >
                              <div className="d-flex align-items-center flex-grow-1">
                                <FaFileAlt className="ms-3 me-2 text-muted" />
                                <div>
                                  <div>{lesson.name}</div>
                                  {lesson.description && (
                                    <div className="small text-muted">{lesson.description}</div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="d-flex align-items-center">
                                {lesson.published && (
                                  <FaCheck className="text-success me-3" />
                                )}
                                
                                {isFaculty && (
                                  <div className="d-flex">
                                    <Button variant="link" className="text-primary p-1">
                                      <FaEdit />
                                    </Button>
                                    <Button variant="link" className="text-danger p-1">
                                      <FaTrash />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="border-start border-end border-bottom p-3 text-muted">
                        No items in this module
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="alert alert-info">
              No modules found for this course. {isFaculty && "Add a new module to get started."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
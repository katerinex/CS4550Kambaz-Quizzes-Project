// src/Kambaz/Courses/Home/index.tsx
import { useParams } from "react-router-dom";
import Modules from "../Modules";
import CourseStatus from "./Status";

export default function Home() {
  const { cid } = useParams<{ cid?: string }>();
  
  return (
    <div className="d-flex" id="wd-home">
      {/* Removed CourseNavigation from here since it's now in the parent Courses component */}
      <div className="flex-fill me-3">
        <Modules courseId={cid} />
      </div>
      <div className="d-none d-xl-block">
        {cid && (
          <CourseStatus courseId={cid} />
        )}
      </div>
    </div>
  );
}
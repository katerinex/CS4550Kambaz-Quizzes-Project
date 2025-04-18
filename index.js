// index.js
import "dotenv/config";
import express from "express";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import session from "express-session";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import mongoose from "mongoose";
import Hello from "./Hello.js";
import SessionController from "./Lab5/SessionController.js";
import QuizRoutes from "./Kambaz/Quizzes/routes.js"; 

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();

// Enable trust proxy in production environments (still needed for cookies)
app.set('trust proxy', process.env.TRUST_PROXY === '1' ? 1 : 0);

// Multiple origins CORS configuration
const FRONTEND_URLS = [
  process.env.NETLIFY_URL,
  "https://jovial-elf-866e6f.netlify.app", 
  "https://venerable-taffy-a8e7f0.netlify.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
 
].filter(Boolean);

// CORS middleware - essential for cross-domain operation
app.use(
  cors({
    credentials: true,
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (FRONTEND_URLS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow unknown origins
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200 
  })
);

// Session configuration - essential for user authentication
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
};

// Production cookie settings - essential for cross-domain cookies
if (process.env.NODE_ENV !== "development") {
  sessionOptions.cookie = {
    httpOnly: true,
    sameSite: "none",
    secure: true
  };
}

app.use(session(sessionOptions));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
Hello(app);
SessionController(app);
QuizRoutes(app);

// Simplified auth check endpoint - needed for frontend auth verification
app.get("/api/auth-status", (req, res) => {
  res.json({
    isAuthenticated: !!req.session?.currentUser,
    user: req.session?.currentUser ? {
      id: req.session.currentUser._id,
      username: req.session.currentUser.username,
      role: req.session.currentUser.role
    } : null
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

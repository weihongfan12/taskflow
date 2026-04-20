import { Router } from "express";
import { register, login, logout, getCurrentUser } from "../controllers/authController";
import { getTasks, createTask, updateTask, deleteTask, completeTask, updateUserSettings } from "../controllers/taskController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateJWT, getCurrentUser);

// Task routes (protected)
router.use(authenticateJWT);

router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);
router.patch("/tasks/:id/complete", completeTask);

// User settings
router.patch("/settings", updateUserSettings);

export default router;

import { Request, Response } from "express";
import prisma from "../prisma";
import { Priority } from "../types/task";

const getUser = (req: Request) => {
  return (req as any).userId as string | undefined;
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = getUser(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = getUser(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { title, priority = "MEDIUM", dueDate, tags = [] } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        priority: priority as Priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: tags as string[],
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUser(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { title, priority, dueDate, tags, completed } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title ?? existingTask.title,
        priority: priority ? (priority as any) : existingTask.priority,
        dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
        tags: tags !== undefined ? tags : existingTask.tags,
        completed: completed ?? existingTask.completed,
        completedAt: completed ? new Date() : existingTask.completedAt,
      },
    });

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUser(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUser(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    res.json(task);
  } catch (error) {
    console.error("Complete task error:", error);
    res.status(500).json({ error: "Failed to complete task" });
  }
};

export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = getUser(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { workDuration, breakDuration } = req.body;

    res.json({ message: "Settings updated" });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};

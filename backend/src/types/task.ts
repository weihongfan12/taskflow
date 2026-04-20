export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  isGuest: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  priority: Priority;
  dueDate?: Date | null;
  tags: string[];
  completed: boolean;
  createdAt: Date;
  completedAt?: Date | null;
}

export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface TaskCreateData {
  title: string;
  priority?: Priority;
  dueDate?: string;
  tags?: string[];
}

export interface TaskUpdateData {
  title?: string;
  priority?: Priority;
  dueDate?: string;
  tags?: string[];
  completed?: boolean;
}

export interface UserSettings {
  workDuration?: number;
  breakDuration?: number;
}

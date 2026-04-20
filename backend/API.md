# TaskFlow Backend API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Username"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Username",
    "isGuest": false
  },
  "token": "jwt-token"
}
```

### POST /auth/login
Login user and get token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Username",
    "isGuest": false
  },
  "token": "jwt-token"
}
```

### POST /auth/logout
Logout user (token blacklisted).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### GET /auth/me
Get current user info (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Username",
  "avatar": "url|null",
  "bio": "string|null",
  "isGuest": false,
  "createdAt": "ISO timestamp"
}
```

## Tasks

All task endpoints require authentication.

### GET /tasks
Get all user tasks.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "title": "Task title",
    "priority": "HIGH|MEDIUM|LOW",
    "dueDate": "YYYY-MM-DD|null",
    "tags": ["tag1", "tag2"],
    "completed": false,
    "createdAt": "ISO timestamp",
    "completedAt": "ISO timestamp|null"
  }
]
```

### POST /tasks
Create a new task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Task title",
  "priority": "MEDIUM",
  "dueDate": "YYYY-MM-DD",
  "tags": ["tag1", "tag2"]
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Task title",
  "priority": "MEDIUM",
  "dueDate": "YYYY-MM-DD|null",
  "tags": ["tag1", "tag2"],
  "completed": false,
  "createdAt": "ISO timestamp",
  "completedAt": "ISO timestamp|null"
}
```

### PUT /tasks/:id
Update a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated title",
  "priority": "HIGH",
  "dueDate": "YYYY-MM-DD",
  "tags": ["tag1"],
  "completed": true
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Updated title",
  "priority": "HIGH",
  "dueDate": "YYYY-MM-DD|null",
  "tags": ["tag1"],
  "completed": false,
  "createdAt": "ISO timestamp",
  "completedAt": "ISO timestamp|null"
}
```

### DELETE /tasks/:id
Delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

### PATCH /tasks/:id/complete
Mark task as completed.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Task title",
  "priority": "MEDIUM",
  "dueDate": "YYYY-MM-DD|null",
  "tags": ["tag1", "tag2"],
  "completed": true,
  "createdAt": "ISO timestamp",
  "completedAt": "ISO timestamp"
}
```

## Statistics

### GET /stats/today
Get today's statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "todayTasks": 5,
  "todayPomodoros": 12,
  "completedTasks": 3
}
```

### GET /stats/week
Get this week's statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "date": "Mon 04",
    "tasks": 5,
    "pomodoros": 12
  },
  {
    "date": "Tue 03",
    "tasks": 3,
    "pomodoros": 8
  }
  // ... 5 more days
]
```

## Settings

### PATCH /settings
Update user settings (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "workDuration": 25,
  "breakDuration": 5
}
```

**Response (200):**
```json
{
  "message": "Settings updated"
}
```

## Health Check

### GET /health
Check server health status.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2026-04-20T18:30:00.000Z"
}
```

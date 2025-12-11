# API Overview

Below is a simple explanation of how users, modules, and tasks interact in the StudyHub backend.

## User Routes (/api/users)

### POST /api/users/register

Creates a new user.

Request Body:

{
"name": "Alice",
"email": "alice@example.com",
"password": "123456"
}

### POST /api/users/login

Logs a user in and returns a JWT.

Request Body:

{
"email": "alice@example.com",
"password": "123456"
}

Sample Response:

{
"token": "jwt-token-here",
"user": {
"id": "USER_ID",
"name": "Alice",
"email": "alice@example.com"
}
}

### Module Routes (/api/modules)

All module routes require a valid JWT in the header:

Authorization: Bearer <token>

### GET /api/modules

Returns all modules belonging to the authenticated user.

### POST /api/modules

Creates a new module.

Request Body:

{
"name": "React Deep Dive",
"description": "Week-long review of React and hooks"
}

Sample Response:

{
"\_id": "MODULE_ID",
"name": "React Deep Dive",
"description": "Week-long review of React and hooks",
"user": "USER_ID"
}

### PUT /api/modules/:moduleId

Updates an existing module.

Request Body Example:

{
"name": "Backend Review",
"description": "Focus on Express, MongoDB, and auth"
}

### DELETE /api/modules/:moduleId

Deletes a module and its nested tasks.

Task Routes (/api/modules/:moduleId/tasks)

Tasks belong to a specific module.
All task routes require a valid JWT.

### GET /api/modules/:moduleId/tasks

Returns all study tasks inside the module.

Sample Response:

[
{
"_id": "TASK_ID",
"title": "Re-watch React Router lesson",
"description": "Go over protected routes and nested routes",
"status": "To Do",
"module": "MODULE_ID"
}
]

### POST /api/modules/:moduleId/tasks

Creates a new task.

Request Body:

{
"title": "Practice Mongo queries",
"description": "Use Compass and shell to write queries",
"status": "To Do"
}

### PUT /api/modules/:moduleId/tasks/:taskId

Updates a task.

Request Body Example:

{
"title": "Practice Mongo queries",
"description": "Focus on aggregation pipeline",
"status": "In Progress"
}

### DELETE /api/modules/:moduleId/tasks/:taskId

Deletes a task.

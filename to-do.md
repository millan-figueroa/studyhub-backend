# StudyHub Backend – To-do

---

## 1. Backend – Setup & Infrastructure

- [x] Create `studyhub-backend` project (if not already)
- [x] `npm init -y`
- [x] Install dependencies
  - [x] `express`
  - [x] `mongoose`
  - [x] `dotenv`
  - [x] `bcryptjs`
  - [x] `jsonwebtoken`
  - [x] `cors`
  - [x] `nodemon` (dev)
- [x] Create `.gitignore`
  - [x] Ignore `node_modules/`
  - [x] Ignore `.env`
- [x] Create `.env`
  - [x] `PORT=3001`
  - [x] `MONGO_URI=...`
  - [x] `JWT_SECRET=...`
- [x] Set up folder structure
  - [x] `/config/connection.js`
  - [ ] `/config/passport.js` (GitHub OAuth – stretch)
  - [x] `/models/Module.js`
  - [x] `/models/Task.js`
  - [x] `/models/User.js`
  - [x] `/routes`
  - [x] `/controllers/moduleController.js`
  - [x] `/controllers/userController.js`
  - [x] `/middleware/auth.js`
  - [x] `server.js`
- [x] Implement MongoDB connection in `/config/connection.js`
  - [x] Export an async `connectDB` (or similar) that uses `mongoose.connect(process.env.MONGO_URI)`
  - [x] Log success message
- [x] Import and call `connectDB()` in `server.js`
- [x] Enable middleware in `server.js`
  - [x] `express.json()`
  - [x] `cors()`
- [x] Add health check route `GET /api/health`

---

## 2. Backend – Data Models (StudyHub)

- [x] `models/User.js`
  - [x] Fields: `name`, `email`, `password`,`role`
  - [x] `email` unique
  - [x] Pre-save hook hashing password with `bcryptjs`
- [x] `models/Module.js`
  - [x] Fields:
    - [x] `title` or `name` (module/course name)
    - [x] `description`
    - [x] `owner` (ObjectId, ref `User`, required)
- [x] `models/Task.js`
  - [x] Fields:
    - [x] `title`
    - [x] `description`
    - [x] `status` (`"To Do"`, `"In Progress"`, `"Done"`)
    - [x] `module` (ObjectId, ref `Module`, required)

---

## 3. Backend – Auth API

- [x] `controllers/userController.js`
  - [x] `registerUser` – `POST /api/users/register`
    - [x] Validate input
    - [x] Check for existing user by email
    - [x] Create user (password hashed via model)
    - [x] Sign JWT with user id
    - [x] Return `{ token, user }`
  - [x] `loginUser` – `POST /api/users/login`
    - [x] Find user by email
    - [x] Compare password with hash
    - [x] On success, sign JWT
    - [x] Return `{ token, user }`
- [x] `routes/userRoutes.js`
  - [x] `POST /api/users/register` → `registerUser`
  - [x] `POST /api/users/login` → `loginUser`
- [x] `middleware/auth.js`
  - [x] Read `Authorization: Bearer <token>`
  - [x] Verify JWT using `JWT_SECRET`
  - [x] Attach `req.user = { id: decoded.id }`
  - [x] Respond with `401` if missing/invalid
- [x] Mount `userRoutes` in `server.js` under `/api/users`

---

## 4. Backend – Modules API

- [x] `controllers/taskController.js`
  - [x] `getTasksForModule` – `GET /api/modules/:moduleId/tasks`
    - [x] Verify module exists
    - [x] Ensure `module.owner === req.user.id`
    - [x] Return tasks for that module
  - [x] `createTask` – `POST /api/modules/:moduleId/tasks`
    - [x] Verify ownership of parent module
    - [x] Create task with `module = moduleId`
  - [x] `updateTask` – `PUT /api/tasks/:taskId`
    - [x] Find task by `taskId`
    - [x] Find/populate parent module
    - [x] Ensure `module.owner === req.user.id`
    - [x] Update title/description/status
  - [x] `deleteTask` – `DELETE /api/tasks/:taskId`
    - [x] Same ownership process as update
    - [x] Delete task
- [x] `routes/taskRoutes.js`
  - [x] `GET /api/modules/:moduleId/tasks`
  - [x] `POST /api/modules/:moduleId/tasks`
  - [x] `PUT /api/tasks/:taskId`
  - [x] `DELETE /api/tasks/:taskId`
  - [x] Protect all routes with `auth` middleware
- [x] Mount `taskRoutes` in `server.js` (e.g. at `/api` or `/api/tasks` + nested)

---

## 5. Backend – Tasks API (Nested & Secure)

- [x] Create `controllers/taskController.js`
  - [x] `getTasksFormodule` – `GET /api/modules/:moduleId/tasks`
    - [x] Verify module exists
    - [x] Ensure `module.owner === req.user.id`
    - [x] Return tasks for that module
  - [x] `createTask` – `POST /api/modules/:moduleId/tasks`
    - [x] Verify ownership of parent module
    - [x] Create task with `project = moduleId`
  - [x] `updateTask` – `PUT /api/tasks/:taskId`
    - [x] Find task by `taskId`
    - [x] Populate or fetch parent module
    - [x] Ensure `module.owner === req.user.id`
    - [x] Update title/description/status
  - [x] `deleteTask` – `DELETE /api/tasks/:taskId`
    - [x] Same ownership process as update
    - [x] Delete task
- [x] Create `routes/taskRoutes.js`
  - [x] `GET /api/modules/:moduleId/tasks`
  - [x] `POST /api/modules/:moduleId/tasks`
  - [x] `PUT /api/tasks/:taskId`
  - [x] `DELETE /api/tasks/:taskId`
  - [x] Protect all with `authMiddleware`
- [x] Mount `taskRoutes` in `server.js` (e.g., `/api`)

---

## 5A. Backend – Optional GitHub OAuth (Stretch)

- [ ] `config/passport.js` already present
  - [ ] Ensure it requires `User` model
  - [ ] Uses `GitHubStrategy` with `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`
- [ ] In `server.js`
  - [ ] `require('./config/passport')`
  - [ ] `app.use(passport.initialize())`
- [ ] Add routes (e.g. in `routes/userRoutes.js`)
  - [ ] `GET /api/users/auth/github` → `passport.authenticate('github', { scope: ['user:email'] })`
  - [ ] `GET /api/users/auth/github/callback` → GitHub callback, issue JWT for the user
- [ ] Test GitHub login flow (optional for capstone)

---

## 6. Backend – Testing & Hardening

- [ ] Test auth, modules, and tasks with Postman/Insomnia
  - [ ] No-token requests → `401`
  - [ ] User A cannot access User B’s modules/tasks → `403` or `404`
- [ ] `README.md` (backend)
  - [ ] StudyHub description
  - [ ] Setup instructions
  - [ ] API endpoints (users, modules, tasks)
- [ ] Ensure `.env` is not committed
- [ ] Push backend changes to GitHub

---

## 7. Backend – Docs & Repo

- [ ] `README.md` for backend
  - [ ] Short description of StudyHub
  - [ ] Tech stack (Node, Express, MongoDB, JWT)
  - [ ] How to run locally
  - [ ] API endpoints (auth, courses, tasks)
- [ ] Ensure `.env` is NOT committed
- [ ] Push latest backend code to GitHub

---

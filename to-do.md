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
- [ ] `models/Module.js`
  - [ ] Fields:
    - [ ] `title` or `name` (module/course name)
    - [ ] `description`
    - [ ] `owner` (ObjectId, ref `User`, required)
- [ ] `models/Task.js`
  - [ ] Fields:
    - [ ] `title`
    - [ ] `description`
    - [ ] `status` (`"To Do"`, `"In Progress"`, `"Done"`)
    - [ ] `module` (ObjectId, ref `Module`, required)

---

## 3. Backend – Auth API

- [ ] `controllers/userController.js`
  - [ ] `registerUser` – `POST /api/users/register`
    - [ ] Validate input
    - [ ] Check for existing user by email
    - [ ] Create user (password hashed via model)
    - [ ] Sign JWT with user id
    - [ ] Return `{ token, user }`
  - [ ] `loginUser` – `POST /api/users/login`
    - [ ] Find user by email
    - [ ] Compare password with hash
    - [ ] On success, sign JWT
    - [ ] Return `{ token, user }`
- [ ] `routes/userRoutes.js`
  - [ ] `POST /api/users/register` → `registerUser`
  - [ ] `POST /api/users/login` → `loginUser`
- [ ] `middleware/auth.js`
  - [ ] Read `Authorization: Bearer <token>`
  - [ ] Verify JWT using `JWT_SECRET`
  - [ ] Attach `req.user = { id: decoded.id }`
  - [ ] Respond with `401` if missing/invalid
- [ ] Mount `userRoutes` in `server.js` under `/api/users`

---

## 4. Backend – Modules API

- [ ] `controllers/taskController.js`
  - [ ] `getTasksForModule` – `GET /api/modules/:moduleId/tasks`
    - [ ] Verify module exists
    - [ ] Ensure `module.owner === req.user.id`
    - [ ] Return tasks for that module
  - [ ] `createTask` – `POST /api/modules/:moduleId/tasks`
    - [ ] Verify ownership of parent module
    - [ ] Create task with `module = moduleId`
  - [ ] `updateTask` – `PUT /api/tasks/:taskId`
    - [ ] Find task by `taskId`
    - [ ] Find/populate parent module
    - [ ] Ensure `module.owner === req.user.id`
    - [ ] Update title/description/status
  - [ ] `deleteTask` – `DELETE /api/tasks/:taskId`
    - [ ] Same ownership process as update
    - [ ] Delete task
- [ ] `routes/taskRoutes.js`
  - [ ] `GET /api/modules/:moduleId/tasks`
  - [ ] `POST /api/modules/:moduleId/tasks`
  - [ ] `PUT /api/tasks/:taskId`
  - [ ] `DELETE /api/tasks/:taskId`
  - [ ] Protect all routes with `auth` middleware
- [ ] Mount `taskRoutes` in `server.js` (e.g. at `/api` or `/api/tasks` + nested)

---

## 5. Backend – Tasks API (Nested & Secure)

- [ ] Create `controllers/taskController.js`
  - [ ] `getTasksFormodule` – `GET /api/modules/:moduleId/tasks`
    - [ ] Verify module exists
    - [ ] Ensure `module.owner === req.user.id`
    - [ ] Return tasks for that module
  - [ ] `createTask` – `POST /api/modules/:moduleId/tasks`
    - [ ] Verify ownership of parent module
    - [ ] Create task with `project = moduleId`
  - [ ] `updateTask` – `PUT /api/tasks/:taskId`
    - [ ] Find task by `taskId`
    - [ ] Populate or fetch parent module
    - [ ] Ensure `module.owner === req.user.id`
    - [ ] Update title/description/status
  - [ ] `deleteTask` – `DELETE /api/tasks/:taskId`
    - [ ] Same ownership process as update
    - [ ] Delete task
- [ ] Create `routes/taskRoutes.js`
  - [ ] `GET /api/modules/:moduleId/tasks`
  - [ ] `POST /api/modules/:moduleId/tasks`
  - [ ] `PUT /api/tasks/:taskId`
  - [ ] `DELETE /api/tasks/:taskId`
  - [ ] Protect all with `authMiddleware`
- [ ] Mount `taskRoutes` in `server.js` (e.g., `/api`)

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

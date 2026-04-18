# backend4

`backend4` is a full-stack task and post management project with:

- A Node.js + Express + MongoDB backend API
- A React + Vite frontend
- JWT-based authentication
- Protected todo, post, comment, and like features

The repository contains both the backend and the frontend in one place:

- Backend: repo root
- Frontend: `frontend/todo`

## Project Overview

This project lets users:

- Register and log in
- Create and manage their own todos
- Create, edit, delete, and search posts
- Add comments and replies on posts
- Like posts and comments

Authentication is handled with JWT tokens. The frontend stores the access token in `localStorage` and sends it in the `Authorization` header for protected routes.

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv
- cors

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

## Repository Structure

```text
backend4/
├── controllers/          # Backend route handlers
├── db/                   # MongoDB connection
├── middlewares/          # Auth middleware
├── models/               # Mongoose models
├── routes/               # Express route definitions
├── src/                  # Backend app entry point
├── utils/                # API helpers and async handler
├── frontend/
│   └── todo/             # React + Vite frontend
├── .env.example          # Backend env example
├── package.json          # Backend package.json
└── README.md             # Project documentation
```

## Features

### Authentication

- User registration
- User login
- Protected user routes
- JWT access token support

### Todos

- Create todo
- Get all todos for logged-in user
- Get a single todo
- Update todo status/details
- Delete todo

### Posts

- Create post
- Get all posts
- Get posts by user
- Search posts
- Update post
- Delete post
- Like or unlike post

### Comments

- Create comment on a post
- Get comments for a post
- Reply to comments
- Like or unlike comments
- Update comment
- Delete comment

## Backend Setup

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Create the backend environment file

Create a `.env` file in the project root by copying `.env.example`.

Example:

```env
PORT=8000
MONGOOSE_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

### 3. Run the backend

```bash
npm run dev
```

The backend runs from:

```text
http://localhost:8000
```

## Frontend Setup

### 1. Move into the frontend folder

```bash
cd frontend/todo
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Create the frontend environment file

Create `frontend/todo/.env` if you want to define the API URL explicitly for local development.

Example:

```env
VITE_API_URL=http://localhost:8000
```

Note:

- This frontend variable is optional in local development because the app already falls back to `http://localhost:8000`
- Do not put secrets in the frontend `.env`
- Anything starting with `VITE_` is visible in the browser

### 4. Run the frontend

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

## Running the Project Locally

Open two terminals.

### Terminal 1: backend

From the project root:

```bash
npm install
npm run dev
```

### Terminal 2: frontend

From `frontend/todo`:

```bash
npm install
npm run dev
```

After both are running:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

## Environment Variables

### Backend `.env`

Required backend environment variables:

| Variable | Description |
| --- | --- |
| `PORT` | Port used by the backend locally |
| `MONGOOSE_URI` | MongoDB connection string |
| `CORS_ORIGIN` | Allowed frontend origin |
| `ACCESS_TOKEN_SECRET` | Secret used to sign access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry time |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry time |

### Frontend `.env`

Optional frontend environment variables:

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend base URL used by the frontend |

## API Base URL

When running locally:

```text
http://localhost:8000/api/v1
```

## Main API Routes

### User routes

Base path:

```text
/api/v1/users
```

Routes:

- `POST /register`
- `POST /login`
- `POST /logout`
- `GET /me`
- `GET /:userId`

### Todo routes

Base path:

```text
/api/v1
```

Routes:

- `POST /mytodos`
- `GET /mytodos`
- `GET /mytodos/:id`
- `PUT /mytodos/:id`
- `DELETE /mytodos/:id`

### Post routes

Base path:

```text
/api/v1/posts
```

Routes:

- `POST /createPost`
- `GET /getallpost`
- `GET /search`
- `GET /:postId`
- `PUT /like/:postId`
- `PUT /:postId`
- `DELETE /:postId`
- `GET /user/:userId`

### Comment routes

Base path:

```text
/api/v1/comments
```

Routes:

- `POST /createcomment`
- `GET /post/:postId`
- `PUT /like/:commentId`
- `POST /reply/:postId`
- `GET /comments/replies/:commentId`
- `GET /comments/user/:userId`
- `PUT /:commentId`
- `DELETE /:commentId`

## Authentication Notes

- Protected routes expect an `Authorization` header
- Format:

```text
Authorization: Bearer <token>
```

- The frontend stores the token in `localStorage`
- The auth middleware verifies the token and loads the current user

## Build Commands

### Frontend production build

From `frontend/todo`:

```bash
npm run build
```

### Frontend preview build

```bash
npm run preview
```

### Backend production start

From the project root:

```bash
node src/index.js
```

## Deployment

This project is set up to be deployed with:

- Frontend on Vercel
- Backend on Render

### Deploy the backend on Render

Create a new Render Web Service and use:

- Runtime: `Node`
- Root Directory: repo root
- Build Command: `npm install`
- Start Command: `node src/index.js`

Add these environment variables in Render:

```env
MONGOOSE_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Deploy the frontend on Vercel

Import the same repo into Vercel and set:

- Framework Preset: `Vite`
- Root Directory: `frontend/todo`
- Build Command: `npm run build`
- Output Directory: `dist`

Add this environment variable in Vercel:

```env
VITE_API_URL=https://your-backend.onrender.com
```

### Recommended deployment order

1. Deploy the backend on Render
2. Copy the Render backend URL
3. Deploy the frontend on Vercel using that backend URL
4. Copy the Vercel frontend URL
5. Update Render `CORS_ORIGIN` with the Vercel URL
6. Redeploy the backend

## Important Security Notes

- Never commit your real `.env` file
- Keep backend secrets only in backend environment variables
- Never put secrets in frontend `.env`
- If secrets were ever pushed to GitHub, rotate them

## Common Problems

### Frontend cannot reach backend

Check:

- `VITE_API_URL` is correct in Vercel
- Backend is running on Render
- Render URL is active

### CORS error in browser

Check:

- `CORS_ORIGIN` in Render matches your exact Vercel frontend URL
- Backend has been redeployed after changing env variables

### Login or protected routes fail

Check:

- JWT secrets exist in backend env variables
- The frontend is sending the token in the `Authorization` header
- The user is logged in and token exists in `localStorage`

### MongoDB connection fails

Check:

- `MONGOOSE_URI` is correct
- MongoDB Atlas network access allows your deployment
- Database user credentials are valid

## Available Scripts

### Backend

```bash
npm run dev
```

### Frontend

From `frontend/todo`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Future Improvements

Some useful next improvements for this project could be:

- Add a backend `start` script to `package.json`
- Add automated tests
- Add API documentation with Swagger or Postman collection
- Add refresh-token flow on the frontend
- Improve error handling and validation messages
- Add role-based access control for admin-only actions

## Author

Created by `mahnish`.

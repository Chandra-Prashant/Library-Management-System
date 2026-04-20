# MERN Library Management System

A role-based Library Management System built using MongoDB, Express, React, and Node.js.

## Features
- **Admin**: Create staff accounts, set global fine rates, and set return periods.
- **Staff**: Add/Delete books, issue books to students, and view inventory.
- **Student**: Register, search for books, issue/return books, and view auto-calculated fines.

## Setup Instructions
1. **Clone the repo**: `git clone <your-repo-link>`
2. **Backend Setup**:
   - `cd backend`
   - `npm install`
   - Create a `.env` file with `MONGO_URI` and `PORT`.
   - Run `node server.js`.
3. **Frontend Setup**:
   - `cd frontend`
   - `npm install`
   - `npm start`.
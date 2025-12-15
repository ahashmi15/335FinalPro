CMSC335 Final Project — Daily Planner & Focus Tracker
Author: Arslan Hashmi
Course: CMSC335
Project: Final Web App
📝 Overview

This project is a daily task planner where users can:

Add tasks with a title, date, objectives, and duration

View all scheduled days

View tasks for a specific day

Run a countdown timer for any task

Mark tasks as Complete or Failed

Extend the timer with “Add More Time”

Load a motivational quote from a public API

All data is stored in MongoDB using Mongoose.

📌 Technologies

Node.js + Express

MongoDB Atlas + Mongoose

EJS templates

HTML/CSS/JavaScript

External API: ZenQuotes (motivational quote)

📁 File Structure
project/
│
├── mind.js                # Main server + routes
├── .env                   # MongoDB connection string
├── package.json
│
├── public/
│   ├── style.css
│   └── oneTask.js         # Timer + modal logic
│
└── views/
    ├── index.ejs
    ├── listDays.ejs
    ├── zoomOnDay.ejs
    └── oneTask.ejs

⚙️ Setup Instructions
1. Install dependencies
npm install

2. Create .env
MONGO_URI=<your connection string>
PORT=3000

3. Run the server
node mind.js


Visit:
http://localhost:3000

🗂️ Core Features (Matches Project Requirements)
✔️ At least 3 views using EJS

index.ejs

listDays.ejs

zoomOnDay.ejs

oneTask.ejs

✔️ Form submission

Users submit tasks via the form on index.ejs.

✔️ CRUD with MongoDB (Mongoose)

Create: Add task

Read: List days and tasks

Update: Mark task complete/fail

(Delete not required but can be added)

✔️ External API

ZenQuotes API fetches a motivational quote.

✔️ Static files

CSS + JS served from /public.

✔️ Routing & Redirects

Redirect to /list-days after adding tasks

Separate routes for days, tasks, and updates

🧠 MongoDB Schema
const taskSchema = new mongoose.Schema({
  title: String,
  date: String,
  hours: Number,
  minutes: Number,
  objectives: [String],
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

🔗 Key Routes
GET /

Home form

POST /load-tasks

Saves new task

GET /list-days

View all scheduled days

GET /tasks/:date

View tasks for selected day

GET /task/:id

Open the timer page

POST /task/:id/complete

Mark task complete

POST /task/:id/fail

Mark task failed

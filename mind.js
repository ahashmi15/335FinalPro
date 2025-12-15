require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// -------------------
// MONGOOSE SETUP
// -------------------
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
    objectives: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");

// Home page
app.get("/", (req, res) => {
    res.render("index");
});







app.post("/load-tasks", async (req, res) => {
    try {
        const { hours, minutes, date, title } = req.body;

        // Gather objectives into array
        const objectives = [];
        for (let i = 1; i <= 10; i++) {
            let val = req.body[`obj${i}`];
            if (val && val.trim() !== "") {
                objectives.push(val.trim());
            }
        }

        // Save task directly to DB
        const newTask = new Task({
            title,
            date,
            hours: Number(hours),
            minutes: Number(minutes),
            objectives
        });

        await newTask.save();

        console.log("TASK SAVED:", newTask);

        res.redirect("/list-days");


    } catch (err) {
        console.error("ERROR SAVING TASK:", err);
        res.status(500).send("Error saving task.");
    }
});



app.get("/list-days", async (req, res) => {
    try {
        // Get all DISTINCT dates that have tasks
        const dates = await Task.distinct("date");

        // Sort dates alphabetically (we can enhance later)
        dates.sort();

        res.render("listDays", { dates });

    } catch (err) {
        console.error("Error fetching dates:", err);
        res.status(500).send("Error loading scheduled days.");
    }
});





app.get("/tasks/:date", async (req, res) => {
    const selectedDate = req.params.date;

    try {
        const tasks = await Task.find({ date: selectedDate });
        res.render("zoomOnDay", { date: selectedDate, tasks });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Server error");
    }
});


app.get("/task/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).send("Task not found");
        }

        res.render("oneTask", { task });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
    


});










app.listen(3000, () => {
    console.log("Server running on port 3000");
});

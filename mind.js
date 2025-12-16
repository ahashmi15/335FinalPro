require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const https = require("https");

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
  objectives: [{ type: String }],
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": "TaskMove/1.0" } },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(raw);

            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(json);
            } else {
              reject(new Error(`HTTP ${res.statusCode} from ${url}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on("error", reject);
  });
}


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/load-tasks", async (req, res) => {
  try {
    const { hours, minutes, date, title } = req.body;

    const objectives = [];
    for (let i = 1; i <= 10; i++) {
      let val = req.body[`obj${i}`];
      if (val && val.trim() !== "") {
        objectives.push(val.trim());
      }
    }

    const newTask = new Task({
      title,
      date,
      hours: Number(hours),
      minutes: Number(minutes),
      objectives
    });

    await newTask.save();
    res.redirect("/list-days");
  } catch (err) {
    console.error("ERROR SAVING TASK:", err);
    res.status(500).send("Error saving task.");
  }
});

app.get("/list-days", async (req, res) => {
  try {
    const dates = await Task.distinct("date");
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
    if (!task) return res.status(404).send("Task not found");
    res.render("oneTask", { task });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/task/:id/complete", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    if (!task) return res.status(404).send("Task not found");
    res.redirect(`/tasks/${task.date}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/task/:id/fail", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "failed" },
      { new: true }
    );
    if (!task) return res.status(404).send("Task not found");
    res.redirect(`/tasks/${task.date}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


app.get("/api/quote", async (req, res) => {
  res.set("Cache-Control", "no-store");

  
  try {
    const dj = await getJson("https://dummyjson.com/quotes/random");
    return res.json({
      content: dj.quote,
      author: dj.author
    });
  } catch (e1) {
   
    try {
      const z = await getJson("https://zenquotes.io/api/random");
      const q = Array.isArray(z) ? z[0] : z;

      return res.json({
        content: q.q || "Stay focused. Keep going.",
        author: q.a || ""
      });
    } catch (e2) {
      console.error("SERVER QUOTE ERROR:", e1, e2);
      
      return res.json({
        content: "Stay focused. Keep pushing.",
        author: ""
      });
    }
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

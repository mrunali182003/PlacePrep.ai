require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const http = require("http");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err.message));

// ─── Models ──────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, default: "" },
  experience:{ type: String, default: "" },
  skills:    [String],
  resumeScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", UserSchema);

const InterviewSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role:      String,
  messages:  [{ from: String, text: String, score: Number }],
  avgScore:  Number,
  date:      { type: Date, default: Date.now },
});
const Interview = mongoose.model("Interview", InterviewSchema);

const ResumeSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score:       Number,
  skills:      [String],
  missing:     [String],
  suggestions: [String],
  date:        { type: Date, default: Date.now },
});
const Resume = mongoose.model("Resume", ResumeSchema);

// ─── Auth Middleware ──────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ─── Auth Routes ──────────────────────────────────────────────

// Register
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, experience } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, experience });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Get profile
app.get("/auth/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// ─── Helper: call Python AI service ──────────────────────────
function callPython(path, body, callback) {
  const data = JSON.stringify(body);
  const options = {
    hostname: "127.0.0.1", port: 5001, path,
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": data.length },
  };
  const req = http.request(options, (res) => {
    let result = "";
    res.on("data", chunk => result += chunk);
    res.on("end", () => {
      try { callback(null, JSON.parse(result)); }
      catch (e) { callback(e); }
    });
  });
  req.on("error", callback);
  req.write(data);
  req.end();
}

function forwardFileToPython(filePath, fileName, callback) {
  const boundary = "----FormBoundary" + Date.now();
  const fileData = fs.readFileSync(filePath);
  const header = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="${fileName}"\r\nContent-Type: application/pdf\r\n\r\n`
  );
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([header, fileData, footer]);
  const options = {
    hostname: "127.0.0.1", port: 5001, path: "/analyze",
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": body.length,
    },
  };
  const req = http.request(options, (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      try { callback(null, JSON.parse(data)); }
      catch (e) { callback(e); }
    });
  });
  req.on("error", callback);
  req.write(body);
  req.end();
}

// ─── Resume Routes ────────────────────────────────────────────
app.post("/analyze-resume", upload.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  forwardFileToPython(req.file.path, req.file.originalname, async (err, data) => {
    fs.unlinkSync(req.file.path);
    if (err) return res.status(500).json({ error: "Resume analysis failed" });

    // Save to DB if user is logged in
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await Resume.create({ userId: decoded.id, ...data });
        await User.findByIdAndUpdate(decoded.id, {
          resumeScore: data.score,
          skills: data.skills,
        });
      } catch {}
    }

    res.json(data);
  });
});

// Get resume history
app.get("/resume-history", auth, async (req, res) => {
  try {
    const history = await Resume.find({ userId: req.user.id })
      .sort({ date: -1 }).limit(10);
    res.json(history);
  } catch {
    res.status(500).json({ error: "Failed to get history" });
  }
});

// ─── Interview Routes ─────────────────────────────────────────
app.post("/interview", (req, res) => {
  callPython("/interview", req.body, (err, data) => {
    if (err) return res.status(500).json({ error: "Interview service failed" });
    res.json(data);
  });
});

// Save interview session
app.post("/interview/save", auth, async (req, res) => {
  try {
    const { role, messages, avgScore } = req.body;
    await Interview.create({ userId: req.user.id, role, messages, avgScore });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to save interview" });
  }
});

// Get interview history
app.get("/interview-history", auth, async (req, res) => {
  try {
    const history = await Interview.find({ userId: req.user.id })
      .sort({ date: -1 }).limit(10);
    res.json(history);
  } catch {
    res.status(500).json({ error: "Failed to get history" });
  }
});

// ─── Dashboard Stats ──────────────────────────────────────────
app.get("/dashboard-stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const interviews = await Interview.find({ userId: req.user.id });
    const resumes = await Resume.find({ userId: req.user.id });

    const avgScore = interviews.length
      ? (interviews.reduce((a, b) => a + (b.avgScore || 0), 0) / interviews.length).toFixed(1)
      : 0;

    res.json({
      name: user.name,
      resumeScore: user.resumeScore || 0,
      skills: user.skills || [],
      interviewCount: interviews.length,
      avgInterviewScore: avgScore,
      resumeCount: resumes.length,
    });
  } catch {
    res.status(500).json({ error: "Failed to get stats" });
  }
});

// ─── Code Runner ──────────────────────────────────────────────
app.post("/run-code", (req, res) => {
  const { code } = req.body;
  try {
    const logs = [];
    const fn = new Function("console", code);
    fn({ log: (...args) => logs.push(args.join(" ")) });
    res.json({ output: logs.join("\n") || "No output." });
  } catch (err) {
    res.json({ output: `Error: ${err.message}` });
  }
});

// ─── Job Recommendations ──────────────────────────────────────
app.get("/jobs", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const skills = user.skills?.join(",") || "javascript react";
    const role = user.role || "developer";

    // Using Adzuna free API
    const APP_ID = process.env.ADZUNA_APP_ID || "";
    const APP_KEY = process.env.ADZUNA_APP_KEY || "";

    if (!APP_ID || !APP_KEY) {
      // Return mock jobs if no API key
      return res.json(getMockJobs(role, skills));
    }

    const query = encodeURIComponent(`${role} ${skills.split(",")[0]}`);
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=8&what=${query}&where=india&content-type=application/json`;

    https.get(url, (apiRes) => {
      let data = "";
      apiRes.on("data", chunk => data += chunk);
      apiRes.on("end", () => {
        try {
          const json = JSON.parse(data);
          const jobs = json.results.map(j => ({
            title: j.title,
            company: j.company.display_name,
            location: j.location.display_name,
            salary: j.salary_min ? `₹${Math.round(j.salary_min/1000)}k - ₹${Math.round(j.salary_max/1000)}k` : "Not disclosed",
            url: j.redirect_url,
            type: j.contract_time || "Full-time",
          }));
          res.json(jobs);
        } catch {
          res.json(getMockJobs(role, skills));
        }
      });
    }).on("error", () => res.json(getMockJobs(role, skills)));

  } catch (err) {
    res.status(500).json({ error: "Failed to get jobs" });
  }
});

function getMockJobs(role, skills) {
  return [
    { title: `${role} - Fresher`, company: "TCS", location: "Pune", salary: "₹4L - ₹6L", type: "Full-time", url: "https://www.naukri.com" },
    { title: `Junior ${role}`, company: "Infosys", location: "Bangalore", salary: "₹5L - ₹8L", type: "Full-time", url: "https://www.naukri.com" },
    { title: `${role} Trainee`, company: "Wipro", location: "Hyderabad", salary: "₹3.5L - ₹5L", type: "Full-time", url: "https://www.naukri.com" },
    { title: `Associate ${role}`, company: "Cognizant", location: "Chennai", salary: "₹4L - ₹7L", type: "Full-time", url: "https://www.naukri.com" },
    { title: `${role} Intern`, company: "Startup (Series A)", location: "Remote", salary: "₹15k - ₹25k/mo", type: "Internship", url: "https://internshala.com" },
    { title: `${role}`, company: "HCL Technologies", location: "Noida", salary: "₹4.5L - ₹7L", type: "Full-time", url: "https://www.naukri.com" },
  ];
}

// Admin Stats
app.get("/admin-stats", auth, async (req, res) => {
  try {
    const totalUsers      = await User.countDocuments()
    const totalResumes    = await Resume.countDocuments()
    const totalInterviews = await Interview.countDocuments()
    const newUsersToday   = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
    })
    const allResumes    = await Resume.find()
    const allInterviews = await Interview.find()

    const avgResumeScore = allResumes.length
      ? Math.round(allResumes.reduce((a,b) => a + (b.score||0), 0) / allResumes.length)
      : 0

    const avgInterviewScore = allInterviews.length
      ? (allInterviews.reduce((a,b) => a + (b.avgScore||0), 0) / allInterviews.length).toFixed(1)
      : 0

    const recentUsers = await User.find()
      .sort({ createdAt: -1 }).limit(5)
      .select('-password')

    res.json({
      totalUsers,
      totalResumes,
      totalInterviews,
      newUsersToday,
      avgResumeScore,
      avgInterviewScore,
      activeToday: newUsersToday,
      recentUsers: recentUsers.map(u => ({
        name: u.name,
        email: u.email,
        role: u.role || 'Not set',
        resumeScore: u.resumeScore || 0,
        joined: timeAgo(u.createdAt),
      }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to get admin stats" })
  }
})

// Leaderboard — top users by resume score + interview score
app.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find({ resumeScore: { $gt: 0 } })
      .sort({ resumeScore: -1 }).limit(20).select('-password')

    const leaderboard = await Promise.all(users.map(async (u, i) => {
      const interviews = await Interview.find({ userId: u._id })
      const avgScore = interviews.length
        ? (interviews.reduce((a,b) => a + (b.avgScore||0), 0) / interviews.length).toFixed(1)
        : 0
      return {
        rank:       i + 1,
        name:       u.name,
        college:    u.experience || 'Student',
        score:      parseFloat(avgScore),
        interviews: interviews.length,
        resumeScore: u.resumeScore || 0,
        badge:      i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '',
      }
    }))

    res.json(leaderboard)
  } catch (err) {
    res.status(500).json({ error: "Failed to get leaderboard" })
  }
})

// My leaderboard rank
app.get("/my-rank", auth, async (req, res) => {
  try {
    const allUsers = await User.find({ resumeScore: { $gt: 0 } })
      .sort({ resumeScore: -1 }).select('_id')
    const rank = allUsers.findIndex(u => u._id.toString() === req.user.id) + 1
    res.json({ rank: rank || 'N/A' })
  } catch {
    res.status(500).json({ rank: 'N/A' })
  }
})

// Helper function — add this outside routes
function timeAgo(date) {
  if (!date) return 'Unknown'
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs/24)}d ago`
}


app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);
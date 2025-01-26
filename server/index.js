const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const initializeFirebase = require("./config/firebase");
const authRoutes = require("./routes/authRoutes");
const bmiRoutes = require("./routes/bmiRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const calorieTrackerRoutes = require("./routes/calorieTrackerRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");

dotenv.config();

// Initialize Firebase
initializeFirebase();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors({
  origin: [
    "https://fit-bite-frontend.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.options('*', cors());


app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tool", bmiRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/calorie-tracker", calorieTrackerRoutes);
app.use("/api", exerciseRoutes);





app.get("/", (req, res) => {
  res.json("Welcome to our Server");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

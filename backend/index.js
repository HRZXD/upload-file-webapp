require("dotenv").config();
const express = require("express");
const uploadRoute = require("./controller/routeUpload");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

// Route upload
app.use("/api/users", uploadRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

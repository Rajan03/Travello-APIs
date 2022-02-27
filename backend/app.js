const express = require("express");
const morgan = require("morgan");

// Routes Imports
const authRoutes = require("./routes/authRoutes")

// Global Error Class/ Middleware
const AppError = require("./utils/appError");
const errorMiddleware = require("./controllers/errorController");

// ENV variables
require("dotenv").config();

// Database
const connectDB = require("./config/db");
connectDB();

// Init App
const app = express();

// Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// JSON Setup and serve static files
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("*", (req, res, next) => {
    next(new AppError(404, `Can\'t find ${req.originalUrl} on this server!!`))
})

// Global error Middleware
app.use(errorMiddleware);

// Start Server
app.listen(process.env.PORT, () => console.log(`Server is up on ${process.env.PORT}!`));


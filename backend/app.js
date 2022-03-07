const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Routes Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const toursRoutes = require('./routes/toursRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Global Error Class/ Middleware
const AppError = require('./utils/appError');
const errorMiddleware = require('./controllers/errorController');

// ENV variables
require('dotenv').config();

// Database
const connectDB = require('./config/db');
connectDB();

// Init App
const app = express();

// GLOBAL MIDDLEWARES
// 1) Set security headers
app.use(helmet());

// 2) Morgan - development logs
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) Limiter - Returns fxn that limits 100 requests per hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Request limit exceeded.., please try after an hour!!',
});

// 4) sets some headers with limts
app.use('/api', limiter);

// 5) Body parser setup
app.use(express.json({ limit: '12kb' }));

// 6) Data Sanitization
// against NoSQL query injection - Using direct mongo query like {"$gt": ""} as email etc to login without email
app.use(mongoSanitize()); // Removes extra mongo operators

// against Cross side scripting (XSS)
app.use(xss()); // Clean malicious injection like html and js scripts

// 7) Prevents parameter pollution - cleans query string
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'price',
    ],
  })
);
// 8) serve static files
app.use(express.static(`${__dirname}/public`));

// 9) Setting request timing
app.use((req, res, next) => {
  req.requestTiming = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/tours', toursRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.use('*', (req, res, next) => {
  next(new AppError(404, `Can\'t find ${req.originalUrl} on this server!!`));
});

// Global error Middleware
app.use(errorMiddleware);

// Start Server
app.listen(process.env.PORT, () =>
  console.log(`Server is up on ${process.env.PORT}!`)
);

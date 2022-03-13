const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

dotenv.config({ path: './.env' });

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB CONNECTED!'))
  .catch((e) => console.log(e));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async (model, data) => {
  try {
    await model.create(data, { validateBeforeSave: false });
    console.log(`${data.length} Documents added!`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async (model) => {
  try {
    await model.deleteMany();
    console.log(`Data deleted!`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

switch (process.argv[2]) {
  case '--import':
    importData(Tour, tours);
    importData(User, users);
    importData(Review, reviews);
    break;
  case '--delete':
    deleteData(Tour);
    deleteData(User);
    deleteData(Review);
    break;
  case '--import-tours':
    importData(Tour, tours);
    break;
  case '--delete-tours':
    deleteData(Tour);
    break;
  case '--import-users':
    importData(User, users);
    break;
  case '--delete-users':
    deleteData(User);
    break;
  case '--import-reviews':
    importData(Review, reviews);
    break;
  case '--delete-reviews':
    deleteData(Review);
    break;

  default:
    break;
}

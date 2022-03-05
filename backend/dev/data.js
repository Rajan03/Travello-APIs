const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');

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

// IMPORT DATA INTO DB
const importData = async (model, data) => {
  try {
    await model.create(data);
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

// Tours Data
if (process.argv[2] === '--import-tours') {
  importData(Tour, tours);
} else if (process.argv[2] === '--delete-tours') {
  deleteData(Tour);
}
// Users Data
else if (process.argv[2] === '--import-users') {
  users.forEach((user) => {
    user.passwordConfirm = user.password;
  });
  importData(User, users);
} else if (process.argv[2] === '--delete-users') {
  deleteData(User);
}

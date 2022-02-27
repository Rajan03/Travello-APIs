const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MONGO DB CONNECTED!");
  } catch (err) {
    console.log("MONGO DB CONNECTION FAILED! 💥 ", err);

    process.exit(1);
  }
};

module.exports = connectDB;

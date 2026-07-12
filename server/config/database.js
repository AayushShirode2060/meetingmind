const mongoose = require("mongoose");

const connectDB = async () => {
  try {
   

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Connected!");
    
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
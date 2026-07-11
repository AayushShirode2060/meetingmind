const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("URI:", process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Connected!");
    console.log(conn.connection.readyState);
    console.log(conn.connection.host);
    console.log(conn.connection.name);
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
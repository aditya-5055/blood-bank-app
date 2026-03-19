const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/adminModel");

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB Connected");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      email: "admin@blood.com" 
    });

    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create({
      name: "Blood Donation Admin",
      email: "adinalkande7@gmail.com",
      password: "admin@123",
      role: "admin",
      isActive: true,
    });

    console.log("Admin created successfully!");
    console.log("Email    → adinalkande7@gmail.com");
    console.log("Password → admin@123");
    process.exit(0);

  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
const mongoose = require("mongoose");
const Facility = require("./models/facilityModel");
const Donor = require("./models/donorModel");
require("dotenv").config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB Connected ✅");

    // Clear all collections
    await Facility.deleteMany({});
    await Donor.deleteMany({});
    console.log("Old data cleared ✅");

    // ─────────────────────────────────
    // Create Blood Banks
    // ─────────────────────────────────
    await Facility.create([
      {
        name: "City Blood Bank",
        email: "city@bloodbank.com",
        password: "city@123",
        phone: "9876543230",
        emergencyContact: "9876543231",
        registrationNumber: "BB001",
        facilityType: "blood-bank",
        facilityCategory: "Government",
        status: "approved",
        isActive: true,
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001",
        },
        location: {
          type: "Point",
          coordinates: [73.8567, 18.5204],
        },
        operatingHours: {
          open: "09:00",
          close: "18:00",
        },
        is24x7: false,
      },
      {
        name: "Life Blood Bank",
        email: "life@bloodbank.com",
        password: "life@123",
        phone: "9876543232",
        emergencyContact: "9876543233",
        registrationNumber: "BB002",
        facilityType: "blood-bank",
        facilityCategory: "Private",
        status: "approved",
        isActive: true,
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411002",
        },
        location: {
          type: "Point",
          coordinates: [73.88, 18.54],
        },
        operatingHours: {
          open: "09:00",
          close: "18:00",
        },
        is24x7: false,
      },
      {
        name: "Mumbai Blood Bank",
        email: "mumbai@bloodbank.com",
        password: "mumbai@123",
        phone: "9876543234",
        emergencyContact: "9876543235",
        registrationNumber: "BB003",
        facilityType: "blood-bank",
        facilityCategory: "Private",
        status: "approved",
        isActive: true,
        address: {
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
        location: {
          type: "Point",
        coordinates: [72.8777, 19.0760],
        },
        operatingHours: {
          open: "09:00",
          close: "18:00",
        },
        is24x7: false,
      },
    ]);
    console.log("Blood Banks created ✅");

    // ─────────────────────────────────
    // Create Hospitals
    // ─────────────────────────────────
    await Facility.create([
      {
        name: "Ruby Hospital",
        email: "ruby@hospital.com",
        password: "ruby@123",
        phone: "9876543240",
        emergencyContact: "9876543241",
        registrationNumber: "H001",
        facilityType: "hospital",
        facilityCategory: "Private",
        status: "approved",
        isActive: true,
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001",
        },
        location: {
          type: "Point",
          coordinates: [73.8567, 18.5204],
        },
        operatingHours: {
          open: "00:00",
          close: "23:59",
        },
        is24x7: true,
      },
      {
        name: "Sahyadri Hospital",
        email: "sahyadri@hospital.com",
        password: "sahyadri@123",
        phone: "9876543242",
        emergencyContact: "9876543243",
        registrationNumber: "H002",
        facilityType: "hospital",
        facilityCategory: "Private",
        status: "approved",
        isActive: true,
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411004",
        },
        location: {
          type: "Point",
          coordinates: [73.88, 18.54],
        },
        operatingHours: {
          open: "00:00",
          close: "23:59",
        },
        is24x7: true,
      },
      {
        name: "Mumbai Hospital",
        email: "mumbai@hospital.com",
        password: "mumbaiH@123",
        phone: "9876543244",
        emergencyContact: "9876543245",
        registrationNumber: "H003",
        facilityType: "hospital",
        facilityCategory: "Government",
        status: "approved",
        isActive: true,
        address: {
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
        location: {
          type: "Point",
          coordinates: [72.8777, 19.076],
        },
        operatingHours: {
          open: "00:00",
          close: "23:59",
        },
        is24x7: true,
      },
    ]);
    console.log("Hospitals created ✅");

    // ─────────────────────────────────
    // Create Donors
    // ─────────────────────────────────
    await Donor.create([
      {
        fullName: "Aditya Nalkande",
        email: "aditya@gmail.com",
        password: "donor@123",
        phone: "9876543210",
        bloodGroup: "A+",
        age: 25,
        gender: "Male",
        weight: 70,
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001",
        },
        location: {
          type: "Point",
          coordinates: [73.8567, 18.5204],
        },
        isAvailable: true,
        eligibleToDonate: true,
      },
      {
        fullName: "sahil Nalkande",
        email: "sahil@gmail.com",
        password: "donor@123",
        phone: "9833456688",
        bloodGroup: "A+",
        age: 25,
        gender: "Male",
        weight: 70,
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001",
        },
        location: {
          type: "Point",
          coordinates: [73.8567, 18.5204],
        },
        isAvailable: true,
        eligibleToDonate: true,
      },
      {
        fullName: "Rahul Sharma",
        email: "rahul@gmail.com",
        password: "donor@123",
        phone: "9876543211",
        bloodGroup: "B+",
        age: 28,
        gender: "Male",
        weight: 75,
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411002",
        },
        location: {
          type: "Point",
          coordinates: [73.88, 18.54],
        },
        isAvailable: true,
        eligibleToDonate: true,
      },
      {
        fullName: "Priya Patel",
        email: "priya@gmail.com",
        password: "donor@123",
        phone: "9876543212",
        bloodGroup: "O+",
        age: 22,
        gender: "Female",
        weight: 55,
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411003",
        },
        location: {
          type: "Point",
          coordinates: [73.856, 18.52],
        },
        isAvailable: true,
        eligibleToDonate: true,
      },
      {
        fullName: "Amit Singh",
        email: "amit@gmail.com",
        password: "donor@123",
        phone: "9876543213",
        bloodGroup: "AB+",
        age: 30,
        gender: "Male",
        weight: 80,
        address: {
          city: "Pune",
          state: "Maharashtra",
          pincode: "411004",
        },
        location: {
          type: "Point",
          coordinates: [73.87, 18.53],
        },
        isAvailable: true,
        eligibleToDonate: true,
      },
    ]);
    console.log("Donors created ✅");

    console.log("Seed data created successfully! ✅");
    console.log("─────────────────────────────────");
    console.log("Blood Banks:");
    console.log("city@bloodbank.com / city@123");
    console.log("life@bloodbank.com / life@123");
    console.log("mumbai@bloodbank.com / mumbai@123");
    console.log("─────────────────────────────────");
    console.log("Hospitals:");
    console.log("ruby@hospital.com / ruby@123");
    console.log("sahyadri@hospital.com / sahyadri@123");
    console.log("mumbai@hospital.com / mumbaiH@123");
    console.log("─────────────────────────────────");
    console.log("Donors:");
    console.log("aditya@gmail.com / donor@123");
    console.log("rahul@gmail.com / donor@123");
    console.log("priya@gmail.com / donor@123");
    console.log("amit@gmail.com / donor@123");
    console.log("─────────────────────────────────");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedData();
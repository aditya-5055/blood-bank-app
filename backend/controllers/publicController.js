const Facility = require("../models/facilityModel");
const Camp = require("../models/campModel");

// ─────────────────────────────────────────────────────────
// GET PUBLIC BLOOD BANKS
// GET /api/public/blood-banks?city=pune
// ─────────────────────────────────────────────────────────
exports.getPublicBloodBanks = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = { facilityType: "blood-bank", status: "approved", isActive: true };
    if (city && city.trim() !== "") {
      filter["address.city"] = { $regex: new RegExp(city.trim(), "i") };
    }
    const bloodBanks = await Facility.find(filter).select(
      "name address phone operatingHours is24x7 facilityCategory"
    );
    return res.status(200).json({ success: true, count: bloodBanks.length, data: bloodBanks });
  } catch (error) {
    console.error("getPublicBloodBanks error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// ─────────────────────────────────────────────────────────
// GET PUBLIC HOSPITALS
// GET /api/public/hospitals?city=pune
// ─────────────────────────────────────────────────────────
exports.getPublicHospitals = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = { facilityType: "hospital", status: "approved", isActive: true };
    if (city && city.trim() !== "") {
      filter["address.city"] = { $regex: new RegExp(city.trim(), "i") };
    }
    const hospitals = await Facility.find(filter).select(
      "name address phone operatingHours is24x7 facilityCategory"
    );
    return res.status(200).json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error) {
    console.error("getPublicHospitals error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// ─────────────────────────────────────────────────────────
// FIND BLOOD
// GET /api/public/find-blood?city=pune&bloodGroup=B+
// ─────────────────────────────────────────────────────────
exports.findBlood = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = { status: "approved", isActive: true };
    if (city && city.trim() !== "") {
      filter["address.city"] = { $regex: new RegExp(city.trim(), "i") };
    }
    const facilities = await Facility.find(filter).select(
      "name facilityType address phone operatingHours is24x7 facilityCategory"
    );
    return res.status(200).json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    console.error("findBlood error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// ─────────────────────────────────────────────────────────
// GET PUBLIC CAMPS
// GET /api/public/camps?city=pune
// ─────────────────────────────────────────────────────────
exports.getPublicCamps = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = {
      status: { $in: ["upcoming", "ongoing"] },
      campDate: { $gte: new Date() },
    };
    if (city && city.trim() !== "") {
      filter["address.city"] = { $regex: new RegExp(city.trim(), "i") };
    }
    const camps = await Camp.find(filter)
      .populate("bloodBankId", "name phone address")
      .select("name description address campDate startTime endTime capacity registeredDonors status bloodBankId")
      .sort({ campDate: 1 });

    const campsWithSpots = camps.map((camp) => ({
      ...camp.toObject(),
      spotsLeft: camp.capacity - camp.registeredDonors.length,
      totalRegistered: camp.registeredDonors.length,
    }));

    return res.status(200).json({ success: true, count: campsWithSpots.length, data: campsWithSpots });
  } catch (error) {
    console.error("getPublicCamps error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};
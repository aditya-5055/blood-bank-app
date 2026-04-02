const express = require("express");
const router = express.Router();
const {
  getPublicBloodBanks,
  getPublicHospitals,
  findBlood,
  getPublicCamps,
} = require("../controllers/publicController");

// ─────────────────────────────────────────────────────────
// PUBLIC ROUTES — No auth required
// ─────────────────────────────────────────────────────────

// GET /api/public/blood-banks?city=pune
router.get("/blood-banks", getPublicBloodBanks);

// GET /api/public/hospitals?city=pune
router.get("/hospitals", getPublicHospitals);

// GET /api/public/find-blood?city=pune&bloodGroup=B+
router.get("/find-blood", findBlood);

// GET /api/public/camps?city=pune
router.get("/camps", getPublicCamps);

module.exports = router;
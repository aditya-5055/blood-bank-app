import { apiConnector } from "./apiConnector";
import { AUTH_APIS } from "./apis";

// ─────────────────────────────────
// Send OTP — Donor
// ─────────────────────────────────
export const sendDonorOTP = async (email) => {
  const response = await apiConnector("POST", AUTH_APIS.DONOR_SEND_OTP, { email });
  return response.data;
};

// ─────────────────────────────────
// Register Donor
// ─────────────────────────────────
export const registerDonor = async (data) => {
  const response = await apiConnector("POST", AUTH_APIS.DONOR_REGISTER, data);
  return response.data;
};

// ─────────────────────────────────
// Login Donor
// ─────────────────────────────────
export const loginDonor = async (data) => {
  const response = await apiConnector("POST", AUTH_APIS.DONOR_LOGIN, data);
  return response.data;
};

// ─────────────────────────────────
// Send OTP — Facility
// ─────────────────────────────────
export const sendFacilityOTP = async (email) => {
  const response = await apiConnector("POST", AUTH_APIS.FACILITY_SEND_OTP, { email });
  return response.data;
};

// ─────────────────────────────────
// Register Facility
// ─────────────────────────────────
export const registerFacility = async (data) => {
  const response = await apiConnector("POST", AUTH_APIS.FACILITY_REGISTER, data);
  return response.data;
};

// ─────────────────────────────────
// Login Facility
// ─────────────────────────────────
export const loginFacility = async (data) => {
  const response = await apiConnector("POST", AUTH_APIS.FACILITY_LOGIN, data);
  return response.data;
};

// ─────────────────────────────────
// Login Admin
// ─────────────────────────────────
export const loginAdmin = async (data) => {
  const response = await apiConnector("POST", AUTH_APIS.ADMIN_LOGIN, data);
  return response.data;
};
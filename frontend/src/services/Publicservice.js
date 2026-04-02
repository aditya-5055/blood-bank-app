import { apiConnector } from "./apiConnector";
import { PUBLIC_APIS } from "./apis";

// Find blood banks + hospitals by city and blood group
export const findBlood = async (city, bloodGroup) => {
  const params = {};
  if (city) params.city = city;
  if (bloodGroup) params.bloodGroup = bloodGroup;
  const response = await apiConnector("GET", PUBLIC_APIS.FIND_BLOOD, null, null, params);
  return response.data;
};

// Get all public blood banks by city
export const getPublicBloodBanks = async (city) => {
  const params = {};
  if (city) params.city = city;
  const response = await apiConnector("GET", PUBLIC_APIS.GET_BLOOD_BANKS, null, null, params);
  return response.data;
};

// Get all public hospitals by city
export const getPublicHospitals = async (city) => {
  const params = {};
  if (city) params.city = city;
  const response = await apiConnector("GET", PUBLIC_APIS.GET_HOSPITALS, null, null, params);
  return response.data;
};

// Get all upcoming public camps by city
export const getPublicCamps = async (city) => {
  const params = {};
  if (city) params.city = city;
  const response = await apiConnector("GET", PUBLIC_APIS.GET_CAMPS, null, null, params);
  return response.data;
};
import { apiConnector } from "./apiConnector";
import { BLOOD_BANK_APIS } from "./apis";

export const getBloodBankProfile = async () => {
  const response = await apiConnector("GET", BLOOD_BANK_APIS.GET_PROFILE);
  return response.data;
};

export const updateBloodBankProfile = async (data) => {
  const response = await apiConnector("PUT", BLOOD_BANK_APIS.UPDATE_PROFILE, data);
  return response.data;
};

export const getInventory = async () => {
  const response = await apiConnector("GET", BLOOD_BANK_APIS.GET_INVENTORY);
  return response.data;
};

export const updateInventory = async (data) => {
  const response = await apiConnector("POST", BLOOD_BANK_APIS.UPDATE_INVENTORY, data);
  return response.data;
};

export const getDonationRequests = async () => {
  const response = await apiConnector("GET", BLOOD_BANK_APIS.GET_DONATION_REQUESTS);
  return response.data;
};

export const processDonationRequest = async (id, data) => {
  const response = await apiConnector("PUT", BLOOD_BANK_APIS.PROCESS_DONATION_REQUEST(id), data);
  return response.data;
};

export const completeDonation = async (id, data) => {
  const response = await apiConnector("PUT", BLOOD_BANK_APIS.COMPLETE_DONATION(id), data);
  return response.data;
};

export const getBloodRequests = async () => {
  const response = await apiConnector("GET", BLOOD_BANK_APIS.GET_BLOOD_REQUESTS);
  return response.data;
};

// ✅ New — get accepted requests
export const getAcceptedBloodRequests = async () => {
  const response = await apiConnector("GET", BLOOD_BANK_APIS.GET_ACCEPTED_BLOOD_REQUESTS);
  return response.data;
};

export const respondToBloodRequest = async (id, data) => {
  const response = await apiConnector("PUT", BLOOD_BANK_APIS.RESPOND_TO_BLOOD_REQUEST(id), data);
  return response.data;
};

export const completeBloodRequest = async (id) => {
  const response = await apiConnector("PUT", BLOOD_BANK_APIS.COMPLETE_BLOOD_REQUEST(id));
  return response.data;
};

export const createCamp = async (data) => {
  const response = await apiConnector("POST", BLOOD_BANK_APIS.CREATE_CAMP, data);
  return response.data;
};

export const getMyCamps = async (status) => {
  const response = await apiConnector("GET", BLOOD_BANK_APIS.GET_MY_CAMPS, null, null, status ? { status } : {});
  return response.data;
};

export const getCampDonors = async (campId) => {
  const response = await apiConnector("GET", BLOOD_BANK_APIS.GET_CAMP_DONORS(campId));
  return response.data;
};

export const markAttendance = async (campId, donorId, data) => {
  const response = await apiConnector("PUT", BLOOD_BANK_APIS.MARK_ATTENDANCE(campId, donorId), data);
  return response.data;
};

export const completeCamp = async (campId) => {
  const response = await apiConnector("PUT", BLOOD_BANK_APIS.COMPLETE_CAMP(campId));
  return response.data;
};

export const updateCampStatus = async (campId, data) => {
  const response = await apiConnector("PUT", BLOOD_BANK_APIS.UPDATE_CAMP_STATUS(campId), data);
  return response.data;
};

export const getTransactions = async (filters) => {
  const response = await apiConnector("GET", BLOOD_BANK_APIS.GET_TRANSACTIONS, null, null, filters || {});
  return response.data;
};
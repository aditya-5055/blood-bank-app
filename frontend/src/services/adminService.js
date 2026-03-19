import { apiConnector } from "./apiConnector";
import { ADMIN_APIS } from "./apis";

export const getPendingFacilities = async () => {
  const response = await apiConnector("GET", ADMIN_APIS.GET_PENDING_FACILITIES);
  return response.data;
};

export const approveFacility = async (id) => {
  const response = await apiConnector("PUT", ADMIN_APIS.APPROVE_FACILITY(id));
  return response.data;
};

export const rejectFacility = async (id, rejectionReason) => {
  const response = await apiConnector("PUT", ADMIN_APIS.REJECT_FACILITY(id), { rejectionReason });
  return response.data;
};

export const getAllDonors = async () => {
  const response = await apiConnector("GET", ADMIN_APIS.GET_ALL_DONORS);
  return response.data;
};

export const getAllFacilities = async () => {
  const response = await apiConnector("GET", ADMIN_APIS.GET_ALL_FACILITIES);
  return response.data;
};

export const getAllRequests = async () => {
  const response = await apiConnector("GET", ADMIN_APIS.GET_ALL_REQUESTS);
  return response.data;
};
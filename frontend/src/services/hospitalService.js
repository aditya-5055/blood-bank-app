import { apiConnector } from "./apiConnector";
import { HOSPITAL_APIS } from "./apis";

export const getHospitalProfile = async () => {
  const response = await apiConnector("GET", HOSPITAL_APIS.GET_PROFILE);
  return response.data;
};

export const updateHospitalProfile = async (data) => {
  const response = await apiConnector("PUT", HOSPITAL_APIS.UPDATE_PROFILE, data);
  return response.data;
};

export const postBloodRequest = async (data) => {
  const response = await apiConnector("POST", HOSPITAL_APIS.POST_BLOOD_REQUEST, data);
  return response.data;
};

export const getMyRequests = async (status) => {
  const response = await apiConnector("GET", HOSPITAL_APIS.GET_MY_REQUESTS, null, null, status ? { status } : {});
  return response.data;
};

export const getRequestStatus = async (id) => {
  const response = await apiConnector("GET", HOSPITAL_APIS.GET_REQUEST_STATUS(id));
  return response.data;
};

export const cancelRequest = async (id) => {
  const response = await apiConnector("PUT", HOSPITAL_APIS.CANCEL_REQUEST(id));
  return response.data;
};

export const completeRequest = async (id) => {
  const response = await apiConnector("PUT", HOSPITAL_APIS.COMPLETE_REQUEST(id));
  return response.data;
};
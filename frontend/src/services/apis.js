 
const BASE = "";

// ─────────────────────────────────
// AUTH APIs
// ─────────────────────────────────
export const AUTH_APIS = {
  DONOR_SEND_OTP: "/api/auth/donor/send-otp",
  DONOR_REGISTER: "/api/auth/donor/register",
  DONOR_LOGIN: "/api/auth/donor/login",
  FACILITY_SEND_OTP: "/api/auth/facility/send-otp",
  FACILITY_REGISTER: "/api/auth/facility/register",
  FACILITY_LOGIN: "/api/auth/facility/login",
  ADMIN_LOGIN: "/api/auth/admin/login",
};

// ─────────────────────────────────
// PUBLIC APIs — No token required
// ─────────────────────────────────
export const PUBLIC_APIS = {
  FIND_BLOOD: "/api/public/find-blood",         // ?city=pune&bloodGroup=B+
  GET_BLOOD_BANKS: "/api/public/blood-banks",   // ?city=pune
  GET_HOSPITALS: "/api/public/hospitals",       // ?city=pune
  GET_CAMPS: "/api/public/camps",               // ?city=pune
};

// ─────────────────────────────────
// DONOR APIs
// ─────────────────────────────────
export const DONOR_APIS = {
  GET_PROFILE: "/api/donor/profile",
  UPDATE_PROFILE: "/api/donor/update-profile",
  TOGGLE_AVAILABILITY: "/api/donor/toggle-availability",
  GET_DONATION_HISTORY: "/api/donor/donation-history",
  GET_NEARBY_BLOOD_BANKS: "/api/donor/nearby-bloodbanks",
  GET_NEARBY_CAMPS: "/api/donor/nearby-camps",
  GET_NEARBY_REQUESTS: "/api/donor/nearby-requests",
  PROACTIVE_DONATE: "/api/donor/proactive-donate",
  GET_MY_DONATION_REQUESTS: "/api/donor/my-donation-requests",
  REGISTER_FOR_CAMP: (id) => `/api/donor/register-camp/${id}`,
  ACCEPT_BLOOD_REQUEST: (id) => `/api/donor/accept-request/${id}`,
  DECLINE_BLOOD_REQUEST: (id) => `/api/donor/decline-request/${id}`,
  GET_MY_CAMPS: "/api/donor/my-camps",
};

// ─────────────────────────────────
// BLOOD BANK APIs
// ─────────────────────────────────
export const BLOOD_BANK_APIS = {
  GET_PROFILE: "/api/bloodbank/profile",
  UPDATE_PROFILE: "/api/bloodbank/update-profile",
  GET_INVENTORY: "/api/bloodbank/inventory",
  UPDATE_INVENTORY: "/api/bloodbank/inventory/update",
  GET_DONATION_REQUESTS: "/api/bloodbank/donation-requests",
  PROCESS_DONATION_REQUEST: (id) => `/api/bloodbank/donation-requests/${id}`,
  COMPLETE_DONATION: (id) => `/api/bloodbank/complete-donation/${id}`,
  GET_BLOOD_REQUESTS: "/api/bloodbank/blood-requests",
  RESPOND_TO_BLOOD_REQUEST: (id) => `/api/bloodbank/blood-requests/${id}/respond`,
  COMPLETE_BLOOD_REQUEST: (id) => `/api/bloodbank/blood-requests/${id}/complete`,
  CREATE_CAMP: "/api/bloodbank/camp/create",
  GET_MY_CAMPS: "/api/bloodbank/camps",
  GET_CAMP_DONORS: (campId) => `/api/bloodbank/camp/${campId}/donors`,
  MARK_ATTENDANCE: (campId, donorId) => `/api/bloodbank/camp/${campId}/attendance/${donorId}`,
  COMPLETE_CAMP: (campId) => `/api/bloodbank/camp/${campId}/complete`,
  UPDATE_CAMP_STATUS: (campId) => `/api/bloodbank/camp/${campId}/status`,
  GET_TRANSACTIONS: "/api/bloodbank/transactions",
  GET_ACCEPTED_BLOOD_REQUESTS: "/api/bloodbank/blood-requests/accepted",
};

// ─────────────────────────────────
// HOSPITAL APIs
// ─────────────────────────────────
export const HOSPITAL_APIS = {
  GET_PROFILE: "/api/hospital/profile",
  UPDATE_PROFILE: "/api/hospital/update-profile",
  POST_BLOOD_REQUEST: "/api/hospital/blood-request",
  GET_MY_REQUESTS: "/api/hospital/blood-requests",
  GET_REQUEST_STATUS: (id) => `/api/hospital/blood-request/${id}/status`,
  CANCEL_REQUEST: (id) => `/api/hospital/blood-request/${id}/cancel`,
  COMPLETE_REQUEST: (id) => `/api/hospital/blood-request/${id}/complete`,
};

// ─────────────────────────────────
// ADMIN APIs
// ─────────────────────────────────
export const ADMIN_APIS = {
  GET_PENDING_FACILITIES: "/api/admin/pending-facilities",
  APPROVE_FACILITY: (id) => `/api/admin/approve-facility/${id}`,
  REJECT_FACILITY: (id) => `/api/admin/reject-facility/${id}`,
  GET_ALL_DONORS: "/api/admin/donors",
  GET_ALL_FACILITIES: "/api/admin/facilities",
  GET_ALL_REQUESTS: "/api/admin/requests",
};
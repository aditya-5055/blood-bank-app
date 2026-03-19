import {
  MdDashboard,
  MdPerson,
  MdLocationOn,
  MdHistory,
  MdBloodtype,
  MdLocalHospital,
  MdInventory,
  MdPeople,
  MdApproval,
  MdManageAccounts,
  MdReceiptLong,
  MdCampaign,
} from "react-icons/md";

import {
  FaHandHoldingHeart,
  FaTint,
  FaClipboardList,
} from "react-icons/fa";

export const DONOR_LINKS = [
  { name: "Dashboard", path: "/donor/dashboard", icon: MdDashboard },
  { name: "Profile", path: "/donor/profile", icon: MdPerson },
  { name: "Nearby Blood Banks", path: "/donor/nearby-banks", icon: MdLocationOn },
  { name: "Nearby Camps", path: "/donor/nearby-camps", icon: MdCampaign },
  { name: "Nearby Requests", path: "/donor/nearby-requests", icon: MdLocalHospital },
  { name: "Donation History", path: "/donor/donation-history", icon: MdHistory },
  { name: "My Requests", path: "/donor/my-requests", icon: FaClipboardList },
];

export const BLOOD_BANK_LINKS = [
  { name: "Dashboard", path: "/bloodbank/dashboard", icon: MdDashboard },
  { name: "Profile", path: "/bloodbank/profile", icon: MdPerson },
  { name: "Inventory", path: "/bloodbank/inventory", icon: MdInventory },
  { name: "Donation Requests", path: "/bloodbank/donation-requests", icon: FaHandHoldingHeart },
  { name: "Blood Requests", path: "/bloodbank/blood-requests", icon: FaTint },
  { name: "Camps", path: "/bloodbank/camps", icon: MdCampaign },
  { name: "Transactions", path: "/bloodbank/transactions", icon: MdReceiptLong },
];

export const HOSPITAL_LINKS = [
  { name: "Dashboard", path: "/hospital/dashboard", icon: MdDashboard },
  { name: "Profile", path: "/hospital/profile", icon: MdPerson },
  { name: "Post Blood Request", path: "/hospital/post-request", icon: MdBloodtype },
  { name: "My Requests", path: "/hospital/my-requests", icon: FaClipboardList },
];

export const ADMIN_LINKS = [
  { name: "Dashboard", path: "/admin/dashboard", icon: MdDashboard },
  { name: "Pending Facilities", path: "/admin/pending-facilities", icon: MdApproval },
  { name: "Manage Facilities", path: "/admin/manage-facilities", icon: MdManageAccounts },
  { name: "All Donors", path: "/admin/donors", icon: MdPeople },
  { name: "All Requests", path: "/admin/requests", icon: FaClipboardList },
];
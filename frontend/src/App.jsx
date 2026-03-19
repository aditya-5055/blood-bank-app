import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DonorLayout from "./layouts/DonorLayout";
import BloodBankLayout from "./layouts/BloodBankLayout";
import HospitalLayout from "./layouts/HospitalLayout";
import AdminLayout from "./layouts/AdminLayout";

// Protected Route
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ROLES } from "./constants/roles";

// Public Pages
import Home from "./pages/Home";

// Auth Pages
import DonorLogin from "./pages/auth/DonorLogin";
import DonorRegister from "./pages/auth/DonorRegister";
import FacilityLogin from "./pages/auth/FacilityLogin";
import FacilityRegister from "./pages/auth/FacilityRegister";
import AdminLogin from "./pages/auth/AdminLogin";

// Donor Pages
import DonorDashboard from "./pages/donor/Dashboard";
import DonorProfile from "./pages/donor/Profile";
import NearbyBanks from "./pages/donor/NearbyBanks";
import NearbyCamps from "./pages/donor/NearbyCamps";
import NearbyRequests from "./pages/donor/NearbyRequests";
import DonationHistory from "./pages/donor/DonationHistory";
import MyRequests from "./pages/donor/MyRequests";

// Blood Bank Pages
import BloodBankDashboard from "./pages/bloodbank/Dashboard";
import BloodBankProfile from "./pages/bloodbank/Profile";
import Inventory from "./pages/bloodbank/Inventory";
import DonationRequests from "./pages/bloodbank/DonationRequests";
import BloodRequests from "./pages/bloodbank/BloodRequests";
import Camps from "./pages/bloodbank/Camps";
import Transactions from "./pages/bloodbank/Transactions";

// Hospital Pages
import HospitalDashboard from "./pages/hospital/Dashboard";
import HospitalProfile from "./pages/hospital/Profile";
import PostRequest from "./pages/hospital/PostRequest";
import HospitalMyRequests from "./pages/hospital/MyRequests";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import PendingFacilities from "./pages/admin/PendingFacilities";
import ManageFacilities from "./pages/admin/ManageFacilities";
import AllDonors from "./pages/admin/AllDonors";
import AllRequests from "./pages/admin/AllRequests";

function App() {
  return (
    

   
    <Routes>

      {/* ─────────────────────────────────── */}
      {/* Public Routes */}
      {/* ─────────────────────────────────── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/camps" element={<div className="p-6"><h1 className="text-2xl font-bold">Public Camps Page</h1></div>} />
        <Route path="/learn" element={<div className="p-6"><h1 className="text-2xl font-bold">Learn Page</h1></div>} />
        <Route path="/about" element={<div className="p-6"><h1 className="text-2xl font-bold">About Us Page</h1></div>} />
      </Route>

      {/* ─────────────────────────────────── */}
      {/* Auth Routes */}
      {/* ─────────────────────────────────── */}
      <Route path="/donor/login" element={<DonorLogin />} />
      <Route path="/donor/register" element={<DonorRegister />} />
      <Route path="/facility/login" element={<FacilityLogin />} />
      <Route path="/facility/register" element={<FacilityRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ─────────────────────────────────── */}
      {/* Donor Routes */}
      {/* ─────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.DONOR]} />}>
        <Route element={<DonorLayout />}>
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
          <Route path="/donor/profile" element={<DonorProfile />} />
          <Route path="/donor/nearby-banks" element={<NearbyBanks />} />
          <Route path="/donor/nearby-camps" element={<NearbyCamps />} />
          <Route path="/donor/nearby-requests" element={<NearbyRequests />} />
          <Route path="/donor/donation-history" element={<DonationHistory />} />
          <Route path="/donor/my-requests" element={<MyRequests />} />
        </Route>
      </Route>

      {/* ─────────────────────────────────── */}
      {/* Blood Bank Routes */}
      {/* ─────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.BLOOD_BANK]} />}>
        <Route element={<BloodBankLayout />}>
          <Route path="/bloodbank/dashboard" element={<BloodBankDashboard />} />
          <Route path="/bloodbank/profile" element={<BloodBankProfile />} />
          <Route path="/bloodbank/inventory" element={<Inventory />} />
          <Route path="/bloodbank/donation-requests" element={<DonationRequests />} />
          <Route path="/bloodbank/blood-requests" element={<BloodRequests />} />
          <Route path="/bloodbank/camps" element={<Camps />} />
          <Route path="/bloodbank/transactions" element={<Transactions />} />
        </Route>
      </Route>

      {/* ─────────────────────────────────── */}
      {/* Hospital Routes */}
      {/* ─────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.HOSPITAL]} />}>
        <Route element={<HospitalLayout />}>
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/hospital/profile" element={<HospitalProfile />} />
          <Route path="/hospital/post-request" element={<PostRequest />} />
          <Route path="/hospital/my-requests" element={<HospitalMyRequests />} />
        </Route>
      </Route>

      {/* ─────────────────────────────────── */}
      {/* Admin Routes */}
      {/* ─────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/pending-facilities" element={<PendingFacilities />} />
          <Route path="/admin/manage-facilities" element={<ManageFacilities />} />
          <Route path="/admin/donors" element={<AllDonors />} />
          <Route path="/admin/requests" element={<AllRequests />} />
        </Route>
      </Route>

    </Routes>
     
  );
}

export default App;
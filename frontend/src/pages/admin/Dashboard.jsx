import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHospital, FaUsers, FaTint } from "react-icons/fa";
import { MdApproval, MdBloodtype, MdTrendingUp } from "react-icons/md";
import { getPendingFacilities, getAllDonors, getAllFacilities, getAllRequests } from "../../services/adminService";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    pendingFacilities: 0,
    totalDonors: 0,
    totalFacilities: 0,
    totalRequests: 0,
  });
  const [pendingFacilities, setPendingFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pending, donors, facilities, requests] = await Promise.all([
        getPendingFacilities(),
        getAllDonors(),
        getAllFacilities(),
        getAllRequests(),
      ]);

      setStats({
        pendingFacilities: pending.count || 0,
        totalDonors: donors.count || 0,
        totalFacilities: facilities.count || 0,
        totalRequests: requests.count || 0,
      });

      // Show only latest 5 pending
      setPendingFacilities(pending.facilities?.slice(0, 5) || []);

    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name || "Admin"} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening in BloodConnect today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingFacilities}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <MdApproval className="text-red-600 text-2xl" />
            </div>
          </div>
          <Link to="/admin/pending-facilities" className="text-xs text-red-600 font-medium mt-3 block hover:underline">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Donors</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalDonors}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaUsers className="text-green-600 text-2xl" />
            </div>
          </div>
          <Link to="/admin/donors" className="text-xs text-green-600 font-medium mt-3 block hover:underline">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Facilities</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalFacilities}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaHospital className="text-blue-600 text-2xl" />
            </div>
          </div>
          <Link to="/admin/manage-facilities" className="text-xs text-blue-600 font-medium mt-3 block hover:underline">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalRequests}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <MdBloodtype className="text-purple-600 text-2xl" />
            </div>
          </div>
          <Link to="/admin/requests" className="text-xs text-purple-600 font-medium mt-3 block hover:underline">
            View all →
          </Link>
        </div>

      </div>

      {/* Pending Facilities */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Pending Approvals
          </h2>
          <Link
            to="/admin/pending-facilities"
            className="text-sm text-red-600 font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        {pendingFacilities.length === 0 ? (
          <div className="text-center py-8">
            <MdApproval className="text-gray-300 text-5xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingFacilities.map((facility) => (
              <div
                key={facility._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    facility.facilityType === "hospital"
                      ? "bg-orange-100"
                      : "bg-blue-100"
                  }`}>
                    {facility.facilityType === "hospital"
                      ? <FaHospital className="text-orange-600" />
                      : <FaTint className="text-blue-600" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{facility.name}</p>
                    <p className="text-xs text-gray-500">{facility.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    facility.facilityType === "hospital"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {facility.facilityType}
                  </span>
                  <Link
                    to="/admin/pending-facilities"
                    className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
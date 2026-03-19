import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaHospital, FaCheck, FaTimes, FaTint } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { getPendingFacilities, approveFacility, rejectFacility } from "../../services/adminService";

const PendingFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState({ show: false, facilityId: null });
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPendingFacilities();
  }, []);

  const fetchPendingFacilities = async () => {
    try {
      const response = await getPendingFacilities();
      setFacilities(response.facilities || []);
    } catch (error) {
      toast.error("Failed to load pending facilities");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const response = await approveFacility(id);
      if (response.success) {
        toast.success("Facility approved successfully!");
        setFacilities(facilities.filter((f) => f._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide rejection reason");
      return;
    }
    setActionLoading(rejectModal.facilityId);
    try {
      const response = await rejectFacility(rejectModal.facilityId, rejectionReason);
      if (response.success) {
        toast.success("Facility rejected!");
        setFacilities(facilities.filter((f) => f._id !== rejectModal.facilityId));
        setRejectModal({ show: false, facilityId: null });
        setRejectionReason("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(null);
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
        <h1 className="text-2xl font-bold text-gray-800">Pending Facilities</h1>
        <p className="text-gray-500 mt-1">
          Review and approve or reject facility registrations
        </p>
      </div>

      {/* Count Badge */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
          {facilities.length} Pending
        </span>
      </div>

      {/* Empty State */}
      {facilities.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaCheck className="text-green-400 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">All caught up!</h3>
          <p className="text-gray-400 text-sm mt-1">No pending facilities to review</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {facilities.map((facility) => (
            <div key={facility._id} className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition-all">

              {/* Facility Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    facility.facilityType === "hospital"
                      ? "bg-orange-100"
                      : "bg-blue-100"
                  }`}>
                    {facility.facilityType === "hospital"
                      ? <FaHospital className="text-orange-600 text-xl" />
                      : <FaTint className="text-blue-600 text-xl" />
                    }
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{facility.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      facility.facilityType === "hospital"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {facility.facilityType}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs font-semibold rounded-full">
                  Pending
                </span>
              </div>

              {/* Facility Details */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdEmail className="text-gray-400" />
                  {facility.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdPhone className="text-gray-400" />
                  {facility.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdLocationOn className="text-gray-400" />
                  {facility.address?.city}, {facility.address?.state} - {facility.address?.pincode}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 text-xs">Reg No:</span>
                  <span className="font-medium">{facility.registrationNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 text-xs">Category:</span>
                  <span className="font-medium">{facility.facilityCategory}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(facility._id)}
                  disabled={actionLoading === facility._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold text-sm rounded-xl transition-all"
                >
                  <FaCheck />
                  {actionLoading === facility._id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => setRejectModal({ show: true, facilityId: facility._id })}
                  disabled={actionLoading === facility._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold text-sm rounded-xl transition-all"
                >
                  <FaTimes />
                  Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setRejectModal({ show: false, facilityId: null })}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 z-10">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Reject Facility</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please provide a reason for rejection. This will be emailed to the facility.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectModal({ show: false, facilityId: null });
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading !== null}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-xl transition-all text-sm"
              >
                {actionLoading !== null ? "Rejecting..." : "Reject Facility"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PendingFacilities;
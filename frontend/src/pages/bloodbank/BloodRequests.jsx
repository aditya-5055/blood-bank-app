import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTint, FaHospital, FaPhone } from "react-icons/fa";
import { MdLocationOn, MdAccessTime, MdCheck, MdClose } from "react-icons/md";
import {
  getBloodRequests,
  getAcceptedBloodRequests,
  respondToBloodRequest,
  completeBloodRequest,
} from "../../services/bloodBankService";

const BloodRequests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("incoming");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Use separate APIs
  const fetchRequests = async () => {
    try {
      const [incomingRes, acceptedRes] = await Promise.all([
        getBloodRequests(),
        getAcceptedBloodRequests(),
      ]);
      setIncomingRequests(incomingRes.requests || []);
      setAcceptedRequests(acceptedRes.requests || []);
    } catch (error) {
      toast.error("Failed to load blood requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setActionLoading(requestId + "_accept");
    try {
      const response = await respondToBloodRequest(requestId, { action: "accept" });
      if (response.success) {
        toast.success("Request accepted! Blood packed and ready for dispatch.");
        fetchRequests();
        setFilter("accepted"); // ✅ Switch to accepted tab
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineClick = (request) => {
    setSelectedRequest(request);
    setShowDeclineModal(true);
  };

  const handleDeclineConfirm = async () => {
    setActionLoading(selectedRequest._id + "_decline");
    setShowDeclineModal(false);
    try {
      const response = await respondToBloodRequest(selectedRequest._id, {
        action: "decline",
        declineReason: "Cannot fulfill at this time",
      });
      if (response.success) {
        toast.success("Request declined");
        fetchRequests();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to decline");
    } finally {
      setActionLoading(null);
      setSelectedRequest(null);
    }
  };

  const handleComplete = async (requestId) => {
    setActionLoading(requestId + "_complete");
    try {
      const response = await completeBloodRequest(requestId);
      if (response.success) {
        toast.success("Blood request completed! Blood delivered to hospital.");
        fetchRequests();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to complete");
    } finally {
      setActionLoading(null);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical": return "bg-red-100 text-red-600";
      case "High": return "bg-orange-100 text-orange-600";
      case "Moderate": return "bg-yellow-100 text-yellow-600";
      case "Normal": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const diff = new Date(deadline) - now;
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  const displayRequests = filter === "incoming" ? incomingRequests : acceptedRequests;

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
        <h1 className="text-2xl font-bold text-gray-800">Hospital Blood Requests</h1>
        <p className="text-gray-500 mt-1">Incoming blood requests from nearby hospitals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{incomingRequests.length}</p>
          <p className="text-xs font-medium text-blue-600 mt-0.5">📥 Incoming</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{acceptedRequests.length}</p>
          <p className="text-xs font-medium text-yellow-600 mt-0.5">✅ Accepted — Pending Delivery</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("incoming")}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            filter === "incoming"
              ? "bg-red-600 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
          }`}
        >
          Incoming ({incomingRequests.length})
        </button>
        <button
          onClick={() => setFilter("accepted")}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            filter === "accepted"
              ? "bg-red-600 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
          }`}
        >
          Accepted ({acceptedRequests.length})
        </button>
      </div>

      {/* Info Box */}
      {filter === "incoming" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            📋 These are blood requests from hospitals within 50km.
            Accept if you have enough stock, decline otherwise.
          </p>
        </div>
      )}
      {filter === "accepted" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-700">
            🚚 Click <strong>Mark as Delivered</strong> once blood is dispatched to hospital.
          </p>
        </div>
      )}

      {/* List */}
      {displayRequests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaTint className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No {filter} requests
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "incoming"
              ? "No incoming blood requests from nearby hospitals"
              : "No accepted requests pending delivery"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayRequests.map((request) => (
            <div
              key={request._id}
              className={`bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border-l-4 ${
                request.urgencyLevel === "Critical" ? "border-red-500" :
                request.urgencyLevel === "High" ? "border-orange-400" :
                request.urgencyLevel === "Moderate" ? "border-yellow-400" :
                "border-green-400"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaTint className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-red-600">{request.bloodGroup}</span>
                      <span className="text-gray-600 font-medium">{request.units} units</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                        {request.urgencyLevel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Posted: {new Date(request.createdAt).toDateString()}
                    </p>
                  </div>
                </div>

                {request.status === "active" && (
                  <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                    <MdAccessTime />
                    {getTimeRemaining(request.deadline)}
                  </div>
                )}
              </div>

              {/* Hospital Details */}
              <div className="mb-4 p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="text-xs text-gray-400 mb-1">Hospital:</p>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaHospital className="text-orange-500 flex-shrink-0" />
                  <span className="font-semibold">{request.hospitalId?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaPhone className="text-xs text-gray-400 flex-shrink-0" />
                  {request.hospitalId?.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MdLocationOn className="text-gray-400 flex-shrink-0" />
                  {request.hospitalId?.address?.city}, {request.hospitalId?.address?.state}
                </div>
              </div>

              {/* Stock Check — only for incoming */}
              {filter === "incoming" && (
                <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                  request.canFulfill
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {request.canFulfill
                    ? `✅ You have enough stock (${request.availableStock} units available)`
                    : `❌ Insufficient stock (${request.availableStock} units available, need ${request.units})`}
                </div>
              )}

              {/* Notes */}
              {request.notes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-500">Hospital Note:</p>
                  <p className="text-sm text-blue-700 mt-0.5">{request.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                {filter === "incoming" && (
                  <>
                    <button
                      onClick={() => handleDeclineClick(request)}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 text-sm font-semibold rounded-xl transition-all"
                    >
                      <MdClose />
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(request._id)}
                      disabled={!request.canFulfill || actionLoading === request._id + "_accept"}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                      <MdCheck />
                      {actionLoading === request._id + "_accept"
                        ? "Accepting..."
                        : request.canFulfill ? "Accept Request" : "Insufficient Stock"}
                    </button>
                  </>
                )}
                {filter === "accepted" && (
                  <button
                    onClick={() => handleComplete(request._id)}
                    disabled={actionLoading === request._id + "_complete"}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    <MdCheck />
                    {actionLoading === request._id + "_complete"
                      ? "Completing..."
                      : "🚚 Mark as Delivered to Hospital"}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Decline Blood Request</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to decline the{" "}
              <span className="font-semibold text-red-600">
                {selectedRequest?.bloodGroup}
              </span>{" "}
              request from{" "}
              <span className="font-semibold">
                {selectedRequest?.hospitalId?.name}
              </span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineConfirm}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl"
              >
                Decline Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BloodRequests;
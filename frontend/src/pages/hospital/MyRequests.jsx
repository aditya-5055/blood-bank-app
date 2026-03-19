import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTint, FaPhone } from "react-icons/fa";
import {
  MdAccessTime,
  MdLocationOn,
  MdCancel,
  MdCheckCircle,
} from "react-icons/md";
import {
  getMyRequests,
  cancelRequest,
  completeRequest,
} from "../../services/hospitalService";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filters = [
    "all",
    "active",
    "confirmed",
    "completed",
    "expired",
    "cancelled",
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getMyRequests();
      setRequests(response.requests || []);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (request) => {
    setSelectedRequest(request);
    setShowCancelModal(true);
  };

  const handleCompleteClick = (request) => {
    setSelectedRequest(request);
    setShowCompleteModal(true);
  };

  const handleConfirmCancel = async () => {
    setCancellingId(selectedRequest.id);
    setShowCancelModal(false);
    try {
      const response = await cancelRequest(selectedRequest.id);
      if (response.success) {
        toast.success("Request cancelled successfully");
        fetchRequests();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel request");
    } finally {
      setCancellingId(null);
      setSelectedRequest(null);
    }
  };

  // ✅ Complete donation by hospital
  const handleConfirmComplete = async () => {
    setCompletingId(selectedRequest.id);
    setShowCompleteModal(false);
    try {
      const response = await completeRequest(selectedRequest.id);
      if (response.success) {
        toast.success("Donation completed! Donor has been recorded.");
        fetchRequests();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to complete request",
      );
    } finally {
      setCompletingId(null);
      setSelectedRequest(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-600";
      case "confirmed":
        return "bg-yellow-100 text-yellow-600";
      case "completed":
        return "bg-green-100 text-green-600";
      case "expired":
        return "bg-gray-100 text-gray-500";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical":
        return "bg-red-100 text-red-600";
      case "High":
        return "bg-orange-100 text-orange-600";
      case "Moderate":
        return "bg-yellow-100 text-yellow-600";
      case "Normal":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case "active":
        return "border-blue-400";
      case "confirmed":
        return "border-yellow-400";
      case "completed":
        return "border-green-400";
      case "expired":
        return "border-gray-300";
      case "cancelled":
        return "border-red-300";
      default:
        return "border-gray-200";
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

  const getStatusMessage = (request) => {
    switch (request.status) {
      case "active":
        return request.stage === "bloodbank"
          ? "🏦 Searching nearby blood banks..."
          : request.stage === "both"
            ? "🏦🙋 Searching blood banks and donors..."
            : "🙋 Searching nearby donors...";
      case "confirmed":
        return request.respondedBy?.responderType === "donor"
          ? "🙋 A donor confirmed! Please click Complete when donor visits and donates."
          : "✅ Blood bank confirmed your request!";
      case "completed":
        return "🎉 Request fulfilled successfully!";
      case "expired":
        return `⏰ ${request.expiredReason || "Request expired — no one responded in time"}`;
      case "cancelled":
        return "❌ Request was cancelled";
      default:
        return "";
    }
  };

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Blood Requests
          </h1>
          <p className="text-gray-500 mt-1">Track all your blood requests</p>
        </div>
        <Link
          to="/hospital/post-request"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all"
        >
          + New Request
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {["active", "confirmed", "completed", "expired", "cancelled"].map(
          (s) => (
            <div
              key={s}
              onClick={() => setFilter(s)}
              className={`bg-white rounded-xl shadow p-3 text-center cursor-pointer transition-all hover:shadow-md ${
                filter === s ? "ring-2 ring-red-500" : ""
              }`}
            >
              <p className="text-xl font-bold text-gray-800">
                {requests.filter((r) => r.status === s).length}
              </p>
              <p
                className={`text-xs font-medium capitalize mt-0.5 ${getStatusColor(s).split(" ")[1]}`}
              >
                {s}
              </p>
            </div>
          ),
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${
              filter === f
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
            }`}
          >
            {f} (
            {f === "all"
              ? requests.length
              : requests.filter((r) => r.status === f).length}
            )
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaTint className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No requests found
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "all"
              ? "Post a blood request to get started"
              : `No ${filter} requests`}
          </p>
          {filter === "all" && (
            <Link
              to="/hospital/post-request"
              className="inline-block mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Post Blood Request
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border-l-4 ${getBorderColor(request.status)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaTint className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-red-600">
                        {request.bloodGroup}
                      </span>
                      <span className="text-gray-600 font-medium">
                        {request.units} units
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${getUrgencyColor(request.urgencyLevel)}`}
                      >
                        {request.urgencyLevel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Posted: {new Date(request.createdAt).toDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${getStatusColor(request.status)}`}
                >
                  {request.status}
                </span>
              </div>

              {/* Status Message */}
              <div
                className={`mb-3 p-3 rounded-xl text-sm ${
                  request.status === "active"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : request.status === "confirmed"
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      : request.status === "completed"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-50 text-gray-600 border border-gray-200"
                }`}
              >
                {getStatusMessage(request)}
              </div>

              {/* Time Remaining for active */}
              {request.status === "active" && (
                <div className="flex items-center gap-2 text-sm text-orange-600 mb-3">
                  <MdAccessTime />
                  <span className="font-medium">
                    {getTimeRemaining(request.deadline)}
                  </span>
                </div>
              )}

              {/* Responder Details */}
              {request.respondedBy?.responderId &&
                request.status !== "active" && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">
                      Responded By:
                    </p>
                    {request.respondedBy.responderType === "bloodbank" ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🏦</span>
                          <p className="text-sm font-bold text-gray-800">
                            {request.respondedBy.responderId?.name ||
                              "Blood Bank"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FaPhone className="text-gray-400 flex-shrink-0" />
                          {request.respondedBy.responderId?.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MdLocationOn className="text-gray-400 flex-shrink-0" />
                          {request.respondedBy.responderId?.address?.city ||
                            "N/A"}
                          ,{" "}
                          {request.respondedBy.responderId?.address?.state ||
                            ""}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🙋</span>
                          <p className="text-sm font-bold text-gray-800">
                            {request.respondedBy.responderId?.fullName ||
                              "Donor"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FaPhone className="text-gray-400 flex-shrink-0" />
                          {request.respondedBy.responderId?.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="text-red-500 font-bold text-xs">
                            {request.respondedBy.responderId?.bloodGroup}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* Notes */}
              {request.notes && (
                <div className="mb-3 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Notes:</p>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {request.notes}
                  </p>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-gray-100 flex gap-3">
                {/* Cancel button for active */}
                {request.status === "active" && (
                  <button
                    onClick={() => handleCancelClick(request)}
                    disabled={cancellingId === request.id}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all"
                  >
                    <MdCancel />
                    {cancellingId === request.id
                      ? "Cancelling..."
                      : "Cancel Request"}
                  </button>
                )}

                {/* ✅ Complete button — only for donor confirmed requests */}
                {request.status === "confirmed" &&
                  request.respondedBy?.responderType === "donor" && (
                    <button
                      onClick={() => handleCompleteClick(request)}
                      disabled={completingId === request.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                      <MdCheckCircle />
                      {completingId === request.id
                        ? "Completing..."
                        : "✅ Donor Visited — Mark Complete"}
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        title="Cancel Blood Request"
        message={`Are you sure you want to cancel the ${selectedRequest?.bloodGroup} blood request?`}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setShowCancelModal(false);
          setSelectedRequest(null);
        }}
      />

      {/* ✅ Complete Donation Modal */}
      {/* ✅ Complete Donation Modal */}
      <ConfirmationModal
        isOpen={showCompleteModal}
        title="Complete Donation"
        message={`Has the donor ${selectedRequest?.respondedBy?.responderId?.fullName || "donor"} visited and donated blood? This will record the donation and update their history.`}
        onConfirm={handleConfirmComplete}
        onCancel={() => {
          setShowCompleteModal(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
};

export default MyRequests;

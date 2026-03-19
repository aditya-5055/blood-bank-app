import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTint } from "react-icons/fa";
import { MdCheck, MdClose } from "react-icons/md";
import {
  getDonationRequests,
  processDonationRequest,
  completeDonation,
} from "../../services/bloodBankService";
import Avatar from "../../components/ui/Avatar";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [units, setUnits] = useState(1);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getDonationRequests();
      setRequests(response.requests || []);
    } catch (error) {
      toast.error("Failed to load donation requests");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (requestId) => {
    setActionLoading(requestId + "_confirm");
    try {
      const response = await processDonationRequest(requestId, { action: "confirm" });
      if (response.success) {
        toast.success("Donation request confirmed! Donor will visit soon.");
        fetchRequests();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to confirm");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineClick = (request) => {
    setSelectedRequest(request);
    setDeclineReason("");
    setShowDeclineModal(true);
  };

  const handleDeclineConfirm = async () => {
    if (!declineReason) {
      toast.error("Please provide decline reason");
      return;
    }
    setActionLoading(selectedRequest._id + "_decline");
    setShowDeclineModal(false);
    try {
      const response = await processDonationRequest(selectedRequest._id, {
        action: "decline",
        declineReason,
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

  const handleCompleteClick = (request) => {
    setSelectedRequest(request);
    setUnits(1);
    setShowCompleteModal(true);
  };

  const handleCompleteConfirm = async () => {
    setActionLoading(selectedRequest._id + "_complete");
    setShowCompleteModal(false);
    try {
      const response = await completeDonation(selectedRequest._id, { units });
      if (response.success) {
        toast.success("Donation completed! Blood added to inventory.");
        fetchRequests();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to complete");
    } finally {
      setActionLoading(null);
      setSelectedRequest(null);
    }
  };

  const filtered = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

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
        <h1 className="text-2xl font-bold text-gray-800">Donation Requests</h1>
        <p className="text-gray-500 mt-1">Proactive donation requests from donors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {requests.filter((r) => r.status === "pending").length}
          </p>
          <p className="text-xs font-medium text-yellow-600 mt-0.5">⏳ Pending</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {requests.filter((r) => r.status === "confirmed").length}
          </p>
          <p className="text-xs font-medium text-blue-600 mt-0.5">✅ Confirmed — Awaiting Visit</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "pending", "confirmed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${
              filter === f
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
            }`}
          >
            {f} ({f === "all" ? requests.length : requests.filter(r => r.status === f).length})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaTint className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No requests found</h3>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "all"
              ? "Donor proactive donation requests will appear here"
              : `No ${filter} requests`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((request) => (
            <div
              key={request._id}
              className={`bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border-l-4 ${
                request.status === "confirmed" ? "border-blue-400" : "border-yellow-400"
              }`}
            >
              {/* Donor Info */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar name={request.donorId?.fullName} size="md" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{request.donorId?.fullName}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-bold">
                      {request.bloodGroup}
                    </span>
                    {/* ✅ Dynamic status badge */}
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      request.status === "confirmed"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {request.status === "confirmed" ? "✅ Confirmed" : "⏳ Pending"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(request.createdAt).toDateString()}
                </p>
              </div>

              {/* Confirmed Message */}
              {request.status === "confirmed" && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700 font-medium">
                    🏥 Donor confirmed! Please wait for them to visit and then mark as donated.
                  </p>
                </div>
              )}

              {/* Donor Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {request.donorId?.phone}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Age</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {request.donorId?.age} years
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Weight</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {request.donorId?.weight ? `${request.donorId.weight} kg` : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Blood Group</p>
                  <p className="text-sm font-bold text-red-600 mt-0.5">
                    {request.donorId?.bloodGroup || request.bloodGroup}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {request.notes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-500">Donor's Note:</p>
                  <p className="text-sm text-blue-700 mt-0.5">{request.notes}</p>
                </div>
              )}

              {/* ✅ Action Buttons — different for pending vs confirmed */}
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                {request.status === "pending" && (
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
                      onClick={() => handleConfirm(request._id)}
                      disabled={actionLoading === request._id + "_confirm"}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                      <MdCheck />
                      {actionLoading === request._id + "_confirm" ? "Confirming..." : "Confirm"}
                    </button>
                  </>
                )}
                {request.status === "confirmed" && (
                  <button
                    onClick={() => handleCompleteClick(request)}
                    disabled={actionLoading === request._id + "_complete"}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    <MdCheck />
                    {actionLoading === request._id + "_complete"
                      ? "Completing..."
                      : "✅ Donor Visited — Complete Donation"}
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
            <h2 className="text-lg font-bold text-gray-800 mb-4">Decline Donation Request</h2>
            <p className="text-sm text-gray-500 mb-4">
              Please provide a reason for declining{" "}
              <span className="font-semibold">{selectedRequest?.donorId?.fullName}</span>'s request:
            </p>
            <select
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm mb-4"
            >
              <option value="">Select reason</option>
              <option value="Storage full">Storage full</option>
              <option value="Blood group not needed">Blood group not needed currently</option>
              <option value="Donor not eligible">Donor not eligible</option>
              <option value="Facility closed">Facility temporarily closed</option>
              <option value="Other">Other</option>
            </select>
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

      {/* Complete Donation Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Complete Donation</h2>
            <p className="text-sm text-gray-500 mb-4">
              Donor <span className="font-semibold">{selectedRequest?.donorId?.fullName}</span> has visited and donated blood.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Units Donated
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUnits(Math.max(1, units - 1))}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-xl"
                >
                  -
                </button>
                <input
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  min={1}
                  className="w-20 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={() => setUnits(units + 1)}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteConfirm}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl"
              >
                Complete Donation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DonationRequests;
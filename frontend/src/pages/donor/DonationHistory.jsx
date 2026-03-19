import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTint, FaHospital, FaCalendarAlt, FaHandHoldingHeart } from "react-icons/fa";
import { MdBloodtype, MdLocationOn, MdPhone } from "react-icons/md";
import { getDonationHistory, getMyDonationRequests } from "../../services/donorService";

const DonationHistory = () => {
  const [history, setHistory] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);
  const [nextEligibleDate, setNextEligibleDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("donations");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [historyRes, requestsRes] = await Promise.all([
        getDonationHistory(),
        getMyDonationRequests(),
      ]);
      setHistory(historyRes.donationHistory || []);
      setNextEligibleDate(historyRes.nextEligibleDate);
      // ✅ Only completed and declined proactive requests
      setDeclinedRequests(
        (requestsRes.donationRequests || []).filter(
          (r) => r.status === "declined" || r.status === "completed"
        )
      );
    } catch (error) {
      toast.error("Failed to load donation history");
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
        <h1 className="text-2xl font-bold text-gray-800">Donation History</h1>
        <p className="text-gray-500 mt-1">Your complete blood donation record</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {/* Total Donations */}
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaTint className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{history.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Donations</p>
        </div>

        {/* Units Donated */}
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MdBloodtype className="text-blue-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {history.reduce((sum, d) => sum + (d.units || 1), 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Units Donated</p>
        </div>

        {/* Next Eligible */}
        <div className="bg-white rounded-2xl shadow p-4 text-center col-span-2 md:col-span-1">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaCalendarAlt className="text-green-600" />
          </div>
          <p className="text-sm font-bold text-gray-800">
            {nextEligibleDate
              ? new Date(nextEligibleDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Now"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Next Eligible Date</p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("donations")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "donations"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Blood Donations ({history.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "requests"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Proactive Requests ({declinedRequests.length})
        </button>
      </div>

      {/* ── Tab 1 — Blood Donations ── */}
      {activeTab === "donations" && (
        <>
          {history.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <FaTint className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No donations yet</h3>
              <p className="text-gray-400 text-sm mt-1">
                Your donation history will appear here after your first donation
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...history].reverse().map((donation, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border-l-4 border-green-400"
                >
                  <div className="flex items-start gap-4">

                    {/* Icon */}
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaTint className="text-red-600 text-lg" />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">
                            {donation.donatedTo === "blood-bank"
                              ? "Blood Bank Donation"
                              : "Hospital Donation"}
                          </span>
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-bold">
                            {donation.bloodGroup}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                          ✅ Completed
                        </span>
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaCalendarAlt className="flex-shrink-0 text-xs text-gray-400" />
                          {new Date(donation.donationDate).toDateString()}
                        </div>
                        {donation.facility && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaHospital className="flex-shrink-0 text-xs text-gray-400" />
                            {donation.facility?.name || "Unknown Facility"}
                          </div>
                        )}
                        {donation.facility?.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MdLocationOn className="flex-shrink-0 text-gray-400" />
                            {donation.facility?.address?.city}, {donation.facility?.address?.state}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Units Badge */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-red-600">{donation.units || 1}</p>
                      <p className="text-xs text-gray-400">unit(s)</p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Tab 2 — Proactive Requests History ── */}
      {activeTab === "requests" && (
        <>
          {declinedRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <FaHandHoldingHeart className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No request history</h3>
              <p className="text-gray-400 text-sm mt-1">
                Completed and declined requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {declinedRequests.map((request) => (
                <div
                  key={request._id}
                  className={`bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border-l-4 ${
                    request.status === "completed" ? "border-green-400" : "border-red-400"
                  }`}
                >
                  <div className="flex items-start gap-4">

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      request.status === "completed" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      <FaHandHoldingHeart className={
                        request.status === "completed" ? "text-green-600 text-lg" : "text-red-600 text-lg"
                      } />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-bold text-gray-800">
                          {request.bloodBankId?.name}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${
                          request.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {request.status === "completed" ? "✅ Completed" : "❌ Declined"}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaCalendarAlt className="flex-shrink-0 text-xs text-gray-400" />
                          {new Date(request.createdAt).toDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MdLocationOn className="flex-shrink-0 text-gray-400" />
                          {request.bloodBankId?.address?.city}, {request.bloodBankId?.address?.state}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MdPhone className="flex-shrink-0 text-gray-400" />
                          {request.bloodBankId?.phone}
                        </div>
                      </div>
                    </div>

                    {/* Blood Group */}
                    <div className="text-right flex-shrink-0">
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-bold">
                        {request.bloodGroup}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default DonationHistory;
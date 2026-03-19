import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTint, FaPhone } from "react-icons/fa";
import { MdLocationOn, MdAccessTime, MdMyLocation } from "react-icons/md";
import { getNearbyBloodBanks, proactiveDonate } from "../../services/donorService";

const NearbyBanks = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(null);

  useEffect(() => {
    fetchNearbyBanks();
  }, []);

  const fetchNearbyBanks = async () => {
    setLoading(true);
    try {
      const response = await getNearbyBloodBanks();
      setBanks(response.bloodBanks || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch nearby blood banks");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLoading(true);
        try {
          const response = await getNearbyBloodBanks(
            position.coords.longitude,
            position.coords.latitude
          );
          setBanks(response.bloodBanks || []);
          toast.success("Location refreshed!");
        } catch (error) {
          toast.error("Failed to fetch nearby blood banks");
        } finally {
          setLoading(false);
        }
      },
      () => toast.error("Location access denied")
    );
  };

  const handleDonate = async (bankId) => {
    setDonating(bankId);
    try {
      const response = await proactiveDonate({ bloodBankId: bankId });
      if (response.success) {
        toast.success("Donation request sent! Wait for blood bank confirmation.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send request");
    } finally {
      setDonating(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nearby Blood Banks</h1>
          <p className="text-gray-500 mt-1">Blood banks within 10km of your location</p>
        </div>
        <button
          onClick={handleRefreshLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
        >
          <MdMyLocation />
          Refresh
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-700">
          🩸 Click <span className="font-bold">Donate Here</span> to send a proactive donation request to a blood bank. They will confirm and you can visit them!
        </p>
      </div>

      {/* Count */}
      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
        {banks.length} blood banks found nearby
      </span>

      {/* List */}
      {banks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaTint className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No blood banks nearby</h3>
          <p className="text-gray-400 text-sm mt-1">
            No blood banks found within 10km of your location
          </p>
          <button
            onClick={handleRefreshLocation}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banks.map((bank) => (
            <div
              key={bank._id}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaTint className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{bank.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                      Blood Bank
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                      {bank.facilityCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaPhone className="text-gray-400 flex-shrink-0 text-xs" />
                  {bank.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdLocationOn className="text-gray-400 flex-shrink-0" />
                  {bank.address?.city}, {bank.address?.state} - {bank.address?.pincode}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdAccessTime className="text-gray-400 flex-shrink-0" />
                  {bank.is24x7
                    ? "Open 24x7"
                    : `${bank.operatingHours?.open} - ${bank.operatingHours?.close}`}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                
                 <a href={`tel:${bank.phone}`}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300 text-xs font-semibold rounded-lg transition-all"
                >
                  <FaPhone className="text-xs" />
                  Call
                </a>
                <button
                  onClick={() => handleDonate(bank._id)}
                  disabled={donating === bank._id}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-xs font-semibold rounded-lg transition-all"
                >
                  {donating === bank._id ? "Sending..." : "🩸 Donate Here"}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyBanks;
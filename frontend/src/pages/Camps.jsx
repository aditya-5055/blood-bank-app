import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaTint, FaSearch, FaMapMarkerAlt, FaCalendarAlt,
  FaClock, FaUsers, FaCheckCircle
} from "react-icons/fa";
import { MdBloodtype, MdLocationOn } from "react-icons/md";
import { getPublicCamps } from "../services/Publicservice";
import { apiConnector } from "../services/apiConnector";
import { DONOR_APIS } from "../services/apis";

const Camps = () => {
  const { token, role } = useSelector((state) => state.auth);
  const [city, setCity] = useState("");
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(null); // campId being registered
  const [registeredCamps, setRegisteredCamps] = useState([]); // campIds donor already registered

  // Load all upcoming camps on mount
  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async (searchCity = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await getPublicCamps(searchCity);
      setCamps(data.data || []);
    } catch (err) {
      setError("Failed to load camps. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCamps(city.trim());
  };

  const handleRegister = async (campId) => {
    if (!token) {
      // Redirect to login if not logged in
      window.location.href = "/donor/login";
      return;
    }
    setRegistering(campId);
    try {
      await apiConnector("POST", DONOR_APIS.REGISTER_FOR_CAMP(campId));
      setRegisteredCamps((prev) => [...prev, campId]);
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setRegistering(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getSpotsColor = (spotsLeft, capacity) => {
    const percent = (spotsLeft / capacity) * 100;
    if (percent <= 10) return "text-red-600 bg-red-50";
    if (percent <= 40) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaCalendarAlt className="text-white" />
            Upcoming Blood Donation Camps
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Find a Camp <br />
            <span className="text-yellow-300">Near You</span>
          </h1>
          <p className="text-red-100 mb-10 text-base md:text-lg max-w-xl mx-auto">
            Browse upcoming donation camps in your city. Register in one click and save lives.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-4 text-left flex gap-3"
          >
            <div className="flex-1 relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search by city e.g. Pune, Mumbai..."
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all shadow-md"
            >
              <FaSearch />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Camps List */}
      <section className="py-12 px-4 min-h-[50vh]">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          {!loading && !error && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {camps.length} Upcoming {camps.length === 1 ? "Camp" : "Camps"}
                  {city && <span className="text-gray-400 font-normal"> in {city}</span>}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">Sorted by nearest date</p>
              </div>
              {!token && (
                <Link
                  to="/donor/login"
                  className="text-sm text-red-600 font-semibold hover:underline"
                >
                  Login to Register →
                </Link>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading camps...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-red-500 font-medium">{error}</p>
              <button
                onClick={() => fetchCamps(city)}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Camps */}
          {!loading && !error && camps.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FaCalendarAlt className="text-red-300 text-2xl" />
              </div>
              <p className="text-gray-500 font-medium">No upcoming camps found</p>
              <p className="text-gray-400 text-sm mt-1">
                {city ? `Try searching a different city` : `Check back later for new camps`}
              </p>
            </div>
          )}

          {/* Camp Cards */}
          {!loading && !error && camps.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {camps.map((camp) => {
                const isRegistered = registeredCamps.includes(camp._id);
                const isFull = camp.spotsLeft <= 0;

                return (
                  <div
                    key={camp._id}
                    className="bg-white rounded-2xl shadow border border-gray-100 p-5 hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Camp Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaTint className="text-red-500 text-lg" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm leading-tight">{camp.name}</h3>
                          {camp.bloodBankId?.name && (
                            <p className="text-xs text-gray-400 mt-0.5">by {camp.bloodBankId.name}</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        camp.status === "ongoing"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        {camp.status === "ongoing" ? "🔴 Live" : "Upcoming"}
                      </span>
                    </div>

                    {/* Camp Details */}
                    <div className="space-y-2 mb-4 flex-1">
                      {camp.description && (
                        <p className="text-xs text-gray-500 leading-relaxed">{camp.description}</p>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCalendarAlt className="text-red-400 flex-shrink-0" />
                        <span>{formatDate(camp.campDate)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="text-blue-400 flex-shrink-0" />
                        <span>{camp.startTime} – {camp.endTime}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MdLocationOn className="text-orange-400 flex-shrink-0 mt-0.5 text-base" />
                        <span>
                          {camp.address?.street && `${camp.address.street}, `}
                          {camp.address?.city}, {camp.address?.state}
                        </span>
                      </div>

                      {/* Spots */}
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-gray-400 flex-shrink-0" />
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getSpotsColor(camp.spotsLeft, camp.capacity)}`}>
                          {isFull ? "Full" : `${camp.spotsLeft} spots left`}
                        </span>
                        <span className="text-xs text-gray-400">of {camp.capacity}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-red-500 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min((camp.totalRegistered / camp.capacity) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Register Button */}
                    {role === "donor" || !token ? (
                      <button
                        onClick={() => handleRegister(camp._id)}
                        disabled={isFull || isRegistered || registering === camp._id}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all mt-2 ${
                          isRegistered
                            ? "bg-green-100 text-green-600 cursor-default"
                            : isFull
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg"
                        }`}
                      >
                        {registering === camp._id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isRegistered ? (
                          <><FaCheckCircle /> Registered!</>
                        ) : isFull ? (
                          "Camp Full"
                        ) : !token ? (
                          "Login to Register →"
                        ) : (
                          <><FaTint /> Register for Camp</>
                        )}
                      </button>
                    ) : (
                      // Non-donor logged in — just show info
                      <div className="w-full text-center py-2 text-xs text-gray-400 bg-gray-50 rounded-xl mt-2">
                        Only donors can register for camps
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-red-600 text-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Want to Organize a Camp?
          </h2>
          <p className="text-red-100 mb-8">
            Blood banks can create and manage donation camps directly from their dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donor/register"
              className="inline-block px-8 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg"
            >
              🩸 Register as Donor
            </Link>
            <Link
              to="/facility/register"
              className="inline-block px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 border-2 border-white/30 transition-all"
            >
              🏥 Register Your Blood Bank
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Camps;
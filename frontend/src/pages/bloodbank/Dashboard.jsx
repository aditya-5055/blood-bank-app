import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaTint, FaHandHoldingHeart, FaCampground
} from "react-icons/fa";
import {
  MdInventory, MdBloodtype, MdPeople,
  MdCampaign, MdReceiptLong, MdLocalHospital
} from "react-icons/md";
import { getBloodBankProfile } from "../../services/bloodBankService";
import { getInventory } from "../../services/bloodBankService";
import { getDonationRequests } from "../../services/bloodBankService";
import { getBloodRequests } from "../../services/bloodBankService";
import Avatar from "../../components/ui/Avatar";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [donationRequests, setDonationRequests] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, inventoryRes, donationRes, bloodRes] = await Promise.all([
        getBloodBankProfile(),
        getInventory(),
        getDonationRequests(),
        getBloodRequests(),
      ]);
      setProfile(profileRes.bloodBank);
      setInventory(inventoryRes.summary);
      setDonationRequests(donationRes.requests || []);
      setBloodRequests(bloodRes.requests || []);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total stock
  const getTotalStock = () => {
    if (!inventory) return 0;
    return Object.values(inventory).reduce((sum, val) => sum + val, 0);
  };

  // Get low stock groups
  const getLowStockGroups = () => {
    if (!inventory) return [];
    return Object.entries(inventory)
      .filter(([_, units]) => units < 5)
      .map(([group]) => group);
  };

  const quickActions = [
    {
      title: "Inventory",
      description: "Manage blood stock",
      icon: MdInventory,
      path: "/bloodbank/inventory",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Donation Requests",
      description: "Proactive donor requests",
      icon: FaHandHoldingHeart,
      path: "/bloodbank/donation-requests",
      color: "bg-red-50",
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      badge: donationRequests.length,
    },
    {
      title: "Blood Requests",
      description: "Hospital blood requests",
      icon: MdLocalHospital,
      path: "/bloodbank/blood-requests",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      badge: bloodRequests.filter(r => !r.declinedByBloodBanks?.includes(profile?._id)).length,
    },
    {
      title: "Camps",
      description: "Manage donation camps",
      icon: MdCampaign,
      path: "/bloodbank/camps",
      color: "bg-green-50",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Transactions",
      description: "View transaction history",
      icon: MdReceiptLong,
      path: "/bloodbank/transactions",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const lowStockGroups = getLowStockGroups();

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {profile?.name}! 🏥
            </h1>
            <p className="text-blue-100 mt-1 text-sm">
              Manage your blood bank operations
            </p>
          </div>
          <div className="hidden md:block">
            <Avatar name={profile?.name} size="xl" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaTint className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{getTotalStock()}</p>
          <p className="text-xs text-gray-500 mt-1">Total Units</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaHandHoldingHeart className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{donationRequests.length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending Donors</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MdLocalHospital className="text-orange-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{bloodRequests.length}</p>
          <p className="text-xs text-gray-500 mt-1">Hospital Requests</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MdBloodtype className="text-purple-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{lowStockGroups.length}</p>
          <p className="text-xs text-gray-500 mt-1">Low Stock Groups</p>
        </div>
      </div>

      {/* Location Warning */}
      {profile?.location?.coordinates?.[0] === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div>
              <h3 className="font-bold text-red-700">Location Not Set!</h3>
              <p className="text-sm text-red-600 mt-1">
                Your location is not set. Hospitals cannot find you for blood requests.
              </p>
              <Link
                to="/bloodbank/profile"
                className="inline-block mt-2 text-xs font-semibold text-red-600 underline"
              >
                Update Location from Profile →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Warning */}
      {lowStockGroups.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-yellow-500 text-xl">⚠️</div>
            <div>
              <h3 className="font-bold text-yellow-700">Low Stock Alert!</h3>
              <p className="text-sm text-yellow-600 mt-1">
                These blood groups are running low (less than 5 units):{" "}
                <span className="font-bold">{lowStockGroups.join(", ")}</span>
              </p>
              <Link
                to="/bloodbank/inventory"
                className="inline-block mt-2 text-xs font-semibold text-yellow-600 underline"
              >
                Update Inventory →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Blood Stock Summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Blood Stock Summary</h2>
          <Link to="/bloodbank/inventory" className="text-sm text-red-600 font-semibold hover:underline">
            View Details →
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {inventory && Object.entries(inventory).map(([group, units]) => (
            <div
              key={group}
              className={`bg-white rounded-xl shadow p-3 text-center ${
                units < 5 ? "border-2 border-yellow-400" : ""
              }`}
            >
              <p className="text-sm font-bold text-red-600">{group}</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{units}</p>
              <p className="text-xs text-gray-400">units</p>
              {units < 5 && (
                <span className="text-xs text-yellow-600 font-medium">Low</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-all relative"
            >
              {action.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {action.badge}
                </span>
              )}
              <div className={`w-10 h-10 ${action.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <action.icon className={`text-xl ${action.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">{action.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending Donation Requests */}
      {donationRequests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Pending Donor Requests
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-sm rounded-full">
                {donationRequests.length}
              </span>
            </h2>
            <Link to="/bloodbank/donation-requests" className="text-sm text-red-600 font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {donationRequests.slice(0, 3).map((req) => (
              <div key={req._id} className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaTint className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{req.donorId?.fullName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {req.bloodGroup} • {req.donorId?.phone}
                  </p>
                </div>
                <Link
                  to="/bloodbank/donation-requests"
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-all"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
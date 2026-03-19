import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTint } from "react-icons/fa";
import { MdAdd, MdRemove, MdInventory } from "react-icons/md";
import { getInventory, updateInventory } from "../../services/bloodBankService";
import { BLOOD_GROUPS } from "../../constants/bloodGroups";

const Inventory = () => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    units: "",
    source: "manual",
    reason: "",
    donorPhone: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await getInventory();
      setInventory(response);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setFormData({
      bloodGroup: "",
      units: "",
      source: "manual",
      reason: "",
      donorPhone: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.bloodGroup || !formData.units) {
      toast.error("Please fill all required fields");
      return;
    }
    if (modalType === "remove" && !formData.reason) {
      toast.error("Please provide reason for removal");
      return;
    }

    setSubmitting(true);
    try {
      const response = await updateInventory({
        bloodGroup: formData.bloodGroup,
        units: Number(formData.units),
        action: modalType === "add" ? "add" : "remove",
        source: formData.source,
        reason: formData.reason,
        donorPhone: formData.donorPhone,
      });
      if (response.success) {
        toast.success(response.message);
        setShowModal(false);
        fetchInventory();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update inventory");
    } finally {
      setSubmitting(false);
    }
  };

  const getExpiryColor = (status) => {
    switch (status) {
      case "critical": return "text-red-600 bg-red-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "safe": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
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
          <h1 className="text-2xl font-bold text-gray-800">Blood Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your blood stock</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal("remove")}
            className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all"
          >
            <MdRemove />
            Remove Stock
          </button>
          <button
            onClick={() => handleOpenModal("add")}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <MdAdd />
            Add Stock
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {inventory?.summary && Object.entries(inventory.summary).map(([group, units]) => (
          <div
            key={group}
            className={`bg-white rounded-xl shadow p-3 text-center ${
              units < 5 ? "border-2 border-yellow-400" : "border border-gray-100"
            }`}
          >
            <p className="text-sm font-bold text-red-600">{group}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{units}</p>
            <p className="text-xs text-gray-400">units</p>
            {units < 5 && (
              <p className="text-xs text-yellow-600 font-medium mt-1">⚠️ Low</p>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Inventory */}
      <div className="space-y-4">
        {inventory?.details && Object.entries(inventory.details).map(([group, data]) => (
          <div key={group} className="bg-white rounded-2xl shadow p-5">

            {/* Group Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTint className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{group}</h3>
                  <p className="text-sm text-gray-500">{data.total} units available</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {data.isLowStock && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-xs rounded-full font-medium">
                    ⚠️ Low Stock
                  </span>
                )}
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                  data.total === 0 ? "bg-red-100 text-red-600" :
                  data.total < 5 ? "bg-yellow-100 text-yellow-600" :
                  "bg-green-100 text-green-600"
                }`}>
                  {data.total} units
                </span>
              </div>
            </div>

            {/* Batches */}
            {data.batches.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">No stock available</p>
            ) : (
              <div className="space-y-2">
                {data.batches.map((batch) => (
                  <div
                    key={batch.batchId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{batch.units} units</p>
                        <p className="text-xs text-gray-500">
                          Source: {batch.source} •
                          Collected: {new Date(batch.collectionDate).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getExpiryColor(batch.expiryStatus)}`}>
                        {batch.daysRemaining} days left
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        Expires: {new Date(batch.expiryDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Add/Remove Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">

            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {modalType === "add" ? "➕ Add Blood Stock" : "➖ Remove Blood Stock"}
            </h2>

            <div className="space-y-4">

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group *</label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                      className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        formData.bloodGroup === bg
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-gray-200 text-gray-600 hover:border-red-300"
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Units *</label>
                <input
                  type="number"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  min={1}
                  placeholder="Enter units"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              {/* Source — only for add */}
              {modalType === "add" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    >
                      <option value="manual">Manual Entry</option>
                      <option value="walk-in">Walk-in Donor</option>
                    </select>
                  </div>
                  {formData.source === "walk-in" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Donor Phone (Optional — to link donor)
                      </label>
                      <input
                        type="text"
                        value={formData.donorPhone}
                        onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                        placeholder="Enter donor phone number"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Reason — only for remove */}
              {modalType === "remove" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  >
                    <option value="">Select reason</option>
                    <option value="expired">Expired</option>
                    <option value="damaged">Damaged</option>
                    <option value="used">Used for patient</option>
                    <option value="transferred">Transferred to another bank</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex-1 py-2.5 text-white font-semibold text-sm rounded-xl transition-all ${
                  modalType === "add"
                    ? "bg-red-600 hover:bg-red-700 disabled:bg-red-300"
                    : "bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400"
                }`}
              >
                {submitting ? "Processing..." : modalType === "add" ? "Add Stock" : "Remove Stock"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 z-10">

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
          <span className="text-2xl">🚪</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
          {title || "Are you sure?"}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-500 text-center mb-6">
          {message || "This action cannot be undone."}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-sm shadow-md"
          >
            Yes, Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmationModal;
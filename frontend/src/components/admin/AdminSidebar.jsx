import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";
import { ADMIN_LINKS } from "../../data/sidebar-links";import { MdLogout } from "react-icons/md";
import ConfirmationModal from "../common/ConfirmationModal";
import Avatar from "../ui/Avatar";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <aside className="hidden md:flex fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-gray-100 flex-col z-40">

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.name || "Admin"}
              </p>
              <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {ADMIN_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                }`
              }
            >
              <link.icon className="text-lg flex-shrink-0" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <MdLogout className="text-lg flex-shrink-0" />
            Logout
          </button>
        </div>

      </aside>

      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout from BloodConnect?"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default AdminSidebar;
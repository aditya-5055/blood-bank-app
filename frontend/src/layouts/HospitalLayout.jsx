import { Outlet } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import HospitalSidebar from "../components/hospital/HospitalSidebar";
import PublicNavbar from "../components/common/PublicNavbar";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { HOSPITAL_LINKS } from "../data/sidebar-links";
import { logout } from "../slices/authSlice";
import { MdLogout } from "react-icons/md";

const HospitalLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const bottomLinks = HOSPITAL_LINKS.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <div className="flex">
        <HospitalSidebar />
        <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 py-2">
        <div className="flex items-center justify-around">
          {bottomLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                  isActive ? "text-red-600" : "text-gray-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className={`text-xl ${isActive ? "text-red-600" : "text-gray-400"}`} />
                  <span className={`text-[10px] font-medium ${isActive ? "text-red-600" : "text-gray-400"}`}>
                    {link.name.split(" ")[0]}
                  </span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-gray-400 hover:text-red-600 transition-all"
          >
            <MdLogout className="text-xl" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout from BloodConnect?"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default HospitalLayout;
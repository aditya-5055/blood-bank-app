import { Outlet } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import DonorSidebar from "../components/donor/DonorSidebar";
import PublicNavbar from "../components/common/PublicNavbar";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { DONOR_LINKS } from "../data/sidebar-links";
import { logout } from "../slices/authSlice";
import { MdLogout, MdMenu, MdClose } from "react-icons/md";

const DonorLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const confirmLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // ✅ First 4 links in bottom nav
  const primaryLinks = DONOR_LINKS.slice(0, 4);
  // ✅ Remaining links in "More" menu
  const moreLinks = DONOR_LINKS.slice(4);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <div className="flex">
        <DonorSidebar />
        <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 py-2">
        <div className="flex items-center justify-around">

          {/* Primary Links — first 4 */}
          {primaryLinks.map((link) => (
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

          {/* ✅ More Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-gray-400 hover:text-red-600 transition-all"
          >
            {showMoreMenu
              ? <MdClose className="text-xl text-red-600" />
              : <MdMenu className="text-xl" />
            }
            <span className={`text-[10px] font-medium ${showMoreMenu ? "text-red-600" : "text-gray-400"}`}>
              More
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-gray-400 hover:text-red-600 transition-all"
          >
            <MdLogout className="text-xl" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>

        </div>
      </div>

      {/* ✅ More Menu Popup */}
      {showMoreMenu && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 py-3 shadow-lg">
          <p className="text-xs text-gray-400 font-semibold uppercase mb-2">More Options</p>
          <div className="space-y-1">
            {moreLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setShowMoreMenu(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                  }`
                }
              >
                <link.icon className="text-lg flex-shrink-0" />
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}

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

export default DonorLayout;
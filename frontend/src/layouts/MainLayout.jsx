import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/common/PublicNavbar";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
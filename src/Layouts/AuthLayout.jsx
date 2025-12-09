import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* top nav */}
      <Navbar />

      {/* auth content area */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md mx-auto px-4">
          <Outlet />
        </div>
      </main>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;

import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ⬅️ Back to Home
          </Link>
        </div>

        {/* Routed content */}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

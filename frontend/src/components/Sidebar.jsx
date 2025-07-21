// src/components/Sidebar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import {
  BookOpenIcon,
  ShapesIcon,
  LogOutIcon,
} from "lucide-react"; // or use react-icons if preferred

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/dashboard/books", label: "Books", icon: <BookOpenIcon size={18} /> },
    { to: "/dashboard/genres", label: "Genres", icon: <ShapesIcon size={18} /> },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-8 tracking-tight">📘 Admin Panel</h2>
      <nav className="space-y-4 flex-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive(link.to)
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition-colors mt-auto"
      >
        <LogOutIcon size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;

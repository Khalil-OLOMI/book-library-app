import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext"; // <-- import your auth context

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { isAuthenticated } = useContext(AuthContext); // <-- check if user is logged in

  useEffect(() => {
    api
      .get("/books")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.books || res.data.data || [];
        setBooks(data);
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
      });
  }, []);

  // Filter books based on search
  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();
    return (
      book.title?.toLowerCase().includes(search) ||
      book.author?.name?.toLowerCase().includes(search) ||
      book.genre?.name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search bar */}
      <header className="bg-white shadow px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Logo */}
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
            📚 Book Library
          </h1>

          {/* Center: Search bar */}
          <input
            type="text"
            placeholder="Search by title, author, or genre"
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Right: Auth buttons + Manage (if logged in) */}
          <div className="flex gap-3 justify-end flex-wrap">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition"
              >
                🛠 Manage
              </Link>
            )}
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Books</h2>

        {filteredBooks.length === 0 ? (
          <p className="text-gray-600 text-lg">No matching books found.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  📘 {book.title}
                </h3>
                <p className="text-gray-700 mb-1">✍️ {book.author?.name}</p>
                <p className="text-gray-600 mb-2">🎭 {book.genre?.name}</p>
                {book.description && (
                  <p className="text-sm text-gray-500 mt-2">
                    {book.description.length > 100
                      ? book.description.slice(0, 100) + "..."
                      : book.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

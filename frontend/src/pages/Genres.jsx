import { useEffect, useState } from "react";
import api from "../services/api";

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await api.get("/genres");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setGenres(data);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/genres/${editingId}`, { name });
      } else {
        await api.post("/genres", { name });
      }

      setName("");
      setEditingId(null);
      fetchGenres();
    } catch (err) {
      console.error("Error saving genre:", err.response?.data || err.message);
    }
  };

  const handleEdit = (genre) => {
    setName(genre.name);
    setEditingId(genre.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this genre?")) {
      try {
        await api.delete(`/genres/${id}`);
        fetchGenres();
      } catch (err) {
        console.error("Error deleting genre:", err);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🎭 Manage Genres</h2>

      {/* Genre Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <input
          type="text"
          placeholder="Genre Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Genre" : "Add Genre"}
        </button>
      </form>

      {/* Genre List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <span className="font-medium">{genre.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(genre)}
                className="text-sm bg-yellow-400 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(genre.id)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genres;

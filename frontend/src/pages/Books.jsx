import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre_id: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, genresRes] = await Promise.all([
        api.get("/books"),
        api.get("/genres"),
      ]);

      setBooks(Array.isArray(booksRes.data) ? booksRes.data : booksRes.data.data || []);
      setGenres(Array.isArray(genresRes.data) ? genresRes.data : genresRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch books or genres:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let authorId;

    try {
      const authorRes = await api.post("/authors", { name: form.author });
      authorId = authorRes.data?.data?.id;
    } catch (err) {
      if (err.response?.status === 409) {
        try {
          const listRes = await api.get("/authors");
          const match = listRes.data.find(
            (a) => a.name.toLowerCase() === form.author.toLowerCase()
          );
          if (match) {
            authorId = match.id;
          } else {
            alert("Author exists but ID could not be found.");
            return;
          }
        } catch (fetchErr) {
          console.error("Error fetching authors:", fetchErr);
          return;
        }
      } else {
        console.error("Author creation error:", err);
        return;
      }
    }

    const payload = {
      title: form.title,
      description: form.description,
      author_id: authorId,
      genre_id: form.genre_id,
    };

    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, payload);
      } else {
        await api.post("/books", payload);
      }

      setForm({ title: "", author: "", genre_id: "", description: "" });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Failed to save book:", err.response?.data || err.message);
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author?.name || "",
      genre_id: book.genre?.id || "",
      description: book.description || "",
    });
    setEditingId(book.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this book?")) {
      try {
        await api.delete(`/books/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        📘 Book Manager
      </h1>

      {/* Book Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        <input
          type="text"
          placeholder="Book Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="col-span-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <input
          type="text"
          placeholder="Author Name"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <select
          value={form.genre_id}
          onChange={(e) => setForm({ ...form, genre_id: e.target.value })}
          className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Short description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="col-span-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        ></textarea>

        <button
          type="submit"
          className="col-span-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl transition"
        >
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </form>

      {/* Book List */}
      {books.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No books yet. Add one above!</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;

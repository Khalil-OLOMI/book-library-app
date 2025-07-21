// src/components/BookCard.jsx
const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-2xl transition">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
        <p className="text-gray-600 mt-1">✍️ {book.author?.name}</p>
        <p className="text-gray-600">🎭 {book.genre?.name}</p>
        {book.description && (
          <p className="text-sm text-gray-500 mt-3">{book.description}</p>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onEdit(book)}
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;

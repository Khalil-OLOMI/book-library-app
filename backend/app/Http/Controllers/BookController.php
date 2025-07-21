<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/books
     * Public list of all books with author + genre
     */
    public function index()
    {
        $books = Book::with(['author', 'genre'])->get();
        return $this->success($books);
    }

    /**
     * GET /api/books/{id}
     * Public single book details
     */
    public function show($id)
    {
        $book = Book::with(['author', 'genre'])->find($id);
        if (!$book) {
            return $this->error('Book not found', 404);
        }

        return $this->success($book);
    }

    /**
     * POST /api/books
     * Create a new book (requires auth)
     */
    public function store(Request $request)
    {
        // Duplicate: same title by same author
        $exists = Book::whereRaw('LOWER(title) = ?', [strtolower($request->title)])
            ->where('author_id', $request->author_id)
            ->exists();

        if ($exists) {
            return $this->error('This book by the same author already exists.', 409);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author_id' => 'required|exists:authors,id',
            'genre_id' => 'required|exists:genres,id',
            'published_at' => 'nullable|date'
        ]);

        $book = Book::create($validated);
        return $this->success($book, 'Book created', 201);
    }

    /**
     * PUT /api/books/{book}
     * Update a book (requires auth)
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                Rule::unique('books')->ignore($book->id)->where(function ($query) use ($request) {
                    return $query
                        ->whereRaw('LOWER(title) = ?', [strtolower($request->title)])
                        ->where('author_id', $request->author_id);
                })
            ],
            'description' => 'nullable|string',
            'author_id' => 'required|exists:authors,id',
            'genre_id' => 'required|exists:genres,id',
            'published_at' => 'nullable|date'
        ]);

        $book->update($validated);
        return $this->success($book, 'Book updated');
    }

    /**
     * DELETE /api/books/{book}
     * Delete a book (requires auth)
     */
    public function destroy(Book $book)
    {
        $book->delete();
        return $this->success(null, 'Book deleted', 204);
    }
}

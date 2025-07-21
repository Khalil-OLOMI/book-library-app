<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AuthorController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/authors
     * List all authors
     */
    public function index()
    {
        return $this->success(Author::all());
    }

    /**
     * GET /api/authors/{author}
     * Show a specific author
     */
    public function show(Author $author)
    {
        return $this->success($author);
    }

    /**
     * POST /api/authors
     * Create a new author
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string'
        ]);
    
        // 🔁 Return existing author instead of 409 conflict
        $existingAuthor = Author::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->first();
    
        if ($existingAuthor) {
            return $this->success($existingAuthor, 'Author already exists', 200);
        }
    
        $author = Author::create([
            'name' => $request->name,
            'bio' => $request->bio,
        ]);
    
        return $this->success($author, 'Author created', 201);
    }


    /**
     * PUT /api/authors/{author}
     * Update an author
     */
    public function update(Request $request, Author $author)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('authors')->ignore($author->id)->where(function ($query) use ($request) {
                    return $query->whereRaw('LOWER(name) = ?', [strtolower($request->name)]);
                }),
            ],
            'bio' => 'nullable|string'
        ]);

        $author->update($validated);
        return $this->success($author, 'Author updated');
    }

    /**
     * DELETE /api/authors/{author}
     * Delete an author
     */
    public function destroy(Author $author)
    {
        $author->delete();
        return $this->success(null, 'Author deleted', 204);
    }
}

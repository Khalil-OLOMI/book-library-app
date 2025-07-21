<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GenreController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/genres
     * List all genres
     */
    public function index()
    {
        return $this->success(Genre::all());
    }

    /**
     * GET /api/genres/{genre}
     * Show a specific genre
     */
    public function show(Genre $genre)
    {
        return $this->success($genre);
    }

    /**
     * POST /api/genres
     * Create a new genre
     */
    public function store(Request $request)
    {
        // Check for case-insensitive duplicate
        $exists = Genre::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->exists();
        if ($exists) {
            return $this->error('Genre already exists.', 409); // 409 Conflict
        }

        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $genre = Genre::create($validated);
        return $this->success($genre, 'Genre created', 201);
    }

    /**
     * PUT /api/genres/{genre}
     * Update a genre
     */
    public function update(Request $request, Genre $genre)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('genres')->ignore($genre->id)->where(function ($query) use ($request) {
                    return $query->whereRaw('LOWER(name) = ?', [strtolower($request->name)]);
                }),
            ],
        ]);

        $genre->update($validated);
        return $this->success($genre, 'Genre updated');
    }

    /**
     * DELETE /api/genres/{genre}
     * Delete a genre
     */
    public function destroy(Genre $genre)
    {
        $genre->delete();
        return $this->success(null, 'Genre deleted', 204);
    }
}

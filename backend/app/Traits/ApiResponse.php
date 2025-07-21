<?php

namespace App\Traits;

trait ApiResponse
{
    protected function success($data = null, $message = null, $status = 200)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], $status);
    }

    protected function error($message = 'Something went wrong', $status = 500)
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], $status);
    }
}

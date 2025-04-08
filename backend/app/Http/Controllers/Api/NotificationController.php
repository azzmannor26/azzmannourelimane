<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)->where('read', false)->get();
        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        $notification = Notification::find($id);
        if ($notification->user_id != auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->read = true;
        $notification->save();

        return response()->json(['message' => 'Notification marquée comme lue.']);
    }
}

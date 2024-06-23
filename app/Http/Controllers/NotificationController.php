<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::id());
        $unreadNotifications = $user->unreadNotifications;
        $readNotifications = $user->readNotifications;
        return Inertia::render('Notifications/Index', compact('unreadNotifications', 'readNotifications'));
    }

    public function markAsRead(string $id)
    {
        $user = User::find(Auth::id());
        $notification = $user->notifications()->where('id', $id)->first();
        $notification->markAsRead();
        return redirect()->back()->with('success', 'Notification marked as read.');
    }

    public function markAsUnread(string $id)
    {
        $user = User::find(Auth::id());
        $notification = $user->notifications()->where('id', $id)->first();
        $notification->markAsUnread();
        return redirect()->back()->with('success', 'Notification marked as unread.');
    }

    public function markAllAsRead()
    {
        $user = User::find(Auth::id());
        $user->unreadNotifications->markAsRead();
        return redirect()->back()->with('success', 'All notifications marked as read.');
    }

    public function delete( string $id)
    {
        $user = User::find(Auth::id());
        $notification = $user->notifications()->where('id', $id)->first();
        $notification->delete();
        return redirect()->back()->with('success', 'Notification deleted successfully.');
    }
}

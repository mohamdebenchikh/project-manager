<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use App\Notifications\TeamInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeamInvitationController extends Controller
{
    public function sendInvitation(Request $request, Team $team)
    {
        Gate::authorize('invite', $team);

        $request->validate([
            'email' => 'required|email',
            'role' => 'required|string|exists:roles,name',
        ]);

        $role = Role::where('name', $request->role)->firstOrFail();
        $token = Str::random(32);

        $invitation = Invitation::create([
            'team_id' => $team->id,
            'user_id' => Auth::id(),
            'role_id' => $role->id,
            'email' => $request->email,
            'token' => $token,
        ]);

        $user = User::where('email', $request->email)->first();
        if ($user) {
            $user->notify(new TeamInvitationNotification($invitation));
        } else {
            // Optional: Send an email with the invitation link to the provided email address
        }

        return redirect()->back()->with('success', 'Invitation sent successfully.');
    }

    public function acceptInvitation(Request $request, string $token)
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();
        $user = User::find(Auth::id());

        $invitation->team->members()->attach($user->id, ['role_id' => $invitation->role_id]);
        $invitation->delete();

        $notification = $user->notifications()->where('id', $request->notification_id)->first();
        if ($notification) {
            $notification->delete();
        }

        return redirect()->back()->with('success', 'Invitation accepted successfully.');
    }

    public function showPendingInvitations(Team $team)
    {
        Gate::authorize('view', $team);

        $invitations = Invitation::where('team_id', $team->id)->get();

        return Inertia::render('Teams/Invitations', ['team' => $team, 'invitations' => $invitations]);
    }

    public function cancelInvitation(Invitation $invitation)
    {
        Gate::authorize('invite', $invitation->team);

        $invitation->delete();

        return redirect()->route('teams.show', $invitation->team->id)->with('success', 'Invitation cancelled successfully.');
    }

    public function suggestUsers(Request $request, Team $team)
    {
        $email = $request->input('email');
        $members = $team->members->pluck('email')->toArray();
        $users = User::where('email', 'like', '%' . $email . '%')->whereNotIn('email', $members)->limit(5)->get()->pluck('email');
        return response()->json($users);
    }

    public function declineInvitation(Request $request, string $token)
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();
        $user = User::find(Auth::id());

        $notification = $user->notifications()->where('id', $request->notification_id)->first();
        if ($notification) {
            $notification->delete();
        }

        $invitation->delete();

        return redirect()->back()->with('success', 'Invitation declined successfully.');
    }
}

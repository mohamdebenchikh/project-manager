<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class TeamMemberController extends Controller
{
    public function destroy(Team $team,User $user)
    {
        Gate::authorize('update', $team);
        $team->members()->detach($user->id);
        return redirect()->back()->with('success', 'User removed successfully.');
    }

    public function update(Request $request, Team $team,User $user)
    {
        Gate::authorize('update', $team);
        $request->validate(['role_id' => 'required|numeric|exists:roles,id']);
        $team->members()->updateExistingPivot($user->id, ['role_id' => $request->role_id]);
        return redirect()->back()->with('success', 'Role updated successfully.');
    }
}

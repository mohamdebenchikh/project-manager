<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Auth::user()->teams;
        return Inertia::render('Teams/Index', ['teams' => $teams]);
    }

    public function create()
    {
        return Inertia::render('Teams/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $user_id = Auth::user()->id;
        $data['owner_id'] = $user_id;
        $team = Team::create($data);
        $adminRole = Role::where('name', 'admin')->first();
        $team->members()->attach($user_id, ['role_id' => $adminRole->id]);
        return redirect()->route('teams.edit', $team->id)->with('success', 'Team created successfully.');
    }

    public function show(Team $team)
    {
        Gate::authorize('view', $team);
        return Inertia::render('Teams/Show', ['team' => $team]);
    }

    public function edit(Team $team)
    {
        Gate::authorize('update', $team);
        
        $team->load(['members' => function ($query) use ($team) {
            $query->where('users.id', '!=', $team->owner_id)
                ->select('users.id', 'users.name', 'users.photo', 'users.email')
                ->withPivot('role_id');
        },'owner' => function ($query) {
            $query->select('users.id', 'users.name', 'users.photo', 'users.email');
        }]);

        $roles = Role::all();

        foreach ($team->members as $member) {
            $role = $roles->where('id', $member->pivot->role_id)->first();
            if ($role) {
                $member->role = $role->name;
            }
        }
        
        return Inertia::render('Teams/Edit', ['team' => $team, 'roles' => $roles]);
    }

    public function update(Request $request, Team $team)
    {
        Gate::authorize('update', $team);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $team->update($data);

        return redirect()->back()->with('success', 'Team updated successfully.');
    }

    public function destroy(Team $team)
    {
        Gate::authorize('delete', $team);
        $team->delete();

        return redirect()->route('teams.index')->with('success', 'Team deleted successfully.');
    }

    public function change(Team $team)
    {
        Gate::authorize('view', $team);
        $user = User::find(Auth::id());
        $user->current_team_id = $team->id;
        $user->save();
        return redirect()->to(route('dashboard'));
    }
}

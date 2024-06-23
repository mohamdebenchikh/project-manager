<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $team = auth()->user()->currentTeam;
        $projects = Project::withCount('tasks')->where('team_id', $team->id)->get();
        return Inertia::render('Projects/Index', compact('projects'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        Gate::authorize('create', Project::class);
        $data =  $request->validate([
            'name' => 'required|max:255|min:3|max:255|unique:projects,name',
            'description' => 'nullable|string|max:500',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $user = auth()->user();
        $data['user_id'] = $user->id;
        $data['team_id'] = $user->current_team_id;
        $project = Project::create($data);

        if ($project) {
            return redirect()->route('projects.index')->with('success', 'Project created successfully.');
        }
        return redirect()->back()->with('error', 'Project creation failed.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $slug)
    {
        $data =  $request->validate([
            'name' => ['required', 'max:255', 'min:3', 'max:255', Rule::unique('projects')->ignore($slug, 'slug')],
            'description' => 'nullable|string|max:500',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $project = Project::where('slug', $slug)->firstOrFail();
        Gate::authorize('update', $project);
        $is_updated = $project->update($data);

        if ($is_updated) {
            return redirect()->route('projects.index')->with('success', 'Project updated successfully.');
        }
        return redirect()->back()->with('error', 'Project update failed.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $slug)
    {
        $project = Project::where('slug', $slug)->firstOrFail();
        Gate::authorize('delete', $project);
        $is_deleted = $project->delete();

        if ($is_deleted) {
            return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
        }
        return redirect()->back()->with('error', 'Project deletion failed.');
    }
}

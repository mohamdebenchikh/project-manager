<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use App\Models\Task;
use App\Models\User;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $team = $user->currentTeam;
        $tasks = Task::with(['project', 'assignees' => function ($query) use ($user) {
            $query->whereNotIn('users.id', [$user->id])
                ->select('users.id', 'users.name', 'users.photo', 'users.email');
        }])->where('team_id', $team->id)
            ->get();

        $projects = Project::where('team_id', $team->id)->get();
        return Inertia::render('Tasks/Index', compact('tasks', 'projects'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'max:255', 'min:3', 'max:255'],
            'description' => 'nullable|string|max:500',
            'project_id' => ['nullable', 'exists:projects,id'],
        ]);

        if ($data['project_id'] !== null) {
            $project = Project::where('id', $data['project_id'])->firstOrFail();
            Gate::authorize('update', $project);
        }

        $user = auth()->user();
        $data['user_id'] = $user->id;
        $data['team_id'] = $user->currentTeam->id;
        $data['status'] = 'pending';
        Task::create($data);
        return redirect()->to(route('tasks.index'))->with('success', 'Task created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = auth()->user();
        $task = Task::where('team_id', $user->currentTeam->id)
            ->with([
                'assignees' => function ($query) {
                    $query->select('users.id', 'users.name', 'users.photo', 'users.email');
                },
                'checklistItems' => function ($query) {
                    $query->orderBy('position', 'asc');
                }
            ])
            ->findOrFail($id);

        Gate::authorize('update', $task);

        $projects = Project::where('team_id', $user->currentTeam->id)->get();
        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'projects' => $projects,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'title' => ['required', 'max:255', 'min:3', 'max:255'],
            'description' => 'nullable|string|max:500',
            'status' => ['required', 'in:pending,in_progress,completed'],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'project_id' => ['nullable', 'exists:projects,id'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'pinned' => ['nullable', 'boolean', 'in:0,1'],
            'labels' => ['nullable', 'array'],
        ]);

        if ($data['project_id'] !== null) {
            $project = Project::where('id', $data['project_id'])->firstOrFail();
            Gate::authorize('update', $project);
        }

        $user = auth()->user();
        Gate::authorize('view', $user->currentTeam);
        $task = Task::where('team_id', $user->currentTeam->id)->findOrFail($id);
        $task->update($data);
        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = auth()->user();
        $task = Task::where('user_id', $user->currentTeam->id)->findOrFail($id);
        $task->delete();
        return redirect()->to(route('tasks.index'))->with('success', 'Task deleted successfully.');
    }

    public function destroyAll(Request $request)
    {

        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:tasks,id'],
        ]);

        $user = auth()->user()->id;
        Task::where('user_id', $user->currentTeam->id)->whereIn('id', $request->ids)->delete();
        return redirect()->back()->with('success', 'Tasks deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Task;

class TaskAssignmentController extends Controller
{
    public function index(Request $request, $id)
    {
        $search = $request->query('search', '');
        $task = Task::with('assignees')->findOrFail($id);
        $assignees = $this->getAssignees($task);
        $assigneesIds = $assignees->pluck('id')->toArray();

        $users = User::where('id', '!=', auth()->user()->id)
            ->when(!empty($search), function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            })
            ->limit(5)
            ->get()
            ->transform(function ($user) use ($assigneesIds) {
                $user->assigned = in_array($user->id, $assigneesIds);
                return $user;
            });

        return Inertia::render('Tasks/AssignTo', [
            'users' => $users,
            'task' => $task,
            'assignees' => $assignees
        ]);
    }

    public function assign(Request $request, $id)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $userId = auth()->user()->id;
        $task = Task::where('user_id', $userId)->findOrFail($id);
        $task->assignees()->syncWithoutDetaching($request->user_id);
        return redirect()->back()->with('success', 'Task assigned successfully.');
    }

    public function unassign(Request $request, $id)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);
        $userId = auth()->user()->id;
        $task = Task::where('user_id', $userId)->findOrFail($id);
        $task->assignees()->detach($request->user_id);
        return redirect()->back()->with('success', 'Task unassigned successfully.');
    }

    private function getAssignees($task)
    {
        $userId = auth()->user()->id;
        $assignees = $task->assignees()->where('task_user.user_id', '!=', $userId)->select('users.id', 'users.name', 'users.photo', 'users.email')->get();
        $assignees->transform(function ($user) {
            $user->assigned = true;
            return $user;
        });
        return $assignees;
    }
}

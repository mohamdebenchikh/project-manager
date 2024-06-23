<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\ChecklistItem;

class ChecklistController extends Controller
{
    public function store(Request $request, Task $task)
    {

        if ($task->user_id !== auth()->id()) {
            throw new \Exception('This task does not belong to you.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'completed' => 'required|boolean',
        ]);

        $checklistItem =  $task->checklistItems()->create([
            'title' => $request->title,
            'completed' => $request->completed
        ]);

        $checklistItem->position = $checklistItem->id;
        $checklistItem->save();

        return response()->json($checklistItem);
    }


    public function update(Request $request, Task $task, ChecklistItem $checklist)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'completed' => 'required|boolean',
            'position' => 'nullable|integer',
        ]);

        $task = Task::where('id', $task->id)->where('user_id', auth()->id())->firstOrFail();
        $checklistItem = $task->checklistItems()->findOrFail($checklist->id);
        $checklistItem->update([
            'title' => $request->title,
            'completed' => $request->completed,
            'position' => $request->position ?? $checklistItem->id,
        ]);
        return response()->json($checklistItem);
    }

    public function  destroy(Task $task, ChecklistItem $checklist){
        $task = Task::where('id', $task->id)->where('user_id', auth()->id())->firstOrFail();
        $checklistItem = $task->checklistItems()->findOrFail($checklist->id);
        $checklistItem->delete();
        return response()->json($checklistItem);
    }


    public function updatePositions(Request $request,Task $task)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:checklist_items,id',
            'items.*.position' => 'required|integer',
        ]);

        $task = Task::where('id', $task->id)->where('user_id', auth()->id())->firstOrFail();

        foreach ($request->items as $item) {
            $checklistItem = $task->checklistItems()->findOrFail($item['id']);
            $checklistItem->position = $item['position'];
            $checklistItem->save();
        }

        return response()->json($request->items);
    }
}

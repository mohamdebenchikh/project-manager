<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChecklistItem extends Model
{
    use HasFactory;
    
    protected $table = 'checklist_items';
    protected $fillable = [
        'task_id',
        'title',
        'position',
        'completed',
    ];


    public function task()
    {
        return $this->belongsTo(Task::class);
    }   
}

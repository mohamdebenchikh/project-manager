<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $table = 'tasks';
    protected $fillable = [
        'title','description','start_date','end_date','team_id',
        'pinned','priority','labels','status','project_id','user_id'
    ];


    public function project()
    {
        return $this->belongsTo(Project::class);
    }   

    public function assignees()
    {
        return $this->belongsToMany(User::class,'task_user');
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function checklistItems(){
        return $this->hasMany(ChecklistItem::class,'task_id');
    }

    public function team(){
        return $this->belongsTo(Team::class);
    }
}

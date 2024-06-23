<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';
    protected $fillable = [
        'name','slug','description','user_id','team_id'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }  

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
    
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

}

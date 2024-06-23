<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name','photo','about','email','password','current_team_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function tasks()
    {
        return $this->belongsToMany(Task::class);
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class)->withPivot('role_id')->withTimestamps();
    }

    public function roleInTeam($teamId)
    {
        return $this->teams()->where('team_id', $teamId)->first()->pivot->role_id;
    }

    public function ownedTeams()
    {
        return $this->hasMany(Team::class, 'owner_id');
    }

    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }

    public function currentTeam()
    {
        return $this->belongsTo(Team::class, 'current_team_id','id');
    }

    public function isAdmin(Team $team)
    {
        $roleId = $this->roleInTeam($team->id);
        return $roleId === Role::where('name', 'admin')->first()->id;
    }

}

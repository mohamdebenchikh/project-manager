<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TeamPolicy
{
    use HandlesAuthorization;

    private $adminRoleId;

    public function __construct()
    {
        $this->adminRoleId = Role::where('name', 'admin')->first()->id;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Team $team): bool
    {
        return $user->teams->contains($team);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Team $team): bool
    {
        return $this->isAdmin($user, $team);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Team $team): bool
    {
        return $this->isAdmin($user, $team);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Team $team): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Team $team): bool
    {
        return true;
    }

    /**
     * Determine whether the user can invite to the team.
     */
    public function invite(User $user, Team $team): bool
    {
        return $this->isAdmin($user, $team);
    }

    /**
     * Check if the user is an admin of the team.
     */
    private function isAdmin(User $user, Team $team): bool
    {
        return $user->teams()->where('team_id', $team->id)->wherePivot('role_id', $this->adminRoleId)->exists();
    }
}

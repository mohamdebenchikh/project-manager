<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
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
    public function view(User $user, Project $project): bool
    {
        $team = $user->currentTeam;
        return $project->team_id == $team->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        $team = $user->currentTeam;
        return $user->isAdmin($team);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        $team = $user->currentTeam;
        return ($project->team_id == $team->id && ($user->id === $project->user_id || $user->isAdmin($team)));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        $team = $user->currentTeam;
        return ($project->team_id == $team->id && ($user->id === $project->user_id || $user->isAdmin($team)));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        return false;
    }
}


<?php

use App\Http\Controllers\ChecklistController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskAssignmentController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamInvitationController;
use App\Http\Controllers\TeamMemberController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Home page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Image upload
    Route::post('/images', [ImageController::class, 'store'])->name('images.upload');

    // Projects
    Route::resource('/projects', ProjectController::class);

    // Tasks
    Route::resource('/tasks', TaskController::class);
    Route::get('/tasks/{id}/assignTo', [TaskAssignmentController::class, 'index'])->name('task-assignment.index');
    Route::post('/tasks/{id}/assign', [TaskAssignmentController::class, 'assign'])->name('task-assignment.assign');
    Route::post('/tasks/{id}/unassign', [TaskAssignmentController::class, 'unassign'])->name('task-assignment.unassign');

    // Checklist
    Route::post('/tasks/{task}/checklist', [ChecklistController::class, 'store'])->name('checklist.store');
    Route::put('/tasks/{task}/checklist/{checklist}', [ChecklistController::class, 'update'])->name('checklist.update');
    Route::put('/tasks/{task}/checklist/update/position', [ChecklistController::class, 'updatePositions'])->name('checklist.update.position');
    Route::delete('/tasks/{task}/checklist/{checklist}', [ChecklistController::class, 'destroy'])->name('checklist.destroy');

    // Delete all tasks
    Route::delete('/delete/all/tasks', [TaskController::class, 'destroyAll'])->name('tasks.destroyAll');

    // Teams
    Route::resource('/teams', TeamController::class);
    Route::post('/teams/{team}/change', [TeamController::class, 'change'])->name('teams.change');

    // Team invitation
    Route::get('/team-inivitation/{team}/suggestions/users', [TeamInvitationController::class, 'suggestUsers'])->name('team-invitation.suggestions');
    Route::post('/team-inivitation/{team}/send', [TeamInvitationController::class, 'send'])->name('team-invitation.send');
    Route::post('team-invitation/{token}/accept', [TeamInvitationController::class, 'accept'])->name('team-invitation.accept');
    Route::post('/team-invitation/{token}/decline', [TeamInvitationController::class, 'decline'])->name('team-invitation.decline');
    Route::post('/team-invitation/{token}/cancel', [TeamInvitationController::class, 'cancel'])->name('team-invitation.cancel');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::get('/notifications/{id}/unread', [NotificationController::class, 'markAsUnread'])->name('notifications.markAsUnread');
    Route::delete('/notifications/{id}/delete', [NotificationController::class, 'delete'])->name('notifications.delete');
    Route::get('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');

    // team member
    Route::post('/teams/{team}/members/{user}', [TeamMemberController::class, 'update'])->name('team-members.update');
    Route::delete('/teams/{team}/members/{user}', [TeamMemberController::class, 'destroy'])->name('team-members.destroy');

});

// Auth routes
require __DIR__ . '/auth.php';

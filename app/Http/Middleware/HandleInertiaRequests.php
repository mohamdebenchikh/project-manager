<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Filter user data to include only specific attributes.
     *
     * @param \App\Models\User|null $user
     * @return array|null
     */
    protected function filterUserData($user): ?array
    {
        if (!$user) {
            return null;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'photo' => $user->photo,
            'about' => $user->about,
        ];
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => ['user' => $this->filterUserData($request->user())],
            'notifications' => $request->user() ? $this->filterNotifications($request->user()->unreadNotifications) : [],
            'teams' => $request->user() ? $request->user()->teams : [],
            'currentTeam' => $request->user() ? $request->user()->currentTeam : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Filter notifications to exclude sensitive information.
     *
     * @param \Illuminate\Database\Eloquent\Collection $notifications
     * @return array
     */
    protected function filterNotifications($notifications): array
    {
        return $notifications->map(function ($notification) {
            return array_merge(
                $notification->data, [
                    'id' => $notification->id,
                     'read_at' => $notification->read_at,
                      'created_at' => $notification->created_at,
                    ]);
        })->toArray();
    }
}

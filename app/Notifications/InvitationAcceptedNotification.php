<?php

namespace App\Notifications;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvitationAcceptedNotification extends Notification
{
    use Queueable;

    protected $invitation;

    /**
     * Create a new notification instance.
     */
    public function __construct(Invitation $invitation)
    {
        $this->invitation = $invitation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The user ' . $this->invitation->user->name . ' has accepted your invitation to join the team: ' . $this->invitation->team->name)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $user = User::where('email', $this->invitation->email)->first();
        return [
            'type' => 'invitation_accepted',
            'data' => [
                'team_id' => $this->invitation->team_id,
                'team_name' => $this->invitation->team->name,
                'accepted_by' => $user->name,
                'accepted_by_photo' => $user->photo,
                'accepted_by_id' => $user->id,
                'role_name' => $this->invitation->role->name,
            ]
        ];
    }
}

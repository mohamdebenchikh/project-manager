<?php

namespace App\Notifications;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamInvitationNotification extends Notification
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
        $url = route('team-invitation.accept', $this->invitation->token);
        return (new MailMessage)
            ->line('You have been invited to join the team: ' . $this->invitation->team->name)
            ->action('Accept Invitation', $url)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'team_invitation',
            'data' => [
                'team_id' => $this->invitation->team_id,
                'team_name' => $this->invitation->team->name,
                'role_name' => $this->invitation->role->name,
                'invited_by' => $this->invitation->user->name,
                'invitation_token' => $this->invitation->token,
            ]
        ];
    }
}

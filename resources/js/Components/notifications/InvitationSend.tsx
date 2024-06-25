import { router } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/types";
import { generateAvatarFromUsername } from "@/lib/utils";
import { Button } from "@/Components/ui/button";

const InvitationSend = ({ notification }: { notification: Notification }) => {
    const data = notification.data;

    const handleAccept = () => {
        router.post(route("team-invitation.accept", data?.invitation_token), {
            notification_id: notification.id,
        });
    };

    const handleDecline = () => {
        router.post(route("team-invitation.decline", data?.invitation_token), {
            notification_id: notification.id,
        });
    };

    return (
        <div className="flex items-start gap-2">
            <Avatar className="w-10 h-10">
                <AvatarFallback>{data?.team_name[0]}</AvatarFallback>
                <AvatarImage
                    src={generateAvatarFromUsername(data?.team_name)}
                />
            </Avatar>
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-primary">
                            Team Invitation
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                                new Date(notification?.created_at as string)
                            )}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        You have been invited to join the team {data?.team_name}{" "}
                        as a {data?.role_name} by {data?.invited_by}.
                    </p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <Button
                        size={"sm"}
                        onClick={() => handleDecline()}
                        variant={"secondary"}
                        className="w-full"
                    >
                        Decline
                    </Button>
                    <Button
                        size={"sm"}
                        onClick={() => handleAccept()}
                        className="w-full"
                    >
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InvitationSend;

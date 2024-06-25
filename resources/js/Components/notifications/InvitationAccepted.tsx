import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/types";
import { generateAvatarFromUsername } from "@/lib/utils";

const InvitationAccepted = ({
    notification,
}: {
    notification: Notification;
}) => {
    const data = notification.data;

    return (
        <div className="flex items-start gap-2">
            <Avatar className="w-10 h-10">
                <AvatarFallback>{data?.accepted_by[0]}</AvatarFallback>
                <AvatarImage
                    src={data?.accepted_by_photo ??  generateAvatarFromUsername(data?.accepted_by)}
                />
            </Avatar>
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-primary">
                           {data?.accepted_by}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                                new Date(notification?.created_at as string)
                            )}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        You, {data?.accepted_by}, have accepted the invitation to join the team {data?.team_name}{" "}
                        as a {data?.role_name}.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InvitationAccepted;

import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { usePage } from "@inertiajs/react";
import { PageProps, Notification } from "@/types";
import InvitationAccepted from "./notifications/InvitationAccepted";
import InvitationSend from "./notifications/InvitationSend";
import { Button } from "./ui/button";

const NotificationDropdown = () => {
    const { notifications } = usePage<PageProps>().props;

    const renderNotification = (notification: Notification) => {
        switch (notification.type) {
            case "team_invitation":
                return (
                    <DropdownMenuItem
                        key={notification.id}
                        className="py-2 my-2"
                    >
                        <InvitationSend notification={notification} />
                    </DropdownMenuItem>
                );
            case "invitation_accepted":
                return (
                    <DropdownMenuItem
                        key={notification.id}
                        className="py-2 my-2"
                    >
                        <InvitationAccepted notification={notification} />
                    </DropdownMenuItem>
                );
            // Add other case statements for different notification types here
            default:
                return null; // Or render a default notification component
        }
    };

    if (notifications.length === 0) {
        return (
            <button className="inline-flex relative items-center justify-center rounded-md p-2 text-muted-foreground hover:text-primary">
                <Bell className="h-5 w-5" />
            </button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="inline-flex relative items-center justify-center rounded-md p-2 text-muted-foreground hover:text-primary">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 text-xs right-0 h-4 w-4 text-primary flex items-center justify-center rounded-full bg-red-500">
                            {notifications.length}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map(renderNotification)}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="py-2 flex justify-center">
                    View all notifications
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;

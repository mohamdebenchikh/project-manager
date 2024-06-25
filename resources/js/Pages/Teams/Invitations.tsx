import { router, usePage } from "@inertiajs/react";
import { Invitation, PageProps, Team, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/Components/ui/button";

function InvitationItem({
    invitation,
    currentUser,
    team,
}: {
    invitation: Invitation;
    currentUser: User;
    team: Team;
}) {
    return (
        <li className="rounded-lg p-4 hover:bg-primary-foreground">
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <p className="font-light text-sm ">
                        {invitation.user.id === currentUser.id
                            ? "You"
                            : invitation.user.name}{" "}
                        invited
                        <b className="font-extrabold"> {invitation.email} </b>
                        to join {team.name} as a {invitation.role.name}.
                    </p>
                    <small className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                                new Date(invitation.created_at)
                            )}
                        </small>
                </div>
                <div>
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.post(
                                route(
                                    "team-invitation.cancel",
                                    invitation.token
                                )
                            )
                        }
                        size="sm"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </li>
    );
}

export default function PendingInvitations() {

    const { auth, invitations, team } = usePage<PageProps>().props;

    if(invitations.length === 0) {
        return (
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    No pending invitations
                </p>
            </div>
        )
    }

    return (
        <ul className="space-y-2">
            {invitations.map((invitation) => (
                <InvitationItem
                    key={invitation.id}
                    invitation={invitation}
                    currentUser={auth.user}
                    team={team}
                />
            ))}
        </ul>
    );
}

// src/components/TeamMembers.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Team, User } from "@/types";
import { generateAvatarFromUsername } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    EditIcon,
    Ellipsis,
    UserCircle,
    UserMinus2,
    UserPlus2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";

type TeamMembersProps = {
    members: User[];
    team: Team;
};

const MemberItem = ({ member, team }: { member: User; team: Team }) => (
    <li className="hover:bg-muted py-2 px-3 rounded-lg">
        <div className="flex items-center space-x-2">
            <Avatar>
                <AvatarImage
                    src={
                        member.photo ?? generateAvatarFromUsername(member.name)
                    }
                    alt={member.name}
                />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 items-center justify-between">
                <div className="flex flex-col">
                    <p className="text-primary font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {member.email}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={"icon"} variant={"ghost"}>
                                <Ellipsis className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <EditIcon className="w-4 h-4 mr-2" />
                                Edit membership
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <UserCircle className="w-4 h-4 mr-2" />
                                View profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link
                                    href={route("team-members.destroy", [
                                        team.id,
                                        member.id,
                                    ])}
                                    method="delete"
                                    as="button"
                                    className="flex items-center"
                                >
                                    <UserMinus2 className="w-4 h-4 mr-2" />
                                    Remove from team
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    </li>
);

const TeamMembers = ({ members, team }: TeamMembersProps) => (
    <Card>
        <CardHeader>
            <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
            <ul className="grid gap-4">
                {members.map((member) => (
                    <MemberItem team={team} key={member.id} member={member} />
                ))}
            </ul>
        </CardContent>
    </Card>
);

export default TeamMembers;

import { User } from "@/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { generateAvatarFromUsername } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

type AvatarGroupProps = {
    users: User[];
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users }) => {
    return (
        <div className="flex items-center -space-x-2">
            {users.map((user: User) => (
                <TooltipProvider  key={user.id}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Avatar className="w-9 h-9 border">
                                <AvatarImage
                                    src={
                                        user.photo ??
                                        generateAvatarFromUsername(user.name)
                                    }
                                ></AvatarImage>
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>{user.name}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
};

export default AvatarGroup;

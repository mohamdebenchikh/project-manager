import { User } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOutIcon, UserCircle } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Avatar ,AvatarImage, AvatarFallback} from "./ui/avatar";
import { generateAvatarFromUsername } from "@/lib/utils";



export default function UserDropdown({ user }: { user: User }) {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar className="w-9 h-9">
                <AvatarImage
                    src={
                        user.photo ??
                        generateAvatarFromUsername(user.name)
                    }
                />
                <AvatarFallback>
                    {user.name[0]}
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuLabel>
                My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                <Link href={route("profile.edit")}>
                    Profile
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
                <LogOutIcon className="w-4 h-4" />
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                >
                    Log out
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    )
}
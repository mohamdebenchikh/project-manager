import * as React from "react";
import { Check, ChevronsUpDown, Cog, PlusCircle, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { PageProps, Team, User } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { useToast } from "./ui/use-toast";

export default function TeamDropdown({
    teams,
    className,
    currentTeam,
    onCreate,
}: {
    teams: Team[];
    className?: string;
    currentTeam?: Team;
    onCreate?: () => void;
}) {
    const [open, setOpen] = React.useState(false);
    const { toast } = useToast();
    const page = usePage<PageProps>();
    const { user } = page.props.auth;

    const changeTeam = (team: Team) => {
        if (team.id === currentTeam?.id) {
            setOpen(false);
            return;
        }

        router.post(
            route("teams.change", team.id),
            {},
            {
                onSuccess: () => {
                    toast({
                        title: "Team changed",
                        description: `You are now in ${team.name} team`,
                    });
                },
                onFinish: () => setOpen(false),
            }
        );
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    size={"sm"}
                    aria-expanded={open}
                    className={`w-[200px] justify-between ${cn(className)}`}
                >
                    {currentTeam
                        ? teams.find((team) => team.id === currentTeam?.id)
                              ?.name
                        : "Select team..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search Team..." />
                    <CommandList>
                        <CommandEmpty>No team found.</CommandEmpty>
                        <CommandGroup heading="All Teams">
                            {teams.map((team) => (
                                <CommandItem
                                    key={team.id}
                                    onSelect={() => changeTeam(team)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            currentTeam?.id === team.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {team.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                            {user?.id === currentTeam?.owner_id && (
                                <CommandItem
                                    onSelect={() =>
                                        router.get(
                                            route("teams.edit", currentTeam?.id)
                                        )
                                    }
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Team Settings
                                </CommandItem>
                            )}
                            <CommandItem onSelect={onCreate}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create new team
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

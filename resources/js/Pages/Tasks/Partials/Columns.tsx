import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Task, User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    Calendar,
    ChevronsUpDown,
    EditIcon,
    EyeIcon,
    MoreHorizontal,
    Trash2Icon,
    User2Icon,
    UserIcon,
    UserPlus2,
} from "lucide-react";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/Components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import { Link, router } from "@inertiajs/react";
import { AvatarFallback, AvatarImage, Avatar } from "@/Components/ui/avatar";
import { generateAvatarFromUsername } from "@/lib/utils";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import UsersListItem from "./UserListItem";

const ActionsDropdown = ({
    task,
    deleteTask,
}: {
    task: Task;
    deleteTask: (task: Task) => void;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0 mx-auto">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        router.get(route("task-assignment.index", task.id))
                    }
                >
                    <User2Icon className="mr-2 h-4 w-4" />
                    Assign to ...
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.get(route("tasks.edit", task.id))}
                >
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => deleteTask(task)}
                    className="text-red-500"
                >
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const renderBadge = (
    value: string,
    map: Record<string, "default" | "outline" | "destructive">
) => {
    const variant = map[value] || "secondary";
    const formattedValue = value.replace(/_/g, " ").toUpperCase();
    return <Badge variant={variant}>{formattedValue}</Badge>;
};

const renderAvatarGroup = (users: User[], task: Task) => (
    <div className="flex items-center -space-x-4">
        {users.length > 0 ? (
            users.map((user) => (
                <HoverCard key={user.id}>
                    <HoverCardTrigger asChild>
                        <Avatar className="h-8 w-8 border-2 cursor-pointer">
                            <AvatarImage
                                src={
                                    user.photo ??
                                    generateAvatarFromUsername(user.name)
                                }
                                alt={user.name}
                            />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="min-w-[300px] p-4">
                        <UsersListItem
                            className="flex-col gap-4"
                            preserveScroll={true}
                            preserveState={false}
                            alignItems="start"
                            user={{ ...user, assigned: true }}
                            task={task}
                        />
                    </HoverCardContent>
                </HoverCard>
            ))
        ) : (
            <Button
                variant={"ghost"}
                onClick={() =>
                    router.get(route("task-assignment.index", task.id))
                }
                size={"sm"}
            >
                <UserPlus2 className="me-2 h-4 w-4" />
                Assign to ...
            </Button>
        )}
    </div>
);

export const taskColumns = ({
    deleteTask,
}: {
    deleteTask: (task: Task) => void;
}): ColumnDef<Task>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={row.getToggleSelectedHandler()}
                value={row.original.id}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "id",
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Title
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <p className="text-sm max-w-[250px] text-nowrap text-ellipsis overflow-hidden">
                {row.original.title}
            </p>
        ),
    },
    {
        id: "project",
        header: "Project",
        cell: ({ row }) =>
            row.original.project ? row.original.project.name : "-",
        enableSorting: false,
    },
    {
        accessorKey: "assigned_to",
        header: "Assigned To",
        cell: ({ row }) => {
            const users = row.original.assignees || [];

            return renderAvatarGroup(users, row.original);
        },
        enableSorting: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusMap: Record<
                string,
                "default" | "outline" | "destructive"
            > = {
                pending: "outline",
                in_progress: "default",
                completed: "destructive",
            };
            return renderBadge(status, statusMap);
        },
        enableSorting: false,
    },
    {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.original.priority;
            const priorityMap: Record<
                string,
                "default" | "outline" | "destructive"
            > = {
                low: "outline",
                medium: "default",
                high: "destructive",
            };

            return renderBadge(priority, priorityMap);
        },
    },
    {
        id: "start_date",
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => (
            <p className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />{" "}
                {format(new Date(row.original.start_date), "PP")}
            </p>
        ),
    },
    {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => (
            <p className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />{" "}
                {format(new Date(row.original.end_date), "PP")}
            </p>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const task = row.original;
            return <ActionsDropdown deleteTask={deleteTask} task={task} />;
        },
        enableSorting: false,
        enableHiding: false,
    },
];

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";
import { User, Task } from "@/types";
import { router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";

interface UsersListItemProps {
    user: User;
    task: Task | null;
    preserveState?: boolean;
    preserveScroll?: boolean;
    justify?: string;
    alignItems?: string;
    className? : string;
}

const LoadingSpinner = () => {
    return (
        <div>
            <svg
                className="animate-spin h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

const UsersListItem: React.FC<UsersListItemProps> = ({
    user,
    task,
    preserveScroll = true,
    preserveState = true,
    justify = "left",
    alignItems = "center",
    className = ""
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [assignedStatus, setAssignedStatus] = useState<boolean>(
        user.assigned
    );
    const { toast } = useToast();

    const handleAssignment = () => {
        const routeName = user.assigned
            ? "task-assignment.unassign"
            : "task-assignment.assign";
        router.post(
            route(routeName, task?.id),
            {
                user_id: user.id,
            },
            {
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
                preserveScroll: preserveScroll,
                preserveState: preserveState,
                onSuccess: (page: any) => {
                    toast({
                        title: "Success",
                        description: page.props.flash.success as string,
                    });
                    setAssignedStatus(!assignedStatus);
                },
            }
        );
    };

    return (
        <div className={`flex items-start gap-3 w-full`}>
            <Avatar>
                <AvatarImage
                    src={
                        user.photo ??
                        `https://avatar.iran.liara.run/username?username=${user.name}`
                    }
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div
                className={`flex-1 flex items-${alignItems} justify-${justify} gap-2 ${className}`}
            >
                <div className="flex-1 leading-5">
                    <p className="text-primary">{user.name}</p>
                    <p className="text-muted-foreground text-sm">
                        {user.email}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAssignment}
                    disabled={loading}
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : assignedStatus ? (
                        <>
                            <MinusCircle className="w-4 h-4 mr-2" />
                            Unassign
                        </>
                    ) : (
                        <>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Assign
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default UsersListItem;

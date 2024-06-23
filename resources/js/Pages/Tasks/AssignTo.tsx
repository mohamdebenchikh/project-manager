import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { useState } from "react";
import UsersListItem from "./Partials/UserListItem";
import { Button } from "@/Components/ui/button";

const SkeletonPlaceholder = () => {
    const placeholderItems = Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            <Skeleton className="h-8 w-[80px] rounded-lg" />
        </div>
    ));

    return <div className="space-y-6">{placeholderItems}</div>;
};

export default function AssignTo({ auth, users, task, assignees }: PageProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [usersList, setUsersList] = useState<User[]>(users);
    const [assigneesList, setAssigneesList] = useState<User[]>(assignees);

    const handleSearch = () => {
        router.get(
            route("task-assignment.index", task.id),
            {
                search: search,
            },
            {
                replace: true,
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page: any) => {
                    setUsersList(page.props.users);
                    setAssigneesList(page.props.assignees);
                },
                onStart: () => {
                    setLoading(true);
                },
                onFinish: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}
        
        breadcrumbs={[
            { name: "Dashboard", href: route("dashboard"), current: false },
            { name: "Tasks", href: route("tasks.index"), current: false },
            { name: task.title, href: route("tasks.edit", task.id), current: false },
            { name: "Assign To", href: route("task-assignment.index",task.id), current: true },
        ]}>
            <Head title="tasks" />
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center relative flex-1">
                                <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-8"
                                    placeholder="Search for user"
                                />
                            </div>
                            <Button
                                variant="default"
                                disabled={loading}
                                size={"sm"}
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <SkeletonPlaceholder />
                        ) : (
                            <div className=" flex flex-col gap-8">
                                {users.length > 0 ? (
                                    usersList.map((user) => (
                                        <UsersListItem
                                            key={user.id}
                                            task={task}
                                            user={user}
                                        />
                                    ))
                                ) : search !== "" ? (
                                    <p className="text-center">No user found</p>
                                ) : (
                                    assigneesList.map((user) => (
                                        <UsersListItem
                                            key={user.id}
                                            task={task}
                                            user={user}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

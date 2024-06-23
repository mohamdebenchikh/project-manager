import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEvent, FormEventHandler, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { DatePicker } from "@/Components/DatePicker";
import {
    ArrowUpCircle,
    CheckCircle,
    Pin,
    Save,
    Trash2,
    UserPlus2,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import Checklist from "./Partials/Checklist";
import DeleteDialog from "./Partials/DeleteDialog";
import UsersListItem from "./Partials/UserListItem";

export default function Edit({ auth, projects, task }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title,
        project_id: task.project_id,
        description: task.description,
        status: task.status,
        start_date: task.start_date ? new Date(task.start_date) : new Date(),
        end_date: task.end_date ? new Date(task.end_date) : new Date(),
        priority: task.priority,
        pinned: task.pinned,
    });

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const submit: FormEventHandler = (e: FormEvent) => {
        e.preventDefault();
        put(route("tasks.update", task.id));
    };

    const deleteTask = () => {
        setShowDeleteDialog(true);
    };

    const confirmDeleteTask = () => {
        router.delete(route("tasks.destroy", task.id));
    };

    const completeTask = () => {
        setData("status", "completed");
        put(route("tasks.update", task.id));
    };

    const uncompleteTask = () => {
        setData("status", "pending");
        put(route("tasks.update", task.id));
    };

    const pinTask = () => {
        setData("pinned", 1);
        put(route("tasks.update", task.id));
    };

    const unpinTask = () => {
        setData("pinned", 0);
        put(route("tasks.update", task.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={[
                { name: "Dashboard", href: route("dashboard"), current: false },
                { name: "Tasks", href: route("tasks.index"), current: false },
                {
                    name: task.title,
                    href: route("tasks.edit", task.id),
                    current: true,
                },
            ]}
        >
            <DeleteDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={confirmDeleteTask}
            />
            <Head title="tasks" />
            <form onSubmit={submit} className="max-w-6xl mx-auto">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center col-span-3 justify-between">
                        <div></div>
                        <div className="flex items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={
                                                task.pinned
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            type="button"
                                            onClick={
                                                task.pinned
                                                    ? unpinTask
                                                    : pinTask
                                            }
                                            size={"icon"}
                                        >
                                            <Pin className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {task.pinned
                                            ? "Unpin Task"
                                            : "Pin Task"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {data.status == "completed" && (
                                <Button
                                    variant={"secondary"}
                                    type="button"
                                    onClick={uncompleteTask}
                                    size={"sm"}
                                >
                                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                                    Uncomplete
                                </Button>
                            )}
                            {data.status != "completed" && (
                                <Button
                                    variant={"default"}
                                    type="button"
                                    onClick={completeTask}
                                    size={"sm"}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Complete
                                </Button>
                            )}

                            <Button
                                variant={"destructive"}
                                type="button"
                                onClick={deleteTask}
                                size={"sm"}
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Task
                            </Button>
                            <Button
                                type="submit"
                                variant={"default"}
                                size={"sm"}
                                disabled={processing}
                            >
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Task</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">
                                            Task title
                                        </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            name="title"
                                            value={data.title}
                                            className="mt-2 block"
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.title}
                                        />
                                    </div>
                                    {projects.length > 0 && (
                                        <div>
                                            <Label htmlFor="project_id">
                                                Project
                                            </Label>
                                            <Select
                                                defaultValue={
                                                    data.project_id as unknown as string
                                                }
                                                onValueChange={(value: any) =>
                                                    setData(
                                                        "project_id",
                                                        value ?? null
                                                    )
                                                }
                                            >
                                                <SelectTrigger className=" mt-2">
                                                    <SelectValue placeholder="Select a project" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {projects.map((project) => (
                                                        <SelectItem
                                                            key={project.id}
                                                            value={project.id.toString()}
                                                        >
                                                            {project.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                className="mt-2"
                                                message={errors.project_id}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            defaultValue={data.description}
                                            className="w-full mt-2 block"
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.description}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Checklist
                            checklist={task.checklist_items}
                            taskId={task.id}
                        />

                        <Card>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle>Assigned to</CardTitle>
                                    <Button
                                        variant={"default"}
                                        type="button"
                                        size={"sm"}
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "task-assignment.index",
                                                    task.id
                                                )
                                            )
                                        }
                                    >
                                        <UserPlus2 className="h-4 w-4 mr-2" />
                                        Assign to
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-6">
                                        {task.assignees &&
                                            task.assignees.map((user) => (
                                                <UsersListItem
                                                    task={task}
                                                    user={{
                                                        ...user,
                                                        assigned: true,
                                                    }}
                                                />
                                            ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Due Date</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="start_date">
                                        Start Date
                                    </Label>
                                    <DatePicker
                                        defaultValue={data.start_date}
                                        className="w-full mt-2"
                                        onValueChange={(e: Date) =>
                                            setData("start_date", e)
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.start_date}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="end_date">End Date</Label>
                                    <DatePicker
                                        defaultValue={data.end_date}
                                        className="w-full mt-2"
                                        onValueChange={(e: Date) =>
                                            setData("end_date", e)
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.end_date}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        defaultValue={data.status}
                                        onValueChange={(value) =>
                                            setData("status", value)
                                        }
                                    >
                                        <SelectTrigger className=" mt-2">
                                            <SelectValue placeholder="Task Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"pending"}>
                                                Pending
                                            </SelectItem>
                                            <SelectItem value={"in_progress"}>
                                                In progress
                                            </SelectItem>
                                            <SelectItem value={"completed"}>
                                                Completed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.status}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select
                                        defaultValue={data.priority}
                                        onValueChange={(value) =>
                                            setData("priority", value)
                                        }
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Task Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"low"}>
                                                Low
                                            </SelectItem>
                                            <SelectItem value={"medium"}>
                                                Medium
                                            </SelectItem>
                                            <SelectItem value={"high"}>
                                                High
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.priority}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}

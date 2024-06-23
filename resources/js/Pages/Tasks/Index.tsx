import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Task } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
import { useEffect, useState } from "react";
import { DataTable } from "@/Components/DataTable";
import { PlusCircle } from "lucide-react";
import { taskColumns } from "./Partials/Columns";
import DeleteDialog from "./Partials/DeleteDialog";
import { FilterByPriority, FilterByStatus } from "./Partials/CustomFilters";
import CreateNewTaskDialog from "./Partials/CreateNewTaskDialog";

export default function Index({ auth, tasks, flash, projects }: PageProps) {
    const { toast } = useToast();
    const [deletedTaskId, setDeletedTaskId] = useState<string>("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
    const [selectedTasks, setSelectedTasks] = useState<any>([]);
    const handleSuccess = (page: { props: PageProps }) => {
        const { props } = page;
        const { success } = props.flash;
        if (success) {
            toast({
                title: "Success",
                description: success as string,
            });
        }

        setDeletedTaskId("");
        setOpenDeleteDialog(false);
        setOpenCreateDialog(false);
    };

    const deleteTask = (task: Task) => {
        setDeletedTaskId(task.id.toString());
        setOpenDeleteDialog(true);
    };

    const deleteAllTasks = () => {
        setOpenDeleteDialog(false);
        setDeletedTaskId("");
        const taskIds = selectedTasks.map((task: any) => task.id);
        router.delete(route("tasks.destroyAll"), {
            data: { ids: taskIds },
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: any) => handleSuccess(page),
            onFinish: () => {
                setOpenDeleteDialog(false);
                setDeletedTaskId("");
                setSelectedTasks([]);
            },
        });
    };

    const confirmDeleteTask = () => {
        if (deletedTaskId) {
            router.delete(route("tasks.destroy", deletedTaskId), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page: any) => handleSuccess(page),
                onFinish: () => {
                    setOpenDeleteDialog(false);
                    setDeletedTaskId("");
                },
            });
        } else if (selectedTasks.length > 0) {
            deleteAllTasks();
        }
    };

    useEffect(() => {
        if (flash.success) {
            toast({
                title: "Success",
                description: flash.success as string,
            });
        }
    }, [flash.success]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={[
                { name: "Dashboard", href: route("dashboard"), current: false },
                { name: "Tasks", href: route("tasks.index"), current: true },
            ]}
        >
            <Head title="tasks" />

            <DeleteDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
                onConfirm={confirmDeleteTask}
                count={selectedTasks.length}
            />

            <CreateNewTaskDialog
                onClose={() => setOpenCreateDialog(false)}
                onSuccess={handleSuccess}
                open={openCreateDialog}
                projects={projects}
                onOpenChange={() => setOpenCreateDialog(false)}
            />

            <DataTable
                data={tasks}
                columns={taskColumns({ deleteTask })}
                onSelectChange={(rows) => setSelectedTasks(rows)}
                searchBy="title"
                searchable
                searchPlaceholder="Filter tasks..."
                customActions={() => {
                    return (
                        <div className="flex items-center gap-2">
                            {selectedTasks.length > 0 && (
                                <Button variant={"destructive"} onClick={() => setOpenDeleteDialog(true)} size={"sm"}>
                                    Delete ({selectedTasks.length})
                                </Button>
                            )}
                            <Button
                                variant={"default"}
                                size={"sm"}
                                onClick={() => setOpenCreateDialog(true)}
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                New Task
                            </Button>
                        </div>
                    );
                }}
                customFilters={({ table }) => (
                    <>
                        <FilterByStatus
                            onValueChange={(value) =>
                                table.getColumn("status")?.setFilterValue(value)
                            }
                        />
                        <FilterByPriority
                            onValueChange={(value) =>
                                table
                                    .getColumn("priority")
                                    ?.setFilterValue(value)
                            }
                        />
                    </>
                )}
            />
        </AuthenticatedLayout>
    );
}

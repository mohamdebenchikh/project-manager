import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogClose,
    DialogFooter,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Project } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { PlusCircle } from "lucide-react";
import { FormEvent, FormEventHandler, useState } from "react";
import { useToast } from "@/Components/ui/use-toast";
import { DataTable } from "@/Components/DataTable";
import { projectColumns } from "./Partilas/Columns";
import DeleteDialog from "./Partilas/DeleteDialog";
import CreateAndEditDialog from "./Partilas/CreateAndEditDialog";

export default function Projects({ auth, projects }: PageProps) {
    const { toast } = useToast();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedProject, setEditedProject] = useState<Project>();
    const [deletedProjectSlug, setDeletedProjectSlug] = useState<string>("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const closeDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setEditedProject(undefined);
    };

    const createNewProject = () => {
        setEditMode(false);
        setOpenDialog(true);
    };

    const editProject = (project: Project) => {
        setEditMode(true);
        setEditedProject(project);
        setOpenDialog(true);
    };

    const handleSuccess = (page: { props: PageProps }) => {
        const { props } = page;
        const { success } = props.flash;
        if (success) {
            toast({
                title: "Success",
                description: success as string,
            });
        }

        setEditedProject(undefined);
        setEditMode(false);
        setOpenDialog(false);
        setDeletedProjectSlug("");
        setOpenDeleteDialog(false);
    };

    const deleteProject = (project: Project) => {
        setDeletedProjectSlug(project.slug);
        setOpenDeleteDialog(true);
    };

    const confirmDeleteProject = () => {
        setOpenDeleteDialog(false);
        setDeletedProjectSlug("");

        if (deletedProjectSlug) {
            router.delete(route("projects.destroy", deletedProjectSlug), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page: any) => handleSuccess(page),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={[
                { name: "Dashboard", href: route("dashboard"), current: false },
                {
                    name: "Projects",
                    href: route("projects.index"),
                    current: true,
                },
            ]}
        >
            <Head title="Projects" />

            <DeleteDialog
                open={openDeleteDialog}
                onConfirm={confirmDeleteProject}
                onOpenChange={(open) => setOpenDeleteDialog(open)}
            />
            <CreateAndEditDialog
                onClose={() => closeDialog()}
                onSuccess={(page: { props: PageProps }) => handleSuccess(page)}
                open={openDialog}
                onOpenChange={(open) => setOpenDialog(open)}
                editMode={editMode}
                project={editedProject as Project}
            />
            <DataTable
                columns={projectColumns({ editProject, deleteProject })}
                data={projects}
                searchBy="name"
                searchPlaceholder="Search projects"
                searchable
                customActions={() => {
                    return (
                        <div>
                            <Button
                                variant={"default"}
                                size={"sm"}
                                onClick={createNewProject}
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                New Project
                            </Button>
                        </div>
                    );
                }}
            />
        </AuthenticatedLayout>
    );
}

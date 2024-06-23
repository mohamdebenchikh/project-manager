import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import { Project } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

interface PropsType {
    editProject: (project: Project) => void;
    deleteProject: (project: Project) => void;
}

export const projectColumns : (props: PropsType) => ColumnDef<Project>[] = ({
    editProject,
    deleteProject,
}) => [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        accessorKey: "created_at",
        header: "Created at",
        cell: ({ row }) => format(new Date(row.original.created_at), "PP"),
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
            <div className="space-x-2 flex items-center justify-center">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editProject(row.original)}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteProject(row.original)}
                >
                    Delete
                </Button>
            </div>
        ),
        enableHiding: false,
    },
];

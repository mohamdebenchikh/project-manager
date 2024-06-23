import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { FormEvent, FormEventHandler, useEffect } from "react";
import InputError from "@/Components/InputError";
import { Project } from "@/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface PropsType {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    onSuccess: (page: any) => void;
    projects: Project[];
}

export default function CreateNewTaskDialog({
    open,
    onOpenChange,
    onSuccess,
    projects,
}: PropsType) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        project_id: "",
    });

    const submit: FormEventHandler = (e: FormEvent) => {
        e.preventDefault();
        post(route("tasks.store"), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => reset(),
            onSuccess: (page: any) => onSuccess(page),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form className="space-y-6" onSubmit={submit}>
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            className="w-full mt-2 block"
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.title} />
                    </div>
                    {projects.length > 0 && (
                        <div>
                            <Label htmlFor="project_id">Project</Label>
                            <Select
                                value={data.project_id as unknown as string}
                                onValueChange={(value: any) =>
                                    setData("project_id", value ?? null)
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
                        </div>
                    )}
                    <div>
                        <Label htmlFor="description">Project Description</Label>
                        <Textarea
                            id="description"
                            defaultValue={data.description}
                            className="w-full mt-2 block"
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                        <InputError
                            className="mt-2"
                            message={errors.description}
                        />
                    </div>
                    <div className="flex justify-end">
                        <DialogClose asChild>
                            <Button
                                variant={"secondary"}
                                type="button"
                                size={"sm"}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            size={"sm"}
                            className="ml-2"
                            disabled={processing}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

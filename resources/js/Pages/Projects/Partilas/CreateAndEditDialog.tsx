import  {Button} from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle,DialogClose } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Project } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEvent, FormEventHandler, useEffect } from 'react';
import InputError from '@/Components/InputError';

interface PropsType {
    editMode: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    project:Project;
    onSuccess: (page : any) => void;
}

export default function CreateAndEditDialog({editMode,open,onOpenChange,project,onSuccess}: PropsType) {


    const { data, setData, post, processing, errors, reset, put } = useForm({
        name: "",
        description: "",
    });

    const submit: FormEventHandler = (e: FormEvent) => {
        e.preventDefault();

        if (editMode) {
            put(route("projects.update", project.slug), {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => reset(),
                onSuccess: (page: any) => onSuccess(page),
            });
        } else {
            post(route("projects.store"), {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => reset(),
                onSuccess: onSuccess,
            });
        }
    };

    useEffect(() => {
        if (editMode) {
            setData({
                name: project.name,
                description: project.description,
            });
        }
    }, [editMode, project]);
  
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editMode ? "Edit" : "Create"} Project
                    </DialogTitle>
                </DialogHeader>
                <form className="space-y-6" onSubmit={submit}>
                    <div>
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            className="w-full mt-2 block"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>
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

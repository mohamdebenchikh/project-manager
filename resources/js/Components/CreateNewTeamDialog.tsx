import { FormEvent, FormEventHandler } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { useForm } from "@inertiajs/react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import InputError from "./InputError";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function CreateNewTeamDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    const submit: FormEventHandler = (e: FormEvent) => {
        e.preventDefault();
        post(route("teams.store"));
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 my-6">
                        <div>
                            <Label htmlFor="name">Team name</Label>
                            <Input
                                className="mt-2 w-full"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                                id="name"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                className="mt-2 w-full"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                id="description"
                            />
                            <InputError
                                message={errors.description}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                onClick={handleClose}
                                variant={"outline"}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { useRef, useState, FormEventHandler } from "react";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
} from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/Components/ui/dialog";

import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

export default function DeleteUserForm({
    className = "",
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <Card className={`space-y-6 ${className}`}>
            <div className="max-w-xl">
                <CardHeader>
                    <CardTitle>Delete Account</CardTitle>

                    <CardDescription>
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Before deleting your
                        account, please download any data or information that
                        you wish to retain.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Dialog > 
                        <DialogTrigger asChild>
                            <Button variant={"destructive"}>
                                Delete Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {" "}
                                    Are you sure you want to delete your
                                    account?
                                </DialogTitle>
                                <DialogDescription>
                                    Once your account is deleted, all of its
                                    resources and data will be permanently
                                    deleted. Please enter your password to
                                    confirm you would like to permanently delete
                                    your account.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={deleteUser} className="space-y-6">
                                <div>
                                    <Label
                                        htmlFor="password"
                                        className="sr-only"
                                    >
                                        Password
                                    </Label>

                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        placeholder="Password"
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className=" flex justify-end">
                                    <DialogClose asChild>
                                        <Button
                                            variant={"secondary"}
                                            type="button"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button
                                        className="ms-3"
                                        disabled={processing}
                                        type="submit"
                                        variant={"destructive"}
                                    >
                                        Delete Account
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </div>
        </Card>
    );
}

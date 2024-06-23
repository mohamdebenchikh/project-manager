import InputError from "@/Components/InputError";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { FormEventHandler, useRef, useState } from "react";
import { PageProps } from "@/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import { Textarea } from "@/Components/ui/textarea";
import axios from "axios";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;
    const photoRef = useRef<HTMLInputElement>(null);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [uploadig, setUploading] = useState<boolean>(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            photo: user.photo,
            about: user.about,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    const handlePhotoChange: FormEventHandler<HTMLInputElement> = async (
        e: any
    ) => {
        setUploading(true);
        try {
            const file = e.target.files?.[0];
            const formData = new FormData();
            formData.append("image", file);
            const response = await axios.post(route("images.upload"), formData);
            setData("photo", response.data.url);
        } catch (error: any) {
            console.log(error);
            setPhotoError(error.response.data.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className={className}>
            <div className="max-w-xl">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>

                    <CardDescription>
                        Update your account's profile information and email
                        address.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={submit} className="mt-6 space-y-6">
                        <div>
                            <Label htmlFor="photo">Photo</Label>
                            <div className="flex flex-col gap-4 mt-2">
                                <Avatar className="w-28 h-28 ring ring-indigo-500">
                                    <AvatarImage
                                        src={
                                            data.photo ??
                                            "https://avatar.iran.liara.run/username?username=" +
                                                user.name
                                        }
                                    />
                                </Avatar>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        onChange={handlePhotoChange}
                                        accept="image/*"
                                        ref={photoRef}
                                        className="hidden"
                                    />
                                    <Button
                                        variant={"outline"}
                                        onClick={() =>
                                            photoRef.current?.click()
                                        }
                                        type={"button"}
                                    >
                                        {uploadig ? (
                                            <div className="flex items-center">
                                                <svg
                                                    className="animate-spin h-5 w-5"
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
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                <span className="ms-2">Uploading...</span>
                                            </div>
                                        ) : 'Change Photo'}
                                    </Button>
                                    {data.photo && (
                                        <Button
                                            onClick={() => setData("photo", "")}
                                            variant={"destructive"}
                                            type={"button"}
                                        >
                                            Remove Photo
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <InputError
                                className="mt-2"
                                message={errors.photo}
                            />
                        </div>

                        <div>
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                                autoComplete="name"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.name}
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                                autoComplete="username"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.email}
                            />
                        </div>
                        <div>
                            <Label htmlFor="about">About</Label>
                            <Textarea
                                id="about"
                                defaultValue={data.about}
                                onChange={(e) =>
                                    setData("about", e.target.value)
                                }
                                className="mt-1 block w-full"
                            />
                            <InputError
                                className="mt-2"
                                message={errors.about}
                            />
                        </div>

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="text-sm mt-2 text-gray-800">
                                    Your email address is unverified.
                                    <Link
                                        href={route("verification.send")}
                                        method="post"
                                        as="button"
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Click here to re-send the verification
                                        email.
                                    </Link>
                                </p>

                                {status === "verification-link-sent" && (
                                    <div className="mt-2 font-medium text-sm text-green-600">
                                        A new verification link has been sent to
                                        your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                variant={"default"}
                                disabled={processing}
                            >
                                Save
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600">Saved.</p>
                            </Transition>
                        </div>
                    </form>
                </CardContent>
            </div>
        </Card>
    );
}

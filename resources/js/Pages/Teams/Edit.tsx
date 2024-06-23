import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { FormEvent, FormEventHandler } from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { generateAvatarFromUsername } from "@/lib/utils";
import AddNewMember from "./AddNewMember";

export default function Edit({ auth, team, roles }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: team.name,
        description: team.description,
    });

    const handleFormSubmit: FormEventHandler = (event: FormEvent) => {
        event.preventDefault();
        put(route("teams.update", team.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={[
                { name: "Dashboard", href: route("dashboard"), current: false },
                { name: "Team", href: route("teams.index"), current: false },
                {
                    name: "Edit",
                    href: route("teams.edit", team.id),
                    current: false,
                },
                { name: team.name, href: "#", current: true },
            ]}
        >
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="col-span-1 md:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Team</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="mt-2 block w-full"
                                            required
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            className="mt-2 block w-full"
                                            defaultValue={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.description}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end ">
                                        <Button
                                            type="submit"
                                            className="ml-4"
                                            disabled={processing}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <AddNewMember team={team} roles={roles} />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="p-4">
                            <span className="text-xs font-bold text-muted-foreground">
                                Team Owner
                            </span>
                            <div className="flex items-center mt-2 gap-2">
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback>
                                        {team.owner.name[0]}
                                    </AvatarFallback>
                                    <AvatarImage
                                        src={
                                            team.owner.photo ??
                                            generateAvatarFromUsername(
                                                team.owner.name
                                            )
                                        }
                                    ></AvatarImage>
                                </Avatar>
                                <div className="leading-5">
                                    <div className="text-primary">
                                        {team.owner.name}
                                    </div>
                                    <div className="text-muted-foreground text-sm">
                                        {team.owner.email}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Team Members</CardTitle>
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

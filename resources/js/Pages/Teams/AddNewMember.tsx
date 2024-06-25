import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Role, Team } from "@/types";
import { useState, useEffect, FormEventHandler, FormEvent } from "react";
import axios from "axios";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { useToast } from "@/Components/ui/use-toast";

export default function AddNewMember({
    roles,
    team,
}: {
    roles: Role[];
    team: Team;
}) {
    const { data, setData, post, errors, processing } = useForm({
        email: "",
        role: roles.find((role) => role.is_default)?.name || "",
    });

    const [email, setEmail] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const { toast } = useToast();

    const sendInvitation: FormEventHandler = async (e: FormEvent) => {
        e.preventDefault();

        post(route("team-invitation.send", team.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Invitation sent successfully",
                });
                setEmail("");
            },
        });
    };

    useEffect(() => {
        if (email.length > 2) {
            const fetchSuggestions = async () => {
                try {
                    const response = await axios.get(
                        route("team-invitation.suggestions", team.id),
                        {
                            params: { email },
                        }
                    );
                    setSuggestions(response.data);
                } catch (error) {
                    console.error("Error fetching suggestions", error);
                }
            };
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [email]);

    return (
        <Card>
            <CardHeader className="mb-6">
                <CardTitle>Add New Member</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={sendInvitation}>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <Input
                                className="w-full"
                                type="email"
                                list="email-suggestions"
                                placeholder="Enter user email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setData("email", e.target.value);
                                }}
                            />
                            <datalist id="email-suggestions">
                                {suggestions.map((suggestion, index) => (
                                    <option key={index} value={suggestion} />
                                ))}
                            </datalist>
                        </div>

                        <Select
                            value={data.role}
                            onValueChange={(value) => setData("role", value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="default"
                            size={"sm"}
                            disabled={processing}
                        >
                            Send
                        </Button>
                    </div>
                    <InputError className="mt-2" message={errors.email} />
                    <InputError message={errors.role} />
                </form>
                
            </CardContent>
        </Card>
    );
}

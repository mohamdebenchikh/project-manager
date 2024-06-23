import { useEffect, FormEventHandler } from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Head, Link, useForm } from "@inertiajs/react";


export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="text-center mb-3">
                <h2 className="text-2xl text-primary font-bold">Login</h2>
             
            </div>

            <div>
                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <Button
                            className="w-full"
                            size={"sm"}
                            disabled={processing}
                        >
                            Log in
                        </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <Label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) =>
                                    setData("remember", checked as boolean)
                                }
                            />
                            <span className="ms-2">Remember me</span>
                        </Label>
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="underline text-sm text-muted-foreground hover:text-primary"
                            >
                                Forgot your password?
                            </Link>
                        )}
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}

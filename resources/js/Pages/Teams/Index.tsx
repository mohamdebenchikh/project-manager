import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";

export default function Index({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={[
                { name: "Dashboard", href: route("dashboard"), current: false },
                { name: "Team", href: route("team.index"), current: true },
            ]}
        >
            <Head title="Dashboard" />

            <h1>Team index page</h1>
        </AuthenticatedLayout>
    );
}

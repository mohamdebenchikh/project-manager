import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function Notifications({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            breadcrumbs={[
                { name: "Dashboard", href: route("dashboard"), current: false },
                { name: "Notifications", href: route("notifications"), current: true },
            ]}
        >
            <Head title="Notifications" />

        </AuthenticatedLayout>
    );
}

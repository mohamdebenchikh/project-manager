import { ListChecksIcon, LayoutDashboardIcon, RocketIcon } from "lucide-react";
import ResponsiveNavLink from "./ResponsiveNavLink";

export default function ResponsiveNavigationMenu() {
    return (
        <nav className="grid gap-2 mt-6">
            <ResponsiveNavLink
                href={route("dashboard")}
                active={route().current("dashboard")}
            >
                <LayoutDashboardIcon className="w-4 h-4" />
                Dashboard
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route("projects.index")}
                active={route().current("projects.*")}
            >
                <RocketIcon className="w-4 h-4" />
                Projects
            </ResponsiveNavLink>
            <ResponsiveNavLink
                href={route("tasks.index")}
                active={route().current("tasks.*")}
            >
                <ListChecksIcon className="w-4 h-4" />
                Tasks
            </ResponsiveNavLink>
        </nav>
    );
}

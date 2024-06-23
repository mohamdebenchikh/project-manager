import { ListChecksIcon, LayoutDashboardIcon, RocketIcon } from "lucide-react";
import NavLink from "./NavLink";


export default function NavigationMenu() {
    return (
        <nav className=" items-center space-x-2 hidden md:flex">
        <NavLink
            href={route("dashboard")}
            active={route().current("dashboard")}
        >
            <LayoutDashboardIcon className="w-4 h-4" />
            Dashboard
        </NavLink>

        <NavLink
            href={route("projects.index")}
            active={route().current("projects.*")}
        >
            <RocketIcon className="w-4 h-4" />
            Projects
        </NavLink>

        <NavLink
            href={route("tasks.index")}
            active={route().current("tasks.*")}
        >
            <ListChecksIcon className="w-4 h-4" />
            Tasks
        </NavLink>
    </nav>
    )
}
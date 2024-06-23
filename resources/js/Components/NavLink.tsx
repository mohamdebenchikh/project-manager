import { Link, InertiaLinkProps } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={`
                px-4 py-2 text-sm rounded-lg flex items-center gap-1 hover:bg-primary-foreground
                ${
                    active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                }
                 ${className}
            `}
        >
            {children}
        </Link>
    );
}

import { Link, InertiaLinkProps } from "@inertiajs/react";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={` px-4 py-2 rounded-lg  flex items-center gap-2  ${
                active
                    ? "bg-primary text-slate-900"
                    : "hover:bg-primary-foreground text-muted-foreground hover:text-primary"
            } ${className}`}
        >
            {children}
        </Link>
    );
}

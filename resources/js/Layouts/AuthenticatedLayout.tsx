import { PropsWithChildren, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";

import { Link, usePage } from "@inertiajs/react";
import { PageProps, Team, User } from "@/types";

import { Toaster } from "@/Components/ui/toaster";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";

import { Button } from "@/Components/ui/button";
import { MenuIcon, XCircle } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import React from "react";
import { BreadcrumbType } from "@/types";
import UserDropdown from "@/Components/UserDropdown";
import TeamDropdown from "@/Components/TeamDropdown";
import NavigationMenu from "@/Components/NavigationMenu";
import ResponsiveNavigationMenu from "@/Components/ResponsiveNavigationMenu";
import CreateNewTeamDialog from "@/Components/CreateNewTeamDialog";
import NotificationDropdown from "@/Components/NotificationDropdown";

export default function Authenticated({
    children,
    user,
    breadcrumbs = [],
}: PropsWithChildren<{
    user: User;
    breadcrumbs?: BreadcrumbType[];
}>) {
    const teams = usePage().props.teams as Team[];
    const currentTeam = usePage().props.currentTeam as Team;
    const [openCreateTeam, setOpenCreateTeam] = React.useState(false);
    const { flash } = usePage<PageProps>().props;
    const [showAlert, setShowAlert] = React.useState(true);

    useEffect(() => {
        if (flash.success !== undefined) {
            setShowAlert(false);
        }
    });

    return (
        <div className="min-h-screen">
            <CreateNewTeamDialog
                open={openCreateTeam}
                onOpenChange={() => setOpenCreateTeam(!openCreateTeam)}
            />
            <header className="w-full h-16 border-b flex items-center">
                <div className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
                    <div className="flex-1 flex items-center">
                        <Sheet>
                            <SheetTrigger asChild className="md:hidden">
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    className="text-primary me-2"
                                >
                                    <MenuIcon className="w-6 h-6" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={"left"} className="sm:max-w-xs">
                                <SheetHeader>
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 me-2"
                                    >
                                        <ApplicationLogo className="w-8 h-8 fill-current text-primary" />
                                        <SheetTitle>Project Manager</SheetTitle>
                                    </Link>
                                </SheetHeader>
                                <ResponsiveNavigationMenu />
                            </SheetContent>
                        </Sheet>

                        <Link
                            href="/"
                            className="hidden  md:flex items-center gap-2 me-4"
                        >
                            <ApplicationLogo className="w-8 h-8 fill-current text-gray-500 dark:text-primary" />
                            <span className="text-lg font-semibold text-primary">
                                Project Manager
                            </span>
                        </Link>

                        <NavigationMenu />
                    </div>
                    <div className="flex items-end gap-8">
                        <TeamDropdown
                            onCreate={() => setOpenCreateTeam(true)}
                            teams={teams}
                            currentTeam={currentTeam}
                        />
                        <NotificationDropdown />
                        <UserDropdown user={user} />
                    </div>
                </div>
            </header>
            <div>
                <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {breadcrumbs.length > 0 && (
                        <div className="mb-8">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs.map((breadcrumb, index) => (
                                        <React.Fragment key={index}>
                                            {breadcrumb.current ? (
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage>
                                                        {breadcrumb.name}
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            ) : (
                                                <BreadcrumbItem>
                                                    <Link
                                                        href={breadcrumb.href}
                                                    >
                                                        {breadcrumb.name}
                                                    </Link>
                                                </BreadcrumbItem>
                                            )}
                                            {index < breadcrumbs.length - 1 && (
                                                <BreadcrumbSeparator />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    )}
                    {showAlert && (
                        <div
                            className="mb-8 flex items-center justify-between bg-primary-foreground text-primary rounded-md p-4"
                            role="alert"
                        >
                            <p>{flash.success}</p>
                            <button
                                onClick={() => setShowAlert(false)}
                                className="text-muted-foreground"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                    {children}
                    <Toaster />
                </div>
            </div>
        </div>
    );
}

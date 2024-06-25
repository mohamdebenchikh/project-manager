import ApplicationLogo from "@/Components/ApplicationLogo";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex ">
            <div className="w-1/2 h-screen hidden md:block border-r">
                <img  src="/img/background.jfif" className="w-full h-full object-cover" alt="background"/>
            </div>
            <div className="w-full md:w-1/2 flex sm:justify-center items-center flex-col pt-6 sm:pt-0 px-6">
                <ApplicationLogo className="text-muted-foreground fill-current w-20 h-20 mb-6"/>
                <div className="w-full sm:w-[400px]">{children}</div>
            </div>
        </div>
    );
}

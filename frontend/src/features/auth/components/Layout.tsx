import { type ReactNode } from "react";

type LayoutProps = {
    children?: ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
    return (
        <div className="w-full flex flex-col lg:flex-row min-h-screen">
            <div className="lg:w-1/2 w-full lg:h-screen h-48 relative bg-amber-300">
                image
            </div>
            <div className="lg:w-1/2 w-full lg:min-h-screen min-h-[calc(100vh-12rem)] p-6 md:p-12 bg-white flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

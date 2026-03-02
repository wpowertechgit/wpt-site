import type { ReactNode } from "react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import NavbarDesktop from "../components/Navbar";
import NavbarMobile from "../components/NavbarMobile";
import FFooter from "../components/FFooter";

type AppLayoutProps = {
    children?: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    const isMobile = useMediaQuery("(max-width:1099px)");
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    return (
        <div className="layout min-h-screen flex flex-col bg-brand-white text-brand-black">
            <header>
                {isMobile ? <NavbarMobile /> : <NavbarDesktop />}
            </header>

            <main className="flex-1 w-full">{children ?? <Outlet />}</main>

            <FFooter />
        </div>
    );
}


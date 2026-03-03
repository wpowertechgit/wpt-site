import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Fade, useMediaQuery } from "@mui/material";
import { FiChevronUp } from "react-icons/fi";
import NavbarDesktop from "../components/Navbar";
import NavbarMobile from "../components/NavbarMobile";
import FFooter from "../components/FFooter";

type AppLayoutProps = {
    children?: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    const isMobile = useMediaQuery("(max-width:1099px)");
    const { pathname } = useLocation();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 320);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleBackToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    return (
        <div className="layout min-h-screen flex flex-col bg-brand-white text-brand-black">
            <header>
                {isMobile ? <NavbarMobile /> : <NavbarDesktop />}
            </header>

            <main className="flex-1 w-full">{children ?? <Outlet />}</main>

            <Fade in={showBackToTop} timeout={{ enter: 160, exit: 160 }} unmountOnExit>
                <Box
                    component="button"
                    type="button"
                    onClick={handleBackToTop}
                    aria-label="Scroll to top"
                    sx={{
                        position: "fixed",
                        right: { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, xxl: 40, xxxl: 56 },
                        bottom: { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, xxl: 40, xxxl: 56 },
                        width: { xs: 44, sm: 48, md: 52, lg: 56, xl: 64, xxl: 76, xxxl: 92 },
                        height: { xs: 44, sm: 48, md: 52, lg: 56, xl: 64, xxl: 76, xxxl: 92 },
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 0,
                        border: "2px solid #ffffff",
                        borderRadius: "50%",
                        bgcolor: "#0000FF",
                        color: "#ffffff",
                        cursor: "pointer",
                        zIndex: 20,
                        transition: "background-color 0.16s linear, transform 0.16s linear",
                        "&:hover": {
                            bgcolor: "#2b2b2b",
                            transform: "translateY(-2px)",
                        },
                        "&:focus-visible": {
                            outline: "2px solid #0000FF",
                            outlineOffset: 2,
                        },
                        "& svg": {
                            width: { xs: 18, sm: 20, md: 22, lg: 35, xl: 42, xxl: 50, xxxl: 60 },
                            height: "auto",
                            transition: "transform 0.16s linear",
                        },
                        "&:hover svg": {
                            transform: "scale(1.20)",
                        },
                    }}
                >
                    <FiChevronUp aria-hidden />
                </Box>
            </Fade>

            <FFooter />
        </div>
    );
}

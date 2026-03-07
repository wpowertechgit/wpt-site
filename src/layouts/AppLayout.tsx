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
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
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
                    aria-label="Jump to top"
                    sx={{
                        position: "fixed",
                        right: { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, xxl: 40, xxxl: 56 },
                        bottom: { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, xxl: 40, xxxl: 56 },
                        minWidth: { xs: 88, sm: 92, md: 52, lg: 56, xl: 64, xxl: 76, xxxl: 92 },
                        height: { xs: 52, sm: 54, md: 52, lg: 56, xl: 64, xxl: 76, xxxl: 92 },
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: { xs: 0.5, md: 0 },
                        px: { xs: 1.25, sm: 1.5, md: 0 },
                        p: 0,
                        border: "2px solid #ffffff",
                        borderRadius: 0,
                        bgcolor: "#0000FF",
                        color: "#ffffff",
                        cursor: "pointer",
                        zIndex: 20,
                        transition: "background-color 0.16s linear, transform 0.16s linear",
                        fontFamily: "Figtree, sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: "1.15rem", sm: "1.2rem", md: "1rem" },
                        letterSpacing: "0.05em",
                        "&:hover": {
                            bgcolor: "#2b2b2b",
                            transform: "translateY(-2px)",
                        },
                        "&:focus-visible": {
                            outline: "2px solid #0000FF",
                            outlineOffset: 2,
                        },
                        "& svg": {
                            width: { xs: 22, sm: 24, md: 22, lg: 35, xl: 42, xxl: 50, xxxl: 60 },
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

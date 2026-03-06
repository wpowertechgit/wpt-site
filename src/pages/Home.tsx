import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ApplicationsSection from "../components/home/ApplicationsSection";
import CaseStudySection from "../components/home/CaseStudySection";
import PillarsSection from "../components/home/PillarsSection";

export default function Home() {
    const { t } = useTranslation();
    const heroSurface = "#ffffff";
    const heroVideoWhiteShadow = "0 0 0 0.125rem #ffffff, 0 0 1.25rem 0.75rem #ffffff";
    const whitePoster =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23ffffff'/%3E%3C/svg%3E";
    const safariVideoToneFix = {
        "@supports (-webkit-touch-callout: none)": {
            filter: "brightness(1.06) contrast(1.01) saturate(0.92)"
        }
    };

    return (
        <Box sx={{ bgcolor: heroSurface }}>
            {/* HERO SECTION */}
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: heroSurface,
                    position: "relative",
                    overflow: "hidden",
                    px: 2
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                        textAlign: "center",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "-5vh"
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: { md: "30rem", lg: "32rem", xxl: "32rem", xxxl: "48rem" },
                            aspectRatio: "1072 / 1088",
                            mb: "1rem",
                            mx: "auto",
                            display: { xs: "none", md: "block" },
                            position: "relative"
                        }}
                    >
                        <Box
                            component="video"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            poster={whitePoster}
                            controls={false}
                            disablePictureInPicture
                            controlsList="nodownload nofullscreen noremoteplayback"
                            aria-hidden="true"
                            tabIndex={-1}
                            onContextMenu={(e) => e.preventDefault()}
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "block",
                                pointerEvents: "none",
                                userSelect: "none",
                                backgroundColor: heroSurface,
                                boxShadow: heroVideoWhiteShadow,
                                transform: "translateZ(0)",
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                ...safariVideoToneFix
                            }}
                        >
                            <source src="/logo-desktop-optimized.mp4" type="video/mp4" />
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: "14rem",
                            aspectRatio: "536 / 544",
                            mb: "1rem",
                            mx: "auto",
                            display: { xs: "block", md: "none" },
                            position: "relative"
                        }}
                    >
                        <Box
                            component="video"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            poster={whitePoster}
                            controls={false}
                            disablePictureInPicture
                            controlsList="nodownload nofullscreen noremoteplayback"
                            aria-hidden="true"
                            tabIndex={-1}
                            onContextMenu={(e) => e.preventDefault()}
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "block",
                                pointerEvents: "none",
                                userSelect: "none",
                                backgroundColor: heroSurface,
                                boxShadow: heroVideoWhiteShadow,
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                ...safariVideoToneFix
                            }}
                        >
                            <source src="/logo-mid-res-optimized.mp4" type="video/mp4" />
                        </Box>
                    </Box>

                    <Typography
                        variant="h1"
                        sx={{
                            fontFamily: "Stack Sans Headline, sans-serif",
                            fontWeight: 700,
                            fontSize: { xs: "1.75rem", md: "3.5rem", lg: "4rem", xl: "6rem", xxl: "6rem", xxxl: "9rem" },
                            lineHeight: 1.2,
                            mb: "0.75rem",
                            color: "#000",
                            letterSpacing: "-0.02em"
                        }}
                    >
                        {t("hero-title")}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: "1rem", md: "1.125rem", lg: "1.25rem", xl: "2rem", xxl: "2rem", xxxl: "3rem" },
                            color: "#666",
                            maxWidth: { xs: "20rem", md: "30rem", lg: "40rem", xl: "60rem", xxl: "60rem", xxxl: "80rem" },
                            mx: "auto",
                            lineHeight: 1.6,
                            textAlign: "center"
                        }}
                    >
                        {t("hero-subtitle")}
                    </Typography>
                </motion.div>
            </Box>

            <PillarsSection />
            <CaseStudySection />
            <ApplicationsSection />
        </Box>
    );
}

import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ApplicationsSection from "../components/home/ApplicationsSection";
import CaseStudySection from "../components/home/CaseStudySection";
import PillarsSection from "../components/home/PillarsSection";

export default function Home() {
    const { t } = useTranslation();

    return (
        <Box sx={{ bgcolor: "#ffffff" }}>
            {/* HERO SECTION */}
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#ffffff",
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
                                backgroundColor: "#ffffff",
                                transform: "translateZ(0)"
                            }}
                        >
                            <source src="/logo-desktop-optimized.mp4" type="video/mp4" />
                        </Box>
                        <Box
                            aria-hidden="true"
                            sx={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.14) 100%)",
                                pointerEvents: "none"
                            }}
                        />
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
                                backgroundColor: "#ffffff"
                            }}
                        >
                            <source src="/logo-mid-res-optimized.mp4" type="video/mp4" />
                        </Box>
                        <Box
                            aria-hidden="true"
                            sx={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.14) 100%)",
                                pointerEvents: "none"
                            }}
                        />
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

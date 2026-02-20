import { useRef } from "react";
import { useTransform, useScroll, motion } from "framer-motion";
import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import ImpactCalculator from "../components/ImpactCalculator";

export default function Home() {
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, -48]);

    return (
        <Box ref={containerRef} sx={{ bgcolor: "#ffffff" }}>
            {/* HERO SECTION */}
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center", // Keeps the group centered, but we'll offset the inner content
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
                        textAlign: "left",
                        // Pull the entire content block up slightly to favor the bottom text
                        marginTop: "-5vh"
                    }}
                >
                    {/* DESKTOP VIDEO */}
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
                            // Slightly reduced maxWidth to take up less vertical height
                            maxWidth: { md: "30rem", lg: "32rem", xxxl: "48rem" },
                            aspectRatio: "1072 / 1088",
                            mb: "1rem", // Reduced margin from 2rem
                            mx: "auto",
                            display: { xs: "none", md: "block" },
                            pointerEvents: "none",
                            userSelect: "none",
                            backgroundColor: "#ffffff",
                            // Hardware acceleration for smoother lifting
                            transform: "translateZ(0)"
                        }}
                    >
                        <source src="/logo-desktop-optimized.mp4" type="video/mp4" />
                    </Box>

                    {/* MOBILE VIDEO */}
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
                            maxWidth: "14rem", // Reduced from 16.75rem to fit mobile screens better
                            aspectRatio: "536 / 544",
                            mb: "1rem", // Reduced margin from 2rem
                            mx: "auto",
                            display: { xs: "block", md: "none" },
                            pointerEvents: "none",
                            userSelect: "none",
                            backgroundColor: "#ffffff"
                        }}
                    >
                        <source src="/logo-mid-res-optimized.mp4" type="video/mp4" />
                    </Box>

                    <Typography
                        variant="h1"
                        sx={{
                            fontFamily: "Stack Sans Headline, sans-serif",
                            fontWeight: 700,
                            fontSize: { xs: "1.75rem", md: "3.5rem", lg: "4rem", xl: "6rem", xxxl: "9rem" },
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
                            fontSize: { xs: "1rem", md: "1.125rem", lg: "1.25rem", xl: "2rem", xxxl: "3rem" },
                            color: "#666",
                            maxWidth: { xs: "20rem", md: "30rem", lg: "40rem", xl: "60rem", xxxl: "80rem" },
                            mx: 0,
                            lineHeight: 1.6
                        }}
                    >
                        {t("hero-subtitle")}
                    </Typography>
                </motion.div>
            </Box>

            {/* PILLARS SECTION - Three Equal Columns with Full Height Images */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    height: { xs: "auto", md: "100vh" },
                    bgcolor: "#ffffff",
                    overflow: { xs: "visible", md: "hidden" },
                    width: "100%",
                }}
            >
                {[
                    {
                        name: "waste",
                        color: "#8E8E8E",
                        image: "waste.jpg",
                        title: t("pillar-waste-title"),
                        subtext: t("pillar-waste-description"),
                    },
                    {
                        name: "power",
                        color: "#ED1C24",
                        image: "power.jpg",
                        title: t("pillar-power-title"),
                        subtext: t("pillar-power-description"),
                    },
                    {
                        name: "technology",
                        color: "#0000FF",
                        image: "tech.jpg",
                        title: t("pillar-tech-title"),
                        subtext: t("pillar-tech-description"),
                    },
                ].map((pillar, i) => (
                    <Box
                        component={motion.div}
                        key={pillar.name}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15, duration: 0.6 }}
                        sx={{
                            flex: { xs: "1 1 auto", md: "1 1 33.333%" },
                            height: { xs: "28rem", md: "auto" },
                            position: "relative",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                bgcolor: "#ffffff",
                                height: "100%",
                                borderLeft: `0.5rem solid ${pillar.color}`,
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            {/* Image */}
                            <motion.img
                                src={`/${pillar.image}`}
                                alt={pillar.title}
                                loading={i === 0 ? "eager" : "lazy"}
                                decoding="async"
                                fetchPriority={i === 0 ? "high" : "auto"}
                                style={{ y }}
                                className="absolute inset-0 w-full h-[60%] object-cover"
                            />

                            {/* Content */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "40%",
                                    bgcolor: "#ffffff",
                                    p: "2rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    zIndex: 2,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: "Stack Sans Headline",
                                        fontWeight: 700,
                                        fontSize: { xs: "1.5rem", md: "1.75rem", lg: "2rem", xl: "4rem", xxxl: "4rem" },
                                        mb: "0.5rem",
                                        color: pillar.color,

                                    }}
                                >
                                    {pillar.title}
                                </Typography>

                                <Typography sx={{ fontSize: { xs: "0.95rem", md: "1rem", lg: "1.125rem", xl: "3rem", xxxl: "3rem" }, color: "#666", lineHeight: 1.4 }}>
                                    {pillar.subtext}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>

            <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
            >
                <Box
                    sx={{
                        minHeight: { xs: "auto", xl: "100vh" },
                        display: "flex",
                        alignItems: "center",
                        py: { xs: "5rem", xl: "8rem", xxxl: "12rem" },
                        bgcolor: "#ffffff",
                        borderTop: "1px solid #ddd"
                    }}
                >
                    <Container
                        maxWidth={false}
                        sx={{
                            px: { xs: "1.5rem", md: "2rem", xl: "4%", xxxl: "6%" }
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                gap: { xs: "3rem", xl: "6rem", xxxl: "10rem" },
                                alignItems: "center"
                            }}
                        >
                            {/* LEFT COLUMN: TEXT CONTENT */}
                            <Box sx={{ order: { xs: 2, md: 1 } }}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontFamily: "Stack Sans Headline, sans-serif",
                                        fontWeight: 700,
                                        mb: { xs: "1.5rem", xl: "2.5rem" },
                                        // Massive scaling for large screens
                                        fontSize: {
                                            xs: "2.25rem",
                                            md: "2.5rem",
                                            lg: "3rem",
                                            xl: "4.5rem",
                                            xxxl: "6rem"
                                        },
                                        lineHeight: 1.1,
                                        color: "#000"
                                    }}
                                >
                                    {t("case-study-title")}
                                </Typography>

                                <Typography
                                    sx={{
                                        mb: { xs: "2rem", xl: "3.5rem" },
                                        color: "#666",
                                        fontSize: {
                                            xs: "1.1rem",
                                            md: "1.2rem",
                                            xl: "1.75rem",
                                            xxxl: "2.4rem"
                                        },
                                        lineHeight: 1.5,
                                        maxWidth: { xl: "90%", xxxl: "85%" }
                                    }}
                                >
                                    {t("case-study-description")}
                                </Typography>

                                <Box
                                    sx={{
                                        fontSize: {
                                            xs: "1.1rem",
                                            xl: "1.6rem",
                                            xxxl: "2.2rem"
                                        }
                                    }}
                                >
                                    <Link
                                        to="/case-studies"
                                        style={{
                                            textDecoration: "none",
                                            color: "#000",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            fontWeight: 600,
                                            borderBottom: "2px solid #000",
                                            paddingBottom: "4px"
                                        }}
                                    >
                                        {t("learn-more")} →
                                    </Link>
                                </Box>
                            </Box>

                            {/* RIGHT COLUMN: IMAGE */}
                            <Box sx={{ order: { xs: 1, md: 2 } }}>
                                <Box
                                    component="img"
                                    src="/wp_statie.jpg"
                                    alt="Cluj Case Study"
                                    loading="lazy"
                                    decoding="async"
                                    fetchPriority="auto"
                                    sx={{
                                        width: "100%",
                                        // Significant height increase for large viewports
                                        height: {
                                            xs: "25rem",
                                            md: "30rem",
                                            xl: "45rem",
                                            xxxl: "55rem"
                                        },
                                        objectFit: "cover",
                                        display: "block",
                                        borderRadius: { xs: "0", xl: "4px" }, // Optional slight rounding for premium feel
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
                                    }}
                                />
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </motion.div>
            {/* APPLICATIONS - Two Equal Columns */}
            <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
            >
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        py: { xs: "4rem", xl: "0" }, // Vertical padding removed on XL as cards are large
                        bgcolor: "#ffffff",
                        borderTop: "1px solid #ddd"
                    }}
                >
                    {/* maxWidth={false} allows the section to ignore the 1200px limit.
                    px handles the 'padding from the left' for larger screens.
                */}
                    <Container
                        maxWidth={false}
                        sx={{
                            px: { xs: "1.5rem", md: "2rem", xl: "4%", xxxl: "6%" }
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                gap: { xs: 4, md: 0 } // Space between cards on mobile only
                            }}
                        >
                            {[
                                { name: "b2g", title: t("institutional-b2g"), image: "b2g.jpg" },
                                { name: "b2i", title: t("industrial-b2i"), image: "b2i.jpg" }
                            ].map((app, index) => (
                                <Box
                                    key={app.name}
                                    sx={{
                                        bgcolor: "#ffffff",
                                        // Separator border between the two columns on desktop
                                        borderLeft: {
                                            md: index === 1 ? "1px solid #eee" : "none"
                                        },
                                        borderTop: "0.25rem solid #8E8E8E",
                                        // Massive scaling of padding for xl and xxxl
                                        p: {
                                            xs: "2rem",
                                            md: "3rem",
                                            xl: "5rem 4rem",
                                            xxxl: "8rem 6rem"
                                        },
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        height: "100%"
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: "Stack Sans Headline, sans-serif",
                                                fontWeight: 700,
                                                mb: "2rem",
                                                // Scaled font sizes for impact
                                                fontSize: {
                                                    xs: "2rem",
                                                    md: "2.25rem",
                                                    lg: "2.5rem",
                                                    xl: "4rem",
                                                    xxxl: "5.5rem"
                                                },
                                                lineHeight: 1.1,
                                                maxWidth: "90%"
                                            }}
                                        >
                                            {app.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mb: "3rem",
                                                color: "#666",
                                                fontSize: {
                                                    xs: "1rem",
                                                    md: "1.1rem",
                                                    xl: "1.6rem",
                                                    xxxl: "2.2rem"
                                                },
                                                lineHeight: 1.5,
                                                maxWidth: { xl: "80%", xxxl: "70%" }
                                            }}
                                        >
                                            {t(`app-${app.name}-description`)}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Box
                                            component="img"
                                            src={`/${app.image}`}
                                            alt={app.title}
                                            loading="lazy"
                                            decoding="async"
                                            fetchPriority="auto"
                                            sx={{
                                                width: "100%",
                                                // Increased heights for xl and xxxl
                                                height: {
                                                    xs: "18rem",
                                                    md: "22rem",
                                                    xl: "35rem",
                                                    xxxl: "48rem"
                                                },
                                                objectFit: "cover",
                                                mb: "2rem",
                                                display: "block",
                                                filter: "grayscale(10%)",
                                                transition: "filter 0.3s ease",
                                                '&:hover': {
                                                    filter: "grayscale(0%)"
                                                }
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                fontSize: {
                                                    xs: "1.1rem",
                                                    xl: "1.5rem",
                                                    xxxl: "2.2rem"
                                                },
                                                fontWeight: 500
                                            }}
                                        >
                                            <Link
                                                to="/applications"
                                                style={{
                                                    textDecoration: "none",
                                                    color: "#000",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                    borderBottom: "2px solid #000",
                                                    paddingBottom: "4px"
                                                }}
                                            >
                                                {t("explore")} →
                                            </Link>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>
            </motion.div>
            <ImpactCalculator />
        </Box>
    );
}








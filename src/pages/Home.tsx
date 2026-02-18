import { useRef, useState } from "react";
import { useTransform, useScroll, motion } from "framer-motion";
import { Box, Container, Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function Home() {
    const { t } = useTranslation();
    const [modules, setModules] = useState(5);
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
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#ffffff",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ textAlign: "center" }}
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
                            maxWidth: "33.5rem",
                            aspectRatio: "1072 / 1088",
                            mb: "2rem",
                            mx: "auto",
                            display: { xs: "none", md: "block" },
                            pointerEvents: "none",
                            userSelect: "none",
                            backgroundColor: "#ffffff"
                        }}
                    >
                        <source src="/logo-desktop-optimized.mp4" type="video/mp4" />
                    </Box>
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
                            maxWidth: "16.75rem",
                            aspectRatio: "536 / 544",
                            mb: "2rem",
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
                            fontFamily: "Stack Sans Headline",
                            fontWeight: 700,
                            fontSize: { xs: "2rem", md: "4rem" },
                            mb: "1rem",
                            color: "#000"
                        }}
                    >
                        {t("hero-title")}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: "1rem", md: "1.25rem" },
                            color: "#666",
                            maxWidth: "30rem",
                            mx: "auto"
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
                    height: "100vh",
                    bgcolor: "#ffffff",
                    overflow: "hidden",
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
                    <motion.div
                        key={pillar.name}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15, duration: 0.6 }}
                        style={{
                            flex: "1 1 33.333%",
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
                                        fontSize: "1.5rem",
                                        mb: "0.5rem",
                                        color: pillar.color,
                                    }}
                                >
                                    {pillar.title}
                                </Typography>

                                <Typography sx={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.4 }}>
                                    {pillar.subtext}
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                ))}
            </Box>

            {/* CLUJ CASE STUDY - Two Equal Columns */}
            <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
            >
                <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: "4rem", bgcolor: "#ffffff", borderTop: "1px solid #ddd", px: "2rem" }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: "3rem", alignItems: "center" }}>
                            <Box>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontFamily: "Stack Sans Headline",
                                        fontWeight: 700,
                                        mb: "1.5rem",
                                        fontSize: "2rem"
                                    }}
                                >
                                    {t("case-study-title")}
                                </Typography>
                                <Typography sx={{ mb: "1.5rem", color: "#666", fontSize: "1rem", lineHeight: 1.6 }}>
                                    {t("case-study-description")}
                                </Typography>
                                <Link to="/case-studies" style={{ textDecoration: "underline", color: "#000", fontSize: "1rem" }}>
                                    {t("explore")} →
                                </Link>
                            </Box>
                            <Box
                                component="img"
                                src="/wp_statie.jpg"
                                alt="Cluj Case Study"
                                sx={{
                                    width: "100%",
                                    height: "25rem",
                                    objectFit: "cover",
                                    display: "block"
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.backgroundColor = "#e0e0e0";
                                }}
                            />
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
                <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: "4rem", bgcolor: "#ffffff", borderTop: "1px solid #ddd", px: "2rem" }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 0 }}>
                            {[
                                { name: "b2g", title: t("institutional-b2g"), image: "b2g.jpg" },
                                { name: "b2i", title: t("industrial-b2i"), image: "b2i.jpg" }
                            ].map((app) => (
                                <Box
                                    key={app.name}
                                    sx={{
                                        bgcolor: "#ffffff",
                                        borderTop: "0.25rem solid #8E8E8E",
                                        p: { xs: "2rem", md: "3rem" },
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        height: "auto"
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: "Stack Sans Headline",
                                                fontWeight: 700,
                                                mb: "1.5rem",
                                                fontSize: "1.5rem"
                                            }}
                                        >
                                            {app.title}
                                        </Typography>
                                        <Typography sx={{ mb: "1.5rem", color: "#666", fontSize: "1rem", lineHeight: 1.6 }}>
                                            {t(`app-${app.name}-description`)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Box
                                            component="img"
                                            src={`/${app.image}`}
                                            alt={app.title}
                                            sx={{
                                                width: "100%",
                                                height: "15rem",
                                                objectFit: "cover",
                                                mb: "1.5rem",
                                                display: "block"
                                            }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.backgroundColor = "#e0e0e0";
                                            }}
                                        />
                                        <Link to="/applications" style={{ textDecoration: "underline", color: "#000", fontSize: "1rem" }}>
                                            {t("explore")} →
                                        </Link>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>
            </motion.div>
            {/* DOCUMENTATION */}
            <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
            >
                <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: "4rem", bgcolor: "#ffffff", borderTop: "1px solid #ddd", px: "2rem" }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: "Stack Sans Headline",
                                fontWeight: 700,
                                mb: "3rem",
                                fontSize: "2.5rem"
                            }}
                        >
                            {t("documentation")}
                        </Typography>
                        <Stack spacing="1rem" sx={{ maxWidth: "30rem" }}>
                            <Link to="/docs" style={{ textDecoration: "underline", color: "#000", fontSize: "1.1rem" }}>
                                {t("technology-brochure")} →
                            </Link>
                            <Link to="/docs" style={{ textDecoration: "underline", color: "#000", fontSize: "1.1rem" }}>
                                {t("method-summary")} →
                            </Link>
                            <Link to="/docs" style={{ textDecoration: "underline", color: "#000", fontSize: "1.1rem" }}>
                                {t("press-kit")} →
                            </Link>
                            <Link to="/docs" style={{ textDecoration: "underline", color: "#000", fontSize: "1.1rem" }}>
                                {t("all-documents")} →
                            </Link>
                        </Stack>
                    </Container>
                </Box>
            </motion.div>
            {/* CALCULATOR */}
            <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
            >
                <Box id="calculator" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: "4rem", bgcolor: "#f9f9f9", borderLeft: "0.5rem solid #0000FF", borderTop: "1px solid #ddd", px: "2rem" }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: "Stack Sans Headline",
                                fontWeight: 700,
                                mb: "3rem",
                                fontSize: "2.5rem"
                            }}
                        >
                            {t("calculator-title")}
                        </Typography>
                        <Box sx={{ maxWidth: "30rem" }}>
                            <Typography sx={{ mb: "1rem", fontSize: "1rem" }}>
                                {t("modules")}: {modules}
                            </Typography>
                            <Box
                                component="input"
                                type="range"
                                min={1}
                                max={20}
                                value={modules}
                                onChange={(e) => setModules(Number((e.target as HTMLInputElement).value))}
                                sx={{
                                    width: "100%",
                                    height: "0.5rem",
                                    mb: "2rem",
                                    cursor: "pointer",
                                    appearance: "none",
                                    WebkitAppearance: "none",
                                    backgroundColor: "#ddd",
                                    outline: "none",
                                    "&::-webkit-slider-thumb": {
                                        appearance: "none",
                                        WebkitAppearance: "none",
                                        width: "1rem",
                                        height: "1rem",
                                        backgroundColor: "#0000FF",
                                        cursor: "pointer"
                                    },
                                    "&::-moz-range-thumb": {
                                        width: "1rem",
                                        height: "1rem",
                                        backgroundColor: "#0000FF",
                                        cursor: "pointer",
                                        border: "none"
                                    }
                                }}
                            />
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", mb: "2rem", p: "1rem", bgcolor: "#fff", borderTop: "1px solid #ddd" }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                                        {(modules * 2.5).toFixed(1)} {t("mwh-year")}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                                        {modules * 500} {t("households")}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                                        {(modules * 2).toFixed(1)}% {t("city-coverage")}
                                    </Typography>
                                </Box>
                            </Box>
                            <Link to="/calculator" style={{ textDecoration: "underline", color: "#000", fontSize: "1rem" }}>
                                {t("open-full-calculator")} →
                            </Link>
                        </Box>
                    </Container>
                </Box>
            </motion.div>
        </Box>
    );
}


import { Box, Typography } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function PillarsSection() {
    const { t } = useTranslation();
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, -48]);

    const pillars = [
        {
            name: "waste",
            color: "#8E8E8E",
            image: "waste-alternative.jpg",
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
            image: "chip21.jpg",
            title: t("pillar-tech-title"),
            subtext: t("pillar-tech-description"),
        },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                height: "auto",
                bgcolor: "#ffffff",
                overflow: "visible",
                width: "100%",
            }}
        >
            {pillars.map((pillar, i) => (
                <Box
                    component={motion.div}
                    key={pillar.name}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    sx={{
                        flex: { xs: "1 1 auto", md: "1 1 0" },
                        position: "relative",
                        borderLeftStyle: "solid",
                        borderLeftColor: pillar.color,
                        borderLeftWidth: {
                            xs: "0.5rem",
                            xxl: "0.75rem",
                            xxxl: "1rem",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            bgcolor: "#ffffff",
                            height: "100%",
                            overflow: "visible",
                            position: "relative",
                        }}
                    >
                        <Box sx={{ overflow: "hidden", height: 320, flexShrink: 0 }}>
                            <motion.img
                                src={`/${pillar.image}`}
                                alt={pillar.title}
                                loading={i === 0 ? "eager" : "lazy"}
                                decoding="async"
                                fetchPriority={i === 0 ? "high" : "auto"}
                                style={{ y, height: "110%", width: "100%", objectFit: "cover" }}
                            />
                        </Box>

                        <Box
                            sx={{
                                bgcolor: "#ffffff",
                                p: { xs: "1.25rem", md: "1.5rem", lg: "2rem" },
                                display: "flex",
                                flexDirection: "column",
                                zIndex: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "Stack Sans Headline",
                                    fontWeight: 700,
                                    fontSize: { xs: "1.5rem", md: "1.75rem", lg: "2rem", xl: "2.25rem", xxl: "2.8rem", xxxl: "3rem" },
                                    mb: "0.5rem",
                                    color: pillar.color,
                                }}
                            >
                                {pillar.title}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.95rem",
                                        md: "1rem",
                                        lg: "1.125rem",
                                        xl: "1.125rem",
                                        xxl: "2rem",
                                        xxxl: "2.3rem"
                                    },
                                    color: "#666",
                                    lineHeight: 1.45
                                }}
                            >
                                {pillar.subtext}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

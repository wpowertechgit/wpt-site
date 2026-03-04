import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useUIStore } from "../../store/uiStore";

export default function CaseStudySection() {
    const { t } = useTranslation();
    const currentLanguage = useUIStore((state) => state.language);
    const caseStudyVideoUrl =
        currentLanguage === "ro"
            ? "https://www.youtube-nocookie.com/embed/7vnExoAwfu8?si=F328Juhk0f6Jtf-x"
            : "https://www.youtube-nocookie.com/embed/Lxk9Yu1eJYI?si=ok5kKliaBkjebA-u";

    return (
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
                    py: { xs: "5rem", xl: "8rem", xxl: "8rem", xxxl: "12rem" },
                    bgcolor: "#ffffff",
                }}
            >
                <Container
                    maxWidth={false}
                    sx={{
                        px: { xs: "1.5rem", md: "2rem", xl: "4%", xxl: "4%", xxxl: "6%" }
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: { xs: "3rem", xl: "6rem", xxl: "6rem", xxxl: "10rem" },
                            alignItems: "center",
                            borderTop: "0.25rem solid #000000",
                            p: { xs: "2rem 0", xl: "4rem 0", xxl: "4rem 0", xxxl: "6rem 0" }
                        }}
                    >
                        <Box sx={{ order: { xs: 2, md: 1 } }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: "Stack Sans Headline, sans-serif",
                                    fontWeight: 700,
                                    mb: { xs: "1.5rem", xl: "2.5rem" },
                                    fontSize: {
                                        xs: "2.25rem",
                                        md: "2.5rem",
                                        lg: "3rem",
                                        xl: "4.5rem",
                                        xxl: "4.5rem",
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
                                        xxl: "1.75rem",
                                        xxxl: "2.4rem"
                                    },
                                    lineHeight: 1.5,
                                    maxWidth: { xl: "90%", xxl: "90%", xxxl: "85%" }
                                }}
                            >
                                {t("case-study-description")}
                            </Typography>
                        </Box>

                        <Box sx={{ order: { xs: 1, md: 2 } }}>
                            <Box
                                component="iframe"
                                src={caseStudyVideoUrl}
                                loading="lazy"
                                title="Cluj reference presentation"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                sx={{
                                    width: "100%",
                                    aspectRatio: "16 / 9",
                                    minHeight: {
                                        xs: "15rem",
                                        md: "20rem",
                                        xl: "28rem",
                                        xxl: "28rem",
                                        xxxl: "34rem"
                                    },
                                    display: "block",
                                    border: 0,
                                    borderRadius: 0,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
                                }}
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>
        </motion.div>
    );
}

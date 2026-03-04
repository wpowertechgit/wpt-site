import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function ApplicationsSection() {
    const { t } = useTranslation();

    const applications = [
        { name: "b2g", title: t("institutional-b2g"), image: "facility1.jpg" },
        { name: "b2i", title: t("industrial-b2i"), image: "factory20.jpg" }
    ];

    return (
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
                    py: { xs: "4rem", xl: "0" },
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
                            gap: { xs: 4, md: 0 }
                        }}
                    >
                        {applications.map((app) => (
                            <Box
                                key={app.name}
                                sx={{
                                    bgcolor: "#ffffff",
                                    borderTop: "0.25rem solid #000000",
                                    p: {
                                        xs: "2rem",
                                        md: "4rem 3rem",
                                        xl: "6rem 4rem",
                                        xxl: "6rem 4rem",
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
                                            fontSize: {
                                                xs: "2rem",
                                                md: "2.25rem",
                                                lg: "2.5rem",
                                                xl: "4rem",
                                                xxl: "4rem",
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
                                                xxl: "1.6rem",
                                                xxxl: "2.2rem"
                                            },
                                            lineHeight: 1.5,
                                            maxWidth: { xl: "80%", xxl: "80%", xxxl: "70%" }
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
                                            height: {
                                                xs: "18rem",
                                                md: "22rem",
                                                xl: "35rem",
                                                xxl: "35rem",
                                                xxxl: "48rem"
                                            },
                                            objectFit: "cover",
                                            mb: "2rem",
                                            display: "block",
                                            filter: "grayscale(10%)",
                                            transition: "filter 0.3s ease",
                                            "&:hover": {
                                                filter: "grayscale(0%)"
                                            }
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            fontSize: {
                                                xs: "1.1rem",
                                                xl: "1.5rem",
                                                xxl: "1.5rem",
                                                xxxl: "2.2rem"
                                            },
                                            fontWeight: 500
                                        }}
                                    >
                                        <Link
                                            to={app.name === "b2g" ? "/applications?mode=b2g" : "/applications?mode=b2b"}
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
                                            {t("explore")}
                                        </Link>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </motion.div>
    );
}

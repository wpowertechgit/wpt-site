import { motion } from "framer-motion";
import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Technology() {
  const { t } = useTranslation();

  const processSteps = [
    {
      key: "feedstock",
      title: t("tech-step-feedstock-title"),
      description: t("tech-step-feedstock-desc"),
      color: "#8E8E8E",
    },
    {
      key: "reactor",
      title: t("tech-step-reactor-title"),
      description: t("tech-step-reactor-desc"),
      color: "#0000FF",
    },
    {
      key: "energy",
      title: t("tech-step-energy-title"),
      description: t("tech-step-energy-desc"),
      color: "#ED1C24",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #ddd",
          px: { xs: "1.25rem", md: "2rem" },
          py: { xs: "4rem", md: "6rem" },
        }}
      >
        <Container maxWidth={false} sx={{ width: "100%", maxWidth: "120rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "linear" }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Stack Sans Headline",
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "3rem", xl: "4.5rem" },
                lineHeight: 1.15,
                maxWidth: "24ch",
                mb: "1.5rem",
              }}
            >
              {t("tech-title")}
            </Typography>
            <Typography
              sx={{
                color: "#4b4b4b",
                fontSize: { xs: "1rem", md: "1.15rem", xl: "1.5rem" },
                lineHeight: 1.7,
                maxWidth: "70ch",
              }}
            >
              {t("tech-intro")}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "linear" }}
      >
        <Box sx={{ borderTop: "1px solid #ddd", px: { xs: "1.25rem", md: "2rem" }, py: { xs: "3rem", md: "5rem" } }}>
          <Container maxWidth={false} sx={{ width: "100%", maxWidth: "120rem" }}>
            <Typography
              sx={{
                fontFamily: "Stack Sans Headline",
                fontWeight: 700,
                fontSize: { xs: "1.5rem", md: "2rem", xl: "3rem" },
                mb: "2rem",
              }}
            >
              {t("tech-diagram-title")}
            </Typography>

            <Box sx={{ borderTop: "2px solid #0000FF", borderBottom: "1px solid #ddd" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                }}
              >
                {processSteps.map((step, idx) => (
                  <Box
                    key={step.key}
                    sx={{
                      p: { xs: "1.25rem", md: "2rem", xl: "2.5rem" },
                      borderRight: { md: idx < processSteps.length - 1 ? "1px solid #ddd" : "none" },
                      borderBottom: { xs: idx < processSteps.length - 1 ? "1px solid #ddd" : "none", md: "none" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Stack Sans Headline",
                        fontWeight: 700,
                        fontSize: { xs: "1.2rem", md: "1.4rem", xl: "2rem" },
                        color: step.color,
                        mb: "0.75rem",
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "0.95rem", md: "1rem", xl: "1.3rem" }, lineHeight: 1.65, color: "#4b4b4b" }}>
                      {step.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "linear" }}
      >
        <Box sx={{ borderTop: "1px solid #ddd", px: { xs: "1.25rem", md: "2rem" }, py: { xs: "3rem", md: "5rem" } }}>
          <Container maxWidth={false} sx={{ width: "100%", maxWidth: "120rem" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: "1.5rem", md: "2rem" },
                alignItems: "stretch",
              }}
            >
              <Box sx={{ borderTop: "0.25rem solid #8E8E8E", p: { xs: "1.5rem", md: "2rem", xl: "2.75rem" } }}>
                <Typography sx={{ fontFamily: "Stack Sans Headline", fontWeight: 700, fontSize: { xs: "1.3rem", md: "1.6rem", xl: "2.25rem" }, mb: "0.75rem" }}>
                  {t("tech-control-title")}
                </Typography>
                <Typography sx={{ fontSize: { xs: "0.95rem", md: "1rem", xl: "1.3rem" }, lineHeight: 1.65, color: "#4b4b4b" }}>
                  {t("tech-control-desc")}
                </Typography>
              </Box>

              <Box sx={{ borderTop: "0.25rem solid #0000FF", p: { xs: "1.5rem", md: "2rem", xl: "2.75rem" } }}>
                <Typography sx={{ fontFamily: "Stack Sans Headline", fontWeight: 700, fontSize: { xs: "1.3rem", md: "1.6rem", xl: "2.25rem" }, mb: "0.75rem" }}>
                  {t("tech-output-title")}
                </Typography>
                <Typography sx={{ fontSize: { xs: "0.95rem", md: "1rem", xl: "1.3rem" }, lineHeight: 1.65, color: "#4b4b4b" }}>
                  {t("tech-output-desc")}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </motion.div>
    </Box>
  );
}

import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ImpactCalculatorAdvanced from "../components/ImpactCalculatorAdvanced";

export default function Calculator() {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: "1.5rem", md: "2rem", xl: "4%", xxl: "3.5%", xxxl: "5%" },
          py: { xs: "4rem", md: "5rem", xl: "6rem" },
        }}
      >
        <Box
          sx={{
            borderTop: "0.25rem solid #000000",
            pt: { xs: "2rem", md: "2.5rem" },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: "Stack Sans Headline, sans-serif",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "3rem", xl: "4.5rem", xxl: "5.25rem", xxxl: "6.25rem" },
              lineHeight: 1.1,
              color: "#000000",
              mb: "1rem",
              textAlign: "left",
            }}
          >
            {t("calc.pageTitle")}
          </Typography>
          <Typography
            sx={{
              maxWidth: { xs: "48rem", xxl: "56rem", xxxl: "64rem" },
              fontSize: { xs: "1rem", md: "1.125rem", xl: "1.25rem", xxl: "1.4rem", xxxl: "1.6rem" },
              lineHeight: 1.6,
              color: "#555555",
              textAlign: "left",
            }}
          >
            {t("calc.pageIntro")}
          </Typography>
        </Box>
      </Container>
      <ImpactCalculatorAdvanced />
    </Box>
  );
}

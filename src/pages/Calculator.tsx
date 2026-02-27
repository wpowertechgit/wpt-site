import { Box, Container, Typography } from "@mui/material";
import ImpactCalculatorAdvanced from "../components/ImpactCalculatorAdvanced";

export default function Calculator() {
  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: "1.5rem", md: "2rem", xl: "4%", xxl: "4%", xxxl: "6%" },
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
              fontSize: { xs: "2rem", md: "3rem", xl: "4.5rem" },
              lineHeight: 1.1,
              color: "#000000",
              mb: "1rem",
              textAlign: "left",
            }}
          >
            Full impact analysis
          </Typography>
          <Typography
            sx={{
              maxWidth: "48rem",
              fontSize: { xs: "1rem", md: "1.125rem", xl: "1.25rem" },
              lineHeight: 1.6,
              color: "#555555",
              textAlign: "left",
            }}
          >
            Configure units, throughput conditions, and reference assumptions.
            Review annual output, operational metrics, and export the estimate
            as a PDF.
          </Typography>
        </Box>
      </Container>
      <ImpactCalculatorAdvanced />
    </Box>
  );
}

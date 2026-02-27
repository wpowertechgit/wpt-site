import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100%", py: { xs: 12, md: 14 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
            gap: { xs: 2.5, md: 3.5 },
            alignItems: "start",
          }}
        >
          <Box
            component="img"
            src="/wpt-black-compact-logo.svg"
            alt="Waste Power Tech"
            sx={{
              width: { xs: "120px", md: "140px", xxxl: "220px" },
              height: "auto",
              display: "block",
            }}
          />

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Stack Sans Headline, sans-serif",
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.6rem", xxl: "2.6rem", xxxl: "4rem" },
                mb: 3,
                textAlign: "left",
              }}
            >
              {t("privacy_policy_title")}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Figtree, sans-serif",
                fontSize: { xs: "1rem", md: "1.05rem", xxl: "1.05rem", xxxl: "1.7rem" },
                lineHeight: 1.7,
                color: "#1f1f1f",
                maxWidth: "80ch",
                textAlign: "left",
              }}
            >
              {t("privacy_policy_text")}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

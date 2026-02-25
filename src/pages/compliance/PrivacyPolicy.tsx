import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const sections = [
    {
      key: "privacy-policy-section-1",
      title: t("privacy-policy-section-1-title"),
      body: t("privacy-policy-section-1-body"),
    },
    {
      key: "privacy-policy-section-2",
      title: t("privacy-policy-section-2-title"),
      body: t("privacy-policy-section-2-body"),
    },
    {
      key: "privacy-policy-section-3",
      title: t("privacy-policy-section-3-title"),
      body: t("privacy-policy-section-3-body"),
    },
    {
      key: "privacy-policy-section-4",
      title: t("privacy-policy-section-4-title"),
      body: t("privacy-policy-section-4-body"),
    },
    {
      key: "privacy-policy-section-5",
      title: t("privacy-policy-section-5-title"),
      body: t("privacy-policy-section-5-body"),
    },
    {
      key: "privacy-policy-section-6",
      title: t("privacy-policy-section-6-title"),
      body: t("privacy-policy-section-6-body"),
    },
    {
      key: "privacy-policy-section-7",
      title: t("privacy-policy-section-7-title"),
      body: t("privacy-policy-section-7-body"),
    },
    {
      key: "privacy-policy-section-8",
      title: t("privacy-policy-section-8-title"),
      body: t("privacy-policy-section-8-body"),
    },
  ];

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100%", py: { xs: 12, md: 14 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontFamily: "Stack Sans Headline, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "2.6rem", xxxl: "4rem" },
            mb: 1,
            textAlign: "left",
          }}
        >
          {t("privacy-policy-title")}
        </Typography>
        <Typography sx={{ mb: 5, color: "#4a4a4a", textAlign: "left" }}>
          {t("privacy-policy-last-updated")}
        </Typography>

        {sections.map((section) => (
          <Box key={section.key} sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: "Stack Sans Headline, sans-serif",
                fontWeight: 700,
                fontSize: { xs: "1.15rem", md: "1.35rem", xxxl: "2.2rem" },
                mb: 1,
                textAlign: "left",
              }}
            >
              {section.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Figtree, sans-serif",
                fontSize: { xs: "1rem", md: "1.05rem", xxxl: "1.7rem" },
                lineHeight: 1.7,
                color: "#1f1f1f",
                maxWidth: "80ch",
                textAlign: "left",
              }}
            >
              {section.body}
            </Typography>
          </Box>
        ))}
      </Container>
    </Box>
  );
}

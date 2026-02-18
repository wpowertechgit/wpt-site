import { Box, Typography, Link } from "@mui/material";
import Grid from "@mui/material/Grid";
import { FaEnvelope, FaFacebook, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import PrivacyMap from "./PrivacyMap";

export default function FFooter() {
  const { t } = useTranslation();

  const linkBaseSx = {
    fontSize: "1rem",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
    "@media (min-width:2000px)": {
      fontSize: "3rem",
    },
  } as const;

  return (
    <Box
      component="footer"
      className="mt-auto w-full bg-white text-black font-body"
      sx={{
        py: "2.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          px: { xs: 2, md: 8, lg: 12 },
          pb: 3,
        }}
      >
        <Box sx={{ borderTop: "3px solid #000" }} />
      </Box>

      <Grid
        container
        spacing={4}
        sx={{
          maxWidth: "1200px",
          width: "100%",
          margin: "auto",
          px: { xs: 2, md: 0 },
          "@media (min-width:2300px)": {
            maxWidth: "2160px",
          },
        }}
      >
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            pl: { xs: 0, md: 20 },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            "@media (min-width:2000px)": {
              fontSize: "2rem",
            },
          }}
        >
          <Typography
            variant="h5"
            className="font-headline"
            sx={{
              fontWeight: 700,
              mb: "0.5rem",
              "@media (min-width:2000px)": {
                fontSize: "3rem",
              },
            }}
          >
            {t("contact_us")}
          </Typography>

          <Typography
            sx={{
              mt: "0.25rem",
              "@media (min-width:2000px)": {
                fontSize: "3rem",
              },
            }}
          >
            SC Waste Powertech SRL
          </Typography>

          <Typography
            sx={{
              mt: "0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              "@media (min-width:2000px)": {
                fontSize: "3rem",
              },
            }}
          >
            <FaEnvelope /> office@wpowertech.ro
          </Typography>

          <Link
            href="https://www.facebook.com/people/Waste-Powertech-SRL/61559358922953/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              ...linkBaseSx,
              mt: "0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              opacity: 0.85,
              color: "inherit",
            }}
          >
            <FaFacebook /> Waste Powertech SRL
          </Link>

          <Link
            href="https://www.youtube.com/@wastepowertech4213"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              ...linkBaseSx,
              mt: "0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              opacity: 0.85,
              color: "inherit",
            }}
          >
            <FaYoutube /> Waste Powertech
          </Link>
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PrivacyMap />
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-end" },
            pr: { xs: 0, md: 8 },
            gap: "0.5rem",
          }}
        >
          <Link
            component={RouterLink}
            to="/accessibility"
            sx={{
              ...linkBaseSx,
              textAlign: { xs: "center", md: "right" },
              opacity: 0.85,
              color: "inherit",
              wordBreak: "break-word",
            }}
          >
            {t("accessibility_title")}
          </Link>

          <Link
            component={RouterLink}
            to="/privacy"
            sx={{
              ...linkBaseSx,
              textAlign: { xs: "center", md: "right" },
              opacity: 0.85,
              color: "inherit",
              wordBreak: "break-word",
            }}
          >
            {t("privacy_policy_title")}
          </Link>

          <Link
            component={RouterLink}
            to="/terms"
            sx={{
              ...linkBaseSx,
              textAlign: { xs: "center", md: "right" },
              opacity: 0.85,
              color: "inherit",
              wordBreak: "break-word",
            }}
          >
            {t("terms_of_use_title")}
          </Link>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        sx={{
          textAlign: "center",
          opacity: 0.8,
          mt: 2,
          fontSize: "0.85rem",
          px: 2,
          maxWidth: "1200px",
          "@media (min-width:2000px)": {
            maxWidth: "2000px",
            fontSize: "2.4rem",
          },
        }}
      >
        {t("cookies")}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          textAlign: "center",
          opacity: 0.8,
          mt: 1,
          fontSize: "0.85rem",
          px: 2,
          "@media (min-width:2000px)": {
            fontSize: "3rem",
          },
        }}
      >
        {`All rights reserved © ${new Date().getFullYear()} Waste Powertech`}
      </Typography>
    </Box>
  );
}

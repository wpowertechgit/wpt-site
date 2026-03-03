import { Box, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

export default function FFooter() {
  const { t } = useTranslation();

  const linkBaseSx = {
    fontSize: "1rem",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
    "@media (min-width:2000px)": {
      fontSize: "2rem",
    },
  } as const;

  return (
    <Box
      component="footer"
      className="mt-auto w-full bg-white text-black font-body"
      sx={{
        py: { xs: "2rem", md: "2.5rem" },
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
          pb: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ borderTop: "3px solid #000" }} />
      </Box>

      <Box
        sx={{
          maxWidth: "1200px",
          width: "100%",
          margin: "auto",
          px: { xs: 2, md: 4, lg: 0 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "center" },
          justifyContent: "space-between",
          gap: { xs: "1.5rem", md: "2rem" },
          "@media (min-width:2300px)": {
            maxWidth: "2160px",
          },
        }}
      >
        <Link
          component={RouterLink}
          to="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src="/wpt-black-compact-logo.svg"
            alt="Waste Powertech logo"
            sx={{
              width: { xs: "8.5rem", md: "10rem", xl: "12rem", xxl: "13rem", xxxl: "15rem" },
              height: "auto",
              display: "block",
            }}
          />
        </Link>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-end" },
            gap: { xs: "0.45rem", md: "0.5rem" },
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
            to="/privacy-policy"
            sx={{
              ...linkBaseSx,
              textAlign: { xs: "center", md: "right" },
              opacity: 0.85,
              color: "inherit",
              wordBreak: "break-word",
            }}
          >
            {t("privacy_policy_title", "Privacy Policy")}
          </Link>

          <Link
            component={RouterLink}
            to="/terms-of-use"
            sx={{
              ...linkBaseSx,
              textAlign: { xs: "center", md: "right" },
              opacity: 0.85,
              color: "inherit",
              wordBreak: "break-word",
            }}
          >
            {t("terms_of_use_title", "Terms of Use")}
          </Link>

          <Link
            component={RouterLink}
            to="/contact"
            sx={{
              ...linkBaseSx,
              textAlign: { xs: "center", md: "right" },
              opacity: 0.85,
              color: "inherit",
              wordBreak: "break-word",
            }}
          >
            {t("contact-us", "Contact")}
          </Link>
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          textAlign: "center",
          opacity: 0.8,
          mt: { xs: 1.5, md: 2 },
          fontSize: "0.85rem",
          px: 2,
          "@media (min-width:2000px)": {
            fontSize: "2rem",
          },
        }}
      >
        {t("footer.rights_reserved", { year: new Date().getFullYear() })}
      </Typography>
    </Box>
  );
}

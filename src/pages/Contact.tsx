import { Box, Link, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaFacebook, FaPhone, FaYoutube } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { TbTournament } from "react-icons/tb";
import ContactForm from "../components/ContactForm";

const CONTACT_ENTRY_FONT_SIZE = {
  xs: "1.5rem",
  sm: "1.6rem",
  md: "2rem",
  lg: "1.8rem",
  xl: "3rem",
  xxl: "3.6rem",
  xxxl: "5rem",
};

const fadeIn = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay, ease: "linear" as const },
});

const Contact = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#FFFFFF",
        color: "#000000",
      }}
    >
      <Box component={motion.div} {...fadeIn(0.5)}>
        <Box
          sx={{
            width: "100%",
            borderTop: "1px solid #000000",
            px: { xs: 2, sm: 3, md: 5, lg: 8, xl: 10, xxl: 12, xxxl: 16 },
            py: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="/wpt-black-full-length-logo.svg"
            alt="Waste Powertech Logo"
            sx={{
              width: {
                xs: "14rem",
                sm: "18rem",
                md: "22rem",
                lg: "28rem",
                xl: "35rem",
                xxl: "40rem",
                xxxl: "46rem",
              },
              height: "auto",
            }}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            px: { xs: 2, sm: 3, md: 5, lg: 8, xl: 10, xxl: 12, xxxl: 16 },
          }}
        >
          <Box sx={{ width: "100%", borderTop: "1px solid #000000" }} />
        </Box>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 3, sm: 4, md: 5, lg: 6, xl: 8 }}
        sx={{
          px: { xs: 2, sm: 3, md: 5, lg: 8, xl: 10, xxl: 12, xxxl: 16 },
          pt: { xs: 2, sm: 2.5, md: 4, lg: 5 },
          pb: { xs: 5, sm: 6, md: 8, lg: 10 },
          alignItems: "stretch",
        }}
      >
        <Box component={motion.div} {...fadeIn(1)}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            width: "100%",
            color: "#000000",
            px: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 4 },
            py: { xs: 2, sm: 2.5, md: 3, lg: 4 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: "Stack Sans Headline, sans-serif",
              fontWeight: 700,
              mb: { xs: 2, md: 3 },
              color: "#000000",
              fontSize: {
                xs: "1.8rem",
                sm: "1.9rem",
                md: "2rem",
                lg: "3rem",
                xl: "4rem",
                xxl: "5rem",
                xxxl: "6rem",
              },
            }}
          >
            {t("contact-us")}
          </Typography>

          <Box component={motion.div} {...fadeIn(1)}>
            <Stack spacing={{ xs: 1, md: 1.5 }} sx={{ mb: 3, width: "100%" }}>
              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  fontSize: CONTACT_ENTRY_FONT_SIZE,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <TbTournament /> SC Waste Powertech SRL
              </Typography>

              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  fontSize: CONTACT_ENTRY_FONT_SIZE,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <HiBuildingOffice2 /> Ungheni 161/J, jud. Mureș, Romania
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
              sx={{ mb: 3, alignItems: "center" }}
            >
              <Box
                component="img"
                src="/docs/ISO_14001.png"
                alt="ISO 14001"
                sx={{
                  width: {
                    xs: "3.75rem",
                    sm: "4.25rem",
                    md: "5rem",
                    lg: "5.5rem",
                    xl: "6rem",
                  },
                  height: "auto",
                }}
              />
              <Box
                component="img"
                src="/docs/ISO_9001.png"
                alt="ISO 9001"
                sx={{
                  width: {
                    xs: "3.75rem",
                    sm: "4.25rem",
                    md: "5rem",
                    lg: "5.5rem",
                    xl: "6rem",
                  },
                  height: "auto",
                }}
              />
            </Stack>

            <Stack spacing={1} sx={{ mb: 0, width: "100%" }}>
              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  fontSize: CONTACT_ENTRY_FONT_SIZE,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaEnvelope /> office@wpowertech.ro
              </Typography>

              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  fontSize: CONTACT_ENTRY_FONT_SIZE,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaPhone /> +40 774 981 079
              </Typography>

              <Link
                href="https://www.facebook.com/people/Waste-Powertech-SRL/61559358922953/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  color: "#000000",
                  textDecoration: "none",
                  fontSize: CONTACT_ENTRY_FONT_SIZE,
                  fontFamily: "Figtree, sans-serif",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  "&:hover": {
                    color: "#000000",
                    textDecoration: "none",
                  },
                }}
              >
                <FaFacebook /> Waste Powertech SRL
              </Link>

              <Link
                href="https://www.youtube.com/@wastepowertech4213"
                target="_blank"
                rel="noreferrer"
                sx={{
                  color: "#000000",
                  textDecoration: "none",
                  fontSize: CONTACT_ENTRY_FONT_SIZE,
                  fontFamily: "Figtree, sans-serif",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  "&:hover": {
                    color: "#000000",
                    textDecoration: "none",
                  },
                }}
              >
                <FaYoutube /> Waste Powertech
              </Link>
            </Stack>
          </Box>
        </Box>

        <Box
          component={motion.div}
          {...fadeIn(1.4)}
          sx={{
            flex: 1,
            display: "flex",
            width: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            px: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 4 },
          }}
        >
          <ContactForm />
        </Box>
      </Stack>
    </Box>
  );
};

export default Contact;

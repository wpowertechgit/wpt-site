import { useRef } from "react";
import { motion } from "framer-motion";
import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TechnologyScrollRig from "../components/TechnologyScrollRig";
import TechnologyDescriptionScroll from "../components/TechnologyDescriptionScroll";

export default function Technology() {
  const { t } = useTranslation();
  const rigRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(false);

  const handleHeroWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY <= 0 || wheelLockRef.current) return;
    event.preventDefault();
    wheelLockRef.current = true;
    rigRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 820);
  };

  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <Box
        onWheel={handleHeroWheel}
        sx={{
          minHeight: "100vh",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 10, xxxl: 20 },
          py: { xs: 8, sm: 9, md: 10, lg: 12, xl: 14, xxxl: 20 },
        }}
      >
        <Container maxWidth={false} sx={{ width: "100%", maxWidth: "120rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "linear" }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1.1fr 1fr", lg: "1.15fr 1fr", xl: "1.2fr 1fr", xxxl: "1.2fr 1fr" },
                gap: { xs: 4, sm: 4, md: 5, lg: 6, xl: 8, xxxl: 10 },
                alignItems: "center",
              }}
            >
              <Box sx={{ order: { xs: 2, sm: 2, md: 1 } }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "Stack Sans Headline",
                    fontWeight: 700,
                    fontSize: { xs: "2rem", sm: "2.4rem", md: "3rem", lg: "3.6rem", xl: "4.4rem", xxxl: "6rem" },
                    lineHeight: 1.15,
                    maxWidth: "24ch",
                    mb: { xs: 2, sm: 2, md: 3, lg: 3, xl: 4, xxxl: 5 },
                  }}
                >
                  {t("tech-title")}
                </Typography>
                <Typography
                  sx={{
                    color: "#4b4b4b",
                    fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem", lg: "1.18rem", xl: "1.3rem", xxxl: "1.8rem" },
                    lineHeight: 1.6,
                    maxWidth: "70ch",
                    whiteSpace: "pre-line",
                  }}
                >
                  {t("tech-intro")}
                </Typography>
              </Box>

              <Box sx={{ order: { xs: 1, sm: 1, md: 2 } }}>
                <Box
                  component="video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  aria-hidden="true"
                  tabIndex={-1}
                  onContextMenu={(e) => e.preventDefault()}
                  sx={{
                    width: "100%",
                    maxWidth: { md: "30rem", lg: "32rem", xxxl: "48rem" },
                    aspectRatio: "1072 / 1088",
                    mx: "auto",
                    display: { xs: "none", md: "block" },
                    pointerEvents: "none",
                    userSelect: "none",
                    backgroundColor: "#ffffff",
                    transform: "translateZ(0)",
                  }}
                >
                  <source src="/logo-desktop-optimized.mp4" type="video/mp4" />
                </Box>

                <Box
                  component="video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  aria-hidden="true"
                  tabIndex={-1}
                  onContextMenu={(e) => e.preventDefault()}
                  sx={{
                    width: "100%",
                    maxWidth: "14rem",
                    aspectRatio: "536 / 544",
                    mx: "auto",
                    display: { xs: "block", md: "none" },
                    pointerEvents: "none",
                    userSelect: "none",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <source src="/logo-mid-res-optimized.mp4" type="video/mp4" />
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Box ref={rigRef} sx={{ borderTop: "0.25rem solid #000000" }}>
        <TechnologyScrollRig />
      </Box>

      <TechnologyDescriptionScroll />
    </Box>
  );
}

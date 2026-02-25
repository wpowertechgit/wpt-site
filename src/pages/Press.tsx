import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNewsData } from "../assets/newsData";

export default function Press() {
  const { t } = useTranslation();
  const news = useNewsData();

  return (
    <Box sx={{ bgcolor: "#FFFFFF" }}>
      <Box
        sx={{
          minHeight: "100vh",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          bgcolor: "#FFFFFF",
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
                    textAlign: "left",
                    color: "#000000",
                    fontSize: { xs: "2rem", sm: "2.4rem", md: "3rem", lg: "3.6rem", xl: "4.4rem", xxxl: "6rem" },
                    lineHeight: 1.1,
                    mb: { xs: 2, sm: 2, md: 3, lg: 3, xl: 4, xxxl: 5 },
                    maxWidth: "24ch",
                  }}
                >
                  {t("press.heroTitle")}
                </Typography>
                <Typography
                  sx={{
                    textAlign: "left",
                    color: "#444444",
                    fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem", lg: "1.18rem", xl: "1.3rem", xxxl: "1.8rem" },
                    lineHeight: 1.6,
                    maxWidth: "70ch",
                  }}
                >
                  {t("press.heroDescription")}
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

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 10, xxxl: 20 },
          pb: { xs: 8, sm: 9, md: 10, lg: 12, xl: 14, xxxl: 20 },
        }}
      >
        <Box
          sx={{
            borderTop: "1px solid #CFCFCF",
            mt: 0,
          }}
        />

        <Box component="section">
          {news.map((item, index) => (
            <Box
              key={`${item.link}-${item.id}`}
              component={motion.article}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: "linear" }}
              sx={{
                borderTop: "1px solid #CFCFCF",
                py: { xs: 4, sm: 5, md: 6, lg: 6, xl: 7, xxxl: 10 },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1.15fr 1fr", lg: "1.2fr 1fr", xl: "1.25fr 1fr", xxxl: "1.3fr 1fr" },
                  gap: { xs: 3, sm: 3, md: 4, lg: 5, xl: 6, xxxl: 8 },
                  alignItems: "start",
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      textAlign: "left",
                      color: "#000000",
                      mb: { xs: 1.5, sm: 2, md: 2, lg: 2.5, xl: 3, xxxl: 3.5 },
                      fontSize: { xs: "1.35rem", sm: "1.45rem", md: "1.65rem", lg: "1.85rem", xl: "2.1rem", xxxl: "3rem" },
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "left",
                      color: "#4B4B4B",
                      mb: { xs: 2.5, sm: 3, md: 3, lg: 3.5, xl: 4, xxxl: 5 },
                      maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: "95%", xl: "92%", xxxl: "90%" },
                      fontSize: { xs: "0.98rem", sm: "1rem", md: "1.03rem", lg: "1.08rem", xl: "1.16rem", xxxl: "1.7rem" },
                      lineHeight: 1.6,
                    }}
                  >
                    {item.paragraph}
                  </Typography>
                  <MuiLink
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      textAlign: "left",
                      color: "#000000",
                      fontSize: { xs: "0.92rem", sm: "0.95rem", md: "1rem", lg: "1rem", xl: "1.08rem", xxxl: "1.5rem" },
                      fontWeight: 600,
                      textDecorationColor: "#000000",
                      textUnderlineOffset: "0.2em",
                    }}
                  >
                    {t("press.readSource")}
                  </MuiLink>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: { xs: "16 / 10", sm: "16 / 10", md: "16 / 11", lg: "16 / 11", xl: "16 / 10", xxxl: "16 / 9" },
                    overflow: "hidden",
                    border: "1px solid #D9D9D9",
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={`${t("press.imageAltPrefix")} ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    sx={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

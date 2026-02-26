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
          bgcolor: "#2E20FB",
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 10, xxl: 10, xxxl: 20 },
          py: { xs: 8, sm: 9, md: 10, lg: 12, xl: 14, xxl: 14, xxxl: 20 },
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            maxWidth: { xs: "120rem", xxl: "120rem", xxxl: "170rem" },
            ml: { xxxl: 0 },
            mr: { xxxl: "auto" },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "linear" }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1.1fr 1fr", lg: "1.15fr 1fr", xl: "1.2fr 1fr", xxl: "1.2fr 1fr", xxxl: "1.2fr 1fr" },
                gap: { xs: 4, sm: 4, md: 5, lg: 6, xl: 8, xxl: 8, xxxl: 10 },
                alignItems: "center",
              }}
            >
              <Box sx={{ order: { xs: 1, sm: 1, md: 1 }, ml: { xxxl: "-4rem" } }}>
                <Typography
                  variant="h1"
                  sx={{
                    textAlign: "left",
                    color: "#FFFFFF",
                    fontSize: { xs: "2rem", sm: "2.4rem", md: "3rem", lg: "3.6rem", xl: "5.4rem", xxl: "5.4rem", xxxl: "8.8rem" },
                    lineHeight: 1.1,
                    mb: { xs: 2, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4, xxxl: 6 },
                    maxWidth: { xs: "24ch", xxl: "24ch", xxxl: "18ch" },
                  }}
                >
                  {t("press.heroTitle")}
                </Typography>
                <Typography
                  sx={{
                    textAlign: "left",
                    color: "#E5E5FF",
                    fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem", lg: "1.18rem", xl: "1.9rem", xxl: "1.9rem", xxxl: "3.2rem" },
                    lineHeight: 1.6,
                    maxWidth: { xs: "70ch", xxl: "70ch", xxxl: "52ch" },
                  }}
                >
                  {t("press.heroDescription")}
                </Typography>
              </Box>

              <Box sx={{ order: { xs: 2, sm: 2, md: 2 } }}>
                <Box
                  component="img"
                  src="/3brochures.png"
                  alt="WPT brochures"
                  loading="eager"
                  decoding="async"
                  sx={{
                    width: { xs: "90vw", sm: "72vw", md: "56vw", lg: "52vw", xxl: "52vw", xxxl: "48vw" },
                    maxWidth: "none",
                    height: "auto",
                    mx: "auto",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 10, xxl: 10, xxxl: 20 },
          pb: { xs: 8, sm: 9, md: 10, lg: 12, xl: 14, xxl: 14, xxxl: 20 },
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
                py: { xs: 4, sm: 5, md: 6, lg: 6, xl: 7, xxl: 7, xxxl: 10 },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1.15fr 1fr", lg: "1.2fr 1fr", xl: "1.25fr 1fr", xxl: "1.25fr 1fr", xxxl: "1.3fr 1fr" },
                  gap: { xs: 3, sm: 3, md: 4, lg: 5, xl: 6, xxl: 6, xxxl: 8 },
                  alignItems: "start",
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      textAlign: "left",
                      color: "#000000",
                      mb: { xs: 1.5, sm: 2, md: 2, lg: 2.5, xl: 3.5, xxl: 3.5, xxxl: 5 },
                      fontSize: { xs: "1.35rem", sm: "1.45rem", md: "1.65rem", lg: "1.85rem", xl: "3.8rem", xxl: "3.8rem", xxxl: "7rem" },
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "left",
                      color: "#4B4B4B",
                      mb: { xs: 2.5, sm: 3, md: 3, lg: 3.5, xl: 4.5, xxl: 4.5, xxxl: 6 },
                      maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: "95%", xl: "92%", xxl: "92%", xxxl: "90%" },
                      fontSize: { xs: "0.98rem", sm: "1rem", md: "1.03rem", lg: "1.08rem", xl: "2.2rem", xxl: "2.2rem", xxxl: "3.8rem" },
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
                      fontSize: { xs: "0.92rem", sm: "0.95rem", md: "1rem", lg: "1rem", xl: "2rem", xxl: "2rem", xxxl: "3.5rem" },
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
                    aspectRatio: { xs: "16 / 10", sm: "16 / 10", md: "16 / 11", lg: "16 / 11", xl: "16 / 10", xxl: "16 / 10", xxxl: "16 / 9" },
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



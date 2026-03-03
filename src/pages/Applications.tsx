import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import B2GTrackScroll from "./B2GTrackScroll";
import B2BTrackScroll from "./B2BTrackScroll";

export type Mode = "B2G" | "B2B";

export default function Applications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const mode: Mode = searchParams.get("mode")?.toLowerCase() === "b2b" ? "B2B" : "B2G";

  const isB2G = mode === "B2G";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
        color: "#000000",
        borderTop: "1px solid #d8d8d8",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          // Remove the restrictive maxWidth — let it fill the viewport at all sizes
          px: { xs: "1rem", md: "2rem", xl: "3rem", xxl: "4rem", xxxl: "5rem" },
          pt: { xs: "5.5rem", md: "1.75rem" },
          pb: { xs: "1.25rem", md: "1.75rem" },
        }}
      >
        <Box
          sx={{
            mb: { xs: 2, md: 3 },
            bgcolor: "#000000",
          }}
        >
          <Stack direction="row" spacing={0} sx={{ alignItems: "stretch" }}>
            <Button
              onClick={() => setSearchParams({ mode: "b2g" })}
              disableRipple
              sx={{
                borderRadius: 0,
                border: "none",
                outline: "none",
                boxShadow: "none",
                minWidth: { xs: "11rem", md: "14rem", xl: "17rem", xxl: "20rem", xxxl: "26rem" },
                bgcolor: isB2G ? "#FFFFFF" : "#000000",
                color: isB2G ? "#000000" : "#FFFFFF",
                fontFamily: "Stack Sans Headline",
                fontWeight: 700,
                letterSpacing: "0.04em",
                px: { xs: 2.3, md: 3, xxl: 3.5, xxxl: 4 },
                textTransform: "none",
                "&:hover": { bgcolor: isB2G ? "#FFFFFF" : "#000000" },
                "&:focus": { outline: "none", boxShadow: "none" },
                "&:focus-visible": { outline: "none", boxShadow: "none" },
                "&:active": { outline: "none", boxShadow: "none" },
                "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <Stack spacing={0.2} alignItems="flex-start">
                <Typography
                  sx={{
                    fontFamily: "Stack Sans Headline",
                    fontWeight: 700,
                    fontSize: { xs: "0.95rem", md: "1.05rem", xxl: "2rem", xxxl: "2.8rem" },
                    lineHeight: 1.1,
                  }}
                >
                  {t("tabs.b2g.label", { defaultValue: "B2G" })}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Figtree",
                    fontWeight: 500,
                    fontSize: { xs: "0.66rem", md: "0.74rem", xxl: "1.85rem", xxxl: "2.7rem" },
                    lineHeight: 1.1,
                    opacity: 0.9,
                  }}
                >
                  {t("tabs.b2g.sublabel", { defaultValue: "Business to Government" })}
                </Typography>
              </Stack>
            </Button>

            <Button
              onClick={() => setSearchParams({ mode: "b2b" })}
              disableRipple
              sx={{
                borderRadius: 0,
                border: "none",
                outline: "none",
                boxShadow: "none",
                minWidth: { xs: "11rem", md: "14rem", xl: "17rem", xxl: "20rem", xxxl: "26rem" },
                bgcolor: !isB2G ? "#FFFFFF" : "#000000",
                color: !isB2G ? "#000000" : "#FFFFFF",
                fontFamily: "Stack Sans Headline",
                fontWeight: 700,
                letterSpacing: "0.04em",
                px: { xs: 2.3, md: 3, xxl: 3.5, xxxl: 4 },
                py: { xs: 0.9, md: 1.05, xxl: 1.3, xxxl: 1.6 },
                textTransform: "none",
                "&:hover": { bgcolor: !isB2G ? "#FFFFFF" : "#000000" },
                "&:focus": { outline: "none", boxShadow: "none" },
                "&:focus-visible": { outline: "none", boxShadow: "none" },
                "&:active": { outline: "none", boxShadow: "none" },
                "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <Stack spacing={0.2} alignItems="flex-start">
                <Typography
                  sx={{
                    fontFamily: "Stack Sans Headline",
                    fontWeight: 700,
                    fontSize: { xs: "0.95rem", md: "1.05rem", xxl: "2rem", xxxl: "2.8rem" },
                    lineHeight: 1.1,
                  }}
                >
                  {t("tabs.b2b.label", { defaultValue: "B2B" })}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Figtree",
                    fontWeight: 500,
                    fontSize: { xs: "0.66rem", md: "0.74rem", xxl: "1.85rem", xxxl: "2.7rem" },
                    lineHeight: 1.1,
                    opacity: 0.9,
                  }}
                >
                  {t("tabs.b2b.sublabel", { defaultValue: "Business to Business" })}
                </Typography>
              </Stack>
            </Button>
          </Stack>
        </Box>

        <Box sx={{ pt: { xs: 2, md: 3 } }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "linear" }}
              style={{ willChange: "opacity" }}
            >
              {isB2G ? <B2GTrackScroll /> : <B2BTrackScroll />}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}

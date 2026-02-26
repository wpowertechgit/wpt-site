import { useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import B2GTrack from "./B2GTrack";
import B2BTrack from "./B2BTrack";

export type Mode = "B2G" | "B2B";

export default function Applications() {
  const [mode, setMode] = useState<Mode>("B2G");
  const { t } = useTranslation();

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
          maxWidth: "120rem",
          px: { xs: "1rem", md: "2rem", xl: "3rem" },
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
              onClick={() => setMode("B2G")}
              disableRipple
              sx={{
                borderRadius: 0,
                border: "none",
                outline: "none",
                boxShadow: "none",
                minWidth: { xs: "11rem", md: "14rem", xl: "17rem" },
                bgcolor: isB2G ? "#FFFFFF" : "#000000",
                color: isB2G ? "#000000" : "#FFFFFF",
                fontFamily: "Stack Sans Headline",
                fontWeight: 700,
                letterSpacing: "0.04em",
                px: { xs: 2.3, md: 3 },
                textTransform: "none",
                "&:hover": { bgcolor: isB2G ? "#FFFFFF" : "#000000" },
                "&:focus": { outline: "none", boxShadow: "none" },
                "&:focus-visible": { outline: "none", boxShadow: "none" },
                "&:active": { outline: "none", boxShadow: "none" },
                "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <Stack spacing={0.2} alignItems="flex-start">
                <Typography sx={{ fontFamily: "Stack Sans Headline", fontWeight: 700, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.1 }}>
                  {t("tabs.b2g.label", { defaultValue: "B2G" })}
                </Typography>
                <Typography sx={{ fontFamily: "Figtree", fontWeight: 500, fontSize: { xs: "0.66rem", md: "0.74rem" }, lineHeight: 1.1, opacity: 0.9 }}>
                  {t("tabs.b2g.sublabel", { defaultValue: "Business to Government" })}
                </Typography>
              </Stack>
            </Button>

            <Button
              onClick={() => setMode("B2B")}
              disableRipple
              sx={{
                borderRadius: 0,
                border: "none",
                outline: "none",
                boxShadow: "none",
                minWidth: { xs: "11rem", md: "14rem", xl: "17rem" },
                bgcolor: !isB2G ? "#FFFFFF" : "#000000",
                color: !isB2G ? "#000000" : "#FFFFFF",
                fontFamily: "Stack Sans Headline",
                fontWeight: 700,
                letterSpacing: "0.04em",
                px: { xs: 2.3, md: 3 },
                py: { xs: 0.9, md: 1.05 },
                textTransform: "none",
                "&:hover": { bgcolor: !isB2G ? "#FFFFFF" : "#000000" },
                "&:focus": { outline: "none", boxShadow: "none" },
                "&:focus-visible": { outline: "none", boxShadow: "none" },
                "&:active": { outline: "none", boxShadow: "none" },
                "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              <Stack spacing={0.2} alignItems="flex-start">
                <Typography sx={{ fontFamily: "Stack Sans Headline", fontWeight: 700, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.1 }}>
                  {t("tabs.b2b.label", { defaultValue: "B2B" })}
                </Typography>
                <Typography sx={{ fontFamily: "Figtree", fontWeight: 500, fontSize: { xs: "0.66rem", md: "0.74rem" }, lineHeight: 1.1, opacity: 0.9 }}>
                  {t("tabs.b2b.sublabel", { defaultValue: "Business to Business" })}
                </Typography>
              </Stack>
            </Button>
          </Stack>
        </Box>

        <Box sx={{ pt: { xs: 2, md: 3 }, perspective: "1400px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{
                opacity: 0,
                rotateY: isB2G ? -70 : 70,
                x: isB2G ? -40 : 40,
                transformOrigin: isB2G ? "left center" : "right center",
              }}
              animate={{
                opacity: 1,
                rotateY: 0,
                x: 0,
                transformOrigin: "center center",
              }}
              exit={{
                opacity: 0,
                rotateY: isB2G ? 70 : -70,
                x: isB2G ? 40 : -40,
                transformOrigin: isB2G ? "right center" : "left center",
              }}
              transition={{ duration: 0.38, ease: "easeInOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              {isB2G ? <B2GTrack /> : <B2BTrack />}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}

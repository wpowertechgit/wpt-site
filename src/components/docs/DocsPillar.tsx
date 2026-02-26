import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

type DocsPillarProps = {
  isActive: boolean;
  title: string;
  collapsedLabel: string;
  backgroundColor: string;
  textColor: string;
  onActivate: () => void;
  showActiveContent?: boolean;
  children: ReactNode;
};

export default function DocsPillar({
  isActive,
  title,
  collapsedLabel,
  backgroundColor,
  textColor,
  onActivate,
  showActiveContent = true,
  children,
}: DocsPillarProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate();
    }
  };

  return (
    <Box
      role={!isActive ? "button" : undefined}
      tabIndex={!isActive ? 0 : -1}
      onClick={!isActive ? onActivate : undefined}
      onKeyDown={!isActive ? handleKeyDown : undefined}
      sx={{
        height: "100%",
        bgcolor: backgroundColor,
        color: textColor,
        display: "flex",
        flexDirection: "column",
        cursor: isActive ? "default" : "pointer",
        overflow: "hidden",
      }}
    >
      {isActive ? (
        <motion.div
          initial={false}
          animate={{ opacity: showActiveContent ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "linear" }}
          style={{ height: "100%" }}
        >
          <Box
            sx={{
              p: { xs: 1.25, sm: 1.6, md: 2.2, lg: 2.6, xl: 3.2, xxl: 3.8, xxxl: 4.8 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.25, md: 1.6, lg: 2, xl: 2.25, xxl: 2.7, xxxl: 3.2 },
              pointerEvents: showActiveContent ? "auto" : "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src="/wpt-white-full-length-logo.svg"
                alt="Waste Power Tech"
                loading="eager"
                decoding="async"
                sx={{
                  display: { xs: "none", sm: "block" },
                  width: { sm: "48vw", md: "44vw", lg: "42vw", xl: "40vw", xxl: "40vw", xxxl: "40vw" },
                  maxWidth: { sm: "18rem", md: "21rem", lg: "24rem", xl: "28rem", xxl: "34rem", xxxl: "44rem" },
                  height: "auto",
                }}
              />
              <Box
                component="img"
                src="/wpt-white-compact-logo.svg"
                alt="Waste Power Tech"
                loading="eager"
                decoding="async"
                sx={{
                  display: { xs: "block", sm: "none" },
                  width: "clamp(8.5rem, 38vw, 11rem)",
                  height: "auto",
                }}
              />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Stack Sans Headline",
                fontWeight: 700,
                fontSize: { xs: "2.4rem", sm: "2.8rem", md: "3rem", lg: "4rem", xl: "6rem", xxl: "7rem", xxxl: "10rem" },
                lineHeight: 1.2,
                maxWidth: "40ch",
              }}
            >
              {title}
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0, pb: { xs: 0.75, md: 0.9, xl: 1.1 } }}>{children}</Box>
          </Box>
        </motion.div>
      ) : (
        <Box
          sx={{
            p: { xs: 0.75, sm: 0.9, md: 1.1 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Stack Sans Headline",
              fontWeight: 700,
              fontSize: { xs: "0.76rem", sm: "0.82rem", md: "1rem", lg: "1.2rem", xl: "1.4rem", xxl: "2rem", xxxl: "3rem" },
              lineHeight: 1.28,
              textAlign: "center",
              maxWidth: "12ch",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {collapsedLabel}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

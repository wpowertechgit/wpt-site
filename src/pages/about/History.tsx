import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const GrowingLine = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 55, damping: 22 });
  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <Box
      ref={ref}
      sx={{
        // Sits exactly on top of the library's ::before line
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "2px",
        pointerEvents: "none",
        zIndex: 1,
        "@media only screen and (max-width: 1169px)": {
          left: "25px",
          transform: "none",
        },
      }}
    >
      {/* Dim white track underneath */}
      <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.18)" }} />
      {/* Bright animated fill that springs down as you scroll */}
      <motion.div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#FFFFFF",
          transformOrigin: "top",
          scaleY,
        }}
      />
    </Box>
  );
};

const timelineItems = [
  { dateKey: "year-1", elementKeys: ["year-1-element-1", "year-1-element-2"] },
  { dateKey: "year-2", elementKeys: ["year-2-element-1", "year-2-element-2", "year-2-element-3"] },
  { dateKey: "year-3", elementKeys: ["year-3-element-1", "year-3-element-2"] },
  { dateKey: "year-4", elementKeys: ["year-4-element-1", "year-4-element-2"] },
  { dateKey: "year-5", elementKeys: ["year-5-element-1", "year-5-element-2", "year-5-element-3"] },
  { dateKey: "year-6", elementKeys: ["year-6-element-1", "year-6-element-2"] },
  { dateKey: "year-7", elementKeys: ["year-7-element-1"] },
  { dateKey: "year-8", elementKeys: ["year-8-element-1", "year-8-element-2", "year-8-element-3"] },
  { dateKey: "year-9", elementKeys: ["year-9-element-1", "year-9-element-2", "year-9-element-3"] },
  { dateKey: "year-10", elementKeys: ["year-10-element-1", "year-10-element-2"] },
];

const iconStyle: React.CSSProperties = {
  background: "#FFFFFF",
  color: "#ED1C24",
  fontSize: "1rem",
  boxShadow: "none",
};

const contentStyle: React.CSSProperties = {
  background: "transparent",
  color: "#FFFFFF",
  borderRadius: "10px",
  padding: "15px",
  boxSizing: "border-box",
  boxShadow: "none",
};

const contentArrowStyle: React.CSSProperties = {
  borderRight: "30px solid #fff",
  borderTop: "20px solid transparent",
  borderBottom: "20px solid transparent",
  top: "10px",
};

const History = () => {
  const { t } = useTranslation();
  const yearFiveAnchorRef = useRef<HTMLDivElement>(null);

  // Parallax header
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0.45]);
  const { scrollYProgress: yearFiveProgress } = useScroll({
    target: yearFiveAnchorRef,
    offset: ["start 90%", "start 20%"],
  });
  const smoothYearFiveProgress = useSpring(yearFiveProgress, {
    stiffness: 75,
    damping: 26,
  });
  const pageBgColor = useTransform(
    smoothYearFiveProgress,
    [0, 1],
    ["#ED1C24", "#0000FF"],
  );

  return (
    <Box
      component={motion.section}
      style={{ backgroundColor: pageBgColor }}
      sx={{
        minHeight: "100vh",
        color: "#FFFFFF",
        pt: { xs: "6rem", md: "8rem", xxl: "8rem", xxxl: "12rem" },
        pb: { xs: "6rem", md: "8rem", xxl: "8rem", xxxl: "12rem" },
        overflowX: "hidden",
        // â”€â”€ Override vertical-timeline library styles â”€â”€
        "& .vertical-timeline-element-icon": {
          background: "#FFFFFF !important",
          color: "#ED1C24 !important",
          fontSize: "1rem !important",
          boxShadow: "none !important",
          width: "20px !important",
          height: "20px !important",
          marginLeft: "-10px !important",
          marginTop: "1.2rem !important",
          borderRadius: "50% !important",
        },
        "& .vertical-timeline-element-content": {
          background: "transparent",
          color: "#FFFFFF",
          border: "2px solid white",
          borderRadius: "10px !important",
          padding: "15px !important",
          boxSizing: "border-box !important",
          boxShadow: "none !important",
        },
        "& .vertical-timeline-element-content-arrow": {
          borderRight: "30px solid #fff !important",
          borderTop: "20px solid transparent !important",
          borderBottom: "20px solid transparent !important",
          borderLeft: "none !important",
          top: "10px !important",
          // Arrow on right-side elements flips automatically via the library,
          // but we force the correct colour on both sides
        },
        "& .vertical-timeline-element-date": {
          color: "#FFFFFF !important",
          fontFamily: "Stack Sans Headline, sans-serif",
          fontWeight: 700,
          fontSize: { xs: "1rem", md: "1.15rem", xxl: "1.15rem", xxxl: "2.85rem" },
          opacity: "1 !important",
          paddingTop: "0 !important",
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: { xs: "100%", lg: "1320px", xl: "1680px", xxl: "1680px", xxxl: "2200px" },
          px: { xs: "1.5rem", md: "3.5rem", lg: "5rem", xxl: "5rem", xxxl: "8rem" },
        }}
      >
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <Box
            sx={{
              mb: { xs: "5rem", md: "7rem", xxl: "7rem", xxxl: "11rem" },
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "fit-content",
            }}
          >
            <Box
              component="img"
              src="/wpt-black-full-length-logo.svg"
              alt="Waste Power Tech"
              sx={{
                width: {
                  xs: "min(88vw, 400px)",
                  md: "480px",
                  xl: "600px", xxl: "600px",
                  xxxl: "820px",
                },
                height: "auto",
                display: "block",
                mb: { xs: "1.25rem", md: "1.75rem", xxl: "1.75rem", xxxl: "2.5rem" },
              }}
            />

            <Typography
              sx={{
                color: "#FFFFFF",
                fontFamily: "Stack Sans Headline, sans-serif",
                fontWeight: 700,
                fontSize: {
                  xs: "2.4rem",
                  md: "3.5rem",
                  xl: "4.5rem", xxl: "4.5rem",
                  xxxl: "6rem",
                },
                lineHeight: 1.0,
                textTransform: "lowercase",
                letterSpacing: "-0.03em",
              }}
            >
              {t("roadmap")}
            </Typography>

          </Box>
        </motion.div>

        <Box sx={{ position: "relative" }}>
          <GrowingLine />
          <VerticalTimeline lineColor="rgba(255,255,255,0.18)">
            {timelineItems.map((item) => (
              <VerticalTimelineElement
                key={item.dateKey}
                date={t(item.dateKey)}
                iconStyle={iconStyle}
                contentStyle={contentStyle}
                contentArrowStyle={contentArrowStyle}
              >
                {item.dateKey === "year-5" && (
                  <Box ref={yearFiveAnchorRef} sx={{ height: 0, overflow: "hidden" }} />
                )}
                <Box component="ul" sx={{ m: 0, pl: "1.4rem" }}>
                  {item.elementKeys.map((key) => (
                    <Typography
                      key={key}
                      component="li"
                      sx={{
                        fontFamily: "Figtree, sans-serif",
                        fontSize: {
                          xs: "0.95rem",
                          md: "1.05rem",
                          xl: "1.15rem", xxl: "1.15rem",
                          xxxl: "1.55rem",
                        },
                        lineHeight: 1.6,
                        mb: "0.35rem",
                        "&:last-child": { mb: 0 },
                        color: "rgba(255,255,255,0.92)",
                      }}
                    >
                      {t(key)}
                    </Typography>
                  ))}
                </Box>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </Box>
      </Container>
    </Box>
  );
};

export default History;



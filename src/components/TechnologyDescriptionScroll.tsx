import { useMemo, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Box, ButtonBase, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MdFactory, MdOutlineElectricalServices, MdOutlineFactCheck } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

type SectionItem = {
  titleKey: string;
  bodyKey: string;
  nextKey: string;
  prevKey?: string;
  titleLeftPadding?: boolean;
  videoEmbedUrl?: string;
  videoTitleKey?: string;
  sectionTitleKey?: string;
  sectionDividerOnly?: boolean;
  processStepKeys?: Array<{
    textKey: string;
    icon: "factory" | "thermometer" | "molecule" | "gas" | "snow-thermo" | "filter-layers" | "gauge" | "engine";
  }>;
  processShowArrows?: boolean;
  postProcessBodyKey?: string;
  timelineLabelKey?: string;
  timelineTicks?: string[];
  infraTiles?: Array<{
    textKey: string;
    bgColor: string;
    icon?: "waste" | "grid" | "surface" | "permits";
  }>;
};

const SECTION_ITEMS: SectionItem[] = [
  { titleKey: "tech-body-page-1-title", bodyKey: "tech-body-page-1-body", nextKey: "tech-body-page-1-next" },
  { titleKey: "tech-body-page-2-title", bodyKey: "tech-body-page-2-body", nextKey: "tech-body-page-2-next", prevKey: "tech-body-page-2-prev" },
  {
    titleKey: "tech-body-page-why-title",
    bodyKey: "tech-body-page-why-body",
    nextKey: "tech-body-page-why-next",
    prevKey: "tech-body-page-why-prev",
  },
  {
    titleKey: "tech-body-page-3-title",
    bodyKey: "tech-body-page-3-body",
    sectionTitleKey: "tech-body-page-3-subtitle",
    processStepKeys: [
      { textKey: "tech-body-page-3-step-1", icon: "factory" },
      { textKey: "tech-body-page-3-step-2", icon: "thermometer" },
      { textKey: "tech-body-page-3-step-3", icon: "molecule" },
      { textKey: "tech-body-page-3-step-4", icon: "gas" },
    ],
    nextKey: "tech-body-page-3-next",
    prevKey: "tech-body-page-3-prev",
  },
  {
    titleKey: "tech-body-page-4-title",
    bodyKey: "",
    processStepKeys: [
      { textKey: "tech-body-page-4-step-1", icon: "snow-thermo" },
      { textKey: "tech-body-page-4-step-2", icon: "filter-layers" },
      { textKey: "tech-body-page-4-step-3", icon: "gauge" },
      { textKey: "tech-body-page-4-step-4", icon: "engine" },
    ],
    processShowArrows: false,
    postProcessBodyKey: "tech-body-page-4-body",
    nextKey: "tech-body-page-4-next",
    prevKey: "tech-body-page-4-prev",
  },
  {
    titleKey: "tech-body-page-5-title",
    bodyKey: "tech-body-page-5-body",
    titleLeftPadding: true,
    timelineLabelKey: "tech-body-page-5-timeline-label",
    timelineTicks: ["tech-body-page-5-tick-1", "tech-body-page-5-tick-2", "tech-body-page-5-tick-3"],
    nextKey: "tech-body-page-5-next",
    prevKey: "tech-body-page-5-prev",
  },
  {
    titleKey: "tech-body-page-6-title",
    bodyKey: "tech-body-page-6-body",
    videoTitleKey: "tech-body-page-6-video-title",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/Lxk9Yu1eJYI?si=ok5kKliaBkjebA-u",
    nextKey: "tech-body-page-6-next",
    prevKey: "tech-body-page-6-prev",
  },
  {
    titleKey: "tech-body-page-7-title",
    bodyKey: "tech-body-page-7-body",
    infraTiles: [
      { textKey: "tech-body-page-7-tile-1", bgColor: "#8E8E8E", icon: "waste" },
      { textKey: "tech-body-page-7-tile-2", bgColor: "#ED1C24", icon: "grid" },
      { textKey: "tech-body-page-7-tile-3", bgColor: "#0000FF", icon: "surface" },
      { textKey: "tech-body-page-7-tile-4", bgColor: "#8E8E8E", icon: "permits" },
    ],
    nextKey: "tech-body-page-7-next",
    prevKey: "tech-body-page-7-prev",
  },
];

const PROCESS_ICON_SOURCES: Record<NonNullable<SectionItem["processStepKeys"]>[number]["icon"], string> = {
  factory: "/vectors/factory-line.svg",
  thermometer: "/vectors/temperature.svg",
  molecule: "/vectors/molecule.svg",
  gas: "/vectors/gas-tank.svg",
  "snow-thermo": "/vectors/snowflaketemperature.svg",
  "filter-layers": "/vectors/dust.svg",
  gauge: "/vectors/pressuremeter.svg",
  engine: "/vectors/generator.svg",
};

export default function TechnologyDescriptionScroll() {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const sections = useMemo(() => SECTION_ITEMS, []);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 90%", "start 20%"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });
  const pageBgColor = useTransform(smoothProgress, [0, 1], ["#FFFFFF", "#303192"]);

  const jumpToSection = (index: number) => {
    const target = sectionRefs.current[index];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      component={motion.section}
      ref={wrapperRef}
      style={{ backgroundColor: pageBgColor }}
      sx={{ color: "#FFFFFF" }}
    >
      {sections.map((section, index) => {
        const hasPrev = index > 0 && t(section.prevKey || "").trim().length > 0;
        const hasNext = index < sections.length - 1 && t(section.nextKey).trim().length > 0;
        const title = t(section.titleKey);

        return (
          <Box
            key={section.titleKey}
            ref={(el) => {
              sectionRefs.current[index] = el as HTMLElement | null;
            }}
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 10, xxl: 16, xxxl: 24 },
              py: { xs: 5, sm: 6, md: 8, xl: 9, xxl: 10, xxxl: 12 },
            }}
          >
            {/* Wider container at xxl/xxxl to fill the screen */}
            <Container maxWidth={false} sx={{ width: "100%", maxWidth: { xs: "120rem", xxl: "200rem", xxxl: "300rem" } }}>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, ease: "linear" }}
              >
                {/* Header row: logo + page counter */}
                <Box sx={{ mb: { xs: 2, md: 2.5, xl: 3, xxl: 5, xxxl: 7 }, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2 }}>
                  <Box
                    component="img"
                    src="/wpt-black-full-length-logo.svg"
                    alt="Waste Power Tech"
                    sx={{
                      width: { xs: "min(76vw, 280px)", sm: "340px", md: "420px", xl: "520px", xxl: "720px", xxxl: "960px" },
                      height: "auto",
                      display: "block",
                    }}
                  />
                  <Typography sx={{
                    fontFamily: "Stack Sans Headline, sans-serif",
                    fontWeight: 700,
                    fontSize: { xs: "0.95rem", sm: "1rem", md: "1.08rem", xl: "1.22rem", xxl: "2rem", xxxl: "2.8rem" },
                  }}>
                    {String(index + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                  </Typography>
                </Box>

                <Box sx={{
                  borderTop: { xs: "2px solid #FFFFFF", xxl: "3px solid #FFFFFF", xxxl: "4px solid #FFFFFF" },
                  borderBottom: { xs: "2px solid #FFFFFF", xxl: "3px solid #FFFFFF", xxxl: "4px solid #FFFFFF" },
                  py: { xs: 4, md: 5, xxl: 8, xxxl: 12 },
                  minHeight: { xs: "auto", md: "72vh" },
                }}>
                  {title.trim().length > 0 && (
                    <Typography
                      variant="h2"
                      sx={{
                        fontFamily: "Stack Sans Headline, sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.4rem", lg: "2.8rem", xl: "3.4rem", xxl: "5.2rem", xxxl: "7.2rem" },
                        lineHeight: 1.12,
                        mb: { xs: 2.2, md: 2.5, xl: 3, xxl: 5, xxxl: 7 },
                        maxWidth: "28ch",
                        whiteSpace: "pre-line",
                        textAlign: "left",
                        pl: section.titleLeftPadding ? { xs: 1.5, sm: 2, md: 2.5, xl: 3, xxl: 5, xxxl: 7 } : 0,
                      }}
                    >
                      {title}
                    </Typography>
                  )}

                  {section.videoEmbedUrl ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: { xs: 1.2, md: 1.5, xl: 2, xxl: 4, xxxl: 6 },
                        mb: { xs: 3, md: 3.6, xxl: 6, xxxl: 9 },
                        alignItems: "stretch",
                      }}
                    >
                      <Box
                        sx={{
                          px: { xs: 1.2, md: 1.6, xl: 2, xxl: 3, xxxl: 4 },
                          py: { xs: 1.2, md: 1.6, xl: 2, xxl: 3, xxxl: 4 },
                          minHeight: { xs: "auto", md: "30rem", xl: "34rem", xxl: "44rem", xxxl: "56rem" },
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography sx={{
                          fontFamily: "Figtree, sans-serif",
                          fontSize: { xs: "1rem", sm: "1.05rem", md: "1.12rem", lg: "1.2rem", xl: "1.35rem", xxl: "2.2rem", xxxl: "3rem" },
                          lineHeight: 1.72,
                          whiteSpace: "pre-line",
                        }}>
                          {t(section.bodyKey)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          px: { xs: 1.2, md: 1.6, xl: 2, xxl: 3, xxxl: 4 },
                          py: { xs: 1.2, md: 1.6, xl: 2, xxl: 3, xxxl: 4 },
                          minHeight: { xs: "auto", md: "30rem", xl: "34rem", xxl: "44rem", xxxl: "56rem" },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Typography sx={{
                          fontFamily: "Stack Sans Headline, sans-serif",
                          fontWeight: 700,
                          fontSize: { xs: "0.9rem", md: "0.98rem", xl: "1.12rem", xxl: "2rem", xxxl: "2.8rem" },
                          mt: 0,
                          mb: { xs: 0.8, md: 1, xxl: 2, xxxl: 3 },
                        }}>
                          {t(section.videoTitleKey || "")}
                        </Typography>
                        <Box
                          component="iframe"
                          loading="lazy"
                          src={section.videoEmbedUrl}
                          title={t(section.videoTitleKey || "")}
                          referrerPolicy="strict-origin-when-cross-origin"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          sx={{ width: "100%", aspectRatio: "16 / 9", border: "none", display: "block" }}
                        />
                      </Box>
                    </Box>
                  ) : section.infraTiles && section.bodyKey.trim().length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 2, md: 2.6, xl: 3.1, xxl: 5, xxxl: 7 },
                        mb: { xs: 3, md: 3.6, xxl: 6, xxxl: 9 },
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: { md: "44rem", xl: "48rem", xxl: "76rem", xxxl: "108rem" },
                          display: "grid",
                          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                          gap: 0,
                          bgcolor: "#0000FF",
                        }}
                      >
                        {section.infraTiles.map((tile, tileIndex) => (
                          <Box
                            key={`${tile.textKey}-${tileIndex}`}
                            sx={{
                              bgcolor: tile.bgColor,
                              minHeight: { xs: "6rem", md: "7.1rem", xl: "7.8rem", xxl: "12rem", xxxl: "17rem" },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              px: { xs: 0.6, md: 0.75, xl: 0.9, xxl: 1.5, xxxl: 2 },
                            }}
                          >
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: { xs: 0.45, md: 0.6, xl: 0.8, xxl: 1.2, xxxl: 1.8 } }}>
                              {tile.icon === "waste" && <FaTrashAlt style={{ fontSize: "clamp(1.9rem, 2.4vw, 4.5rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "grid" && <MdOutlineElectricalServices style={{ fontSize: "clamp(1.9rem, 2.4vw, 4.5rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "surface" && <MdFactory style={{ fontSize: "clamp(1.9rem, 2.4vw, 4.5rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "permits" && <MdOutlineFactCheck style={{ fontSize: "clamp(1.9rem, 2.4vw, 4.5rem)", color: "#FFFFFF" }} />}
                              <Typography sx={{
                                fontFamily: "Stack Sans Headline, sans-serif",
                                fontWeight: 700,
                                color: "#FFFFFF",
                                fontSize: { xs: "0.64rem", sm: "0.7rem", md: "0.74rem", xl: "0.82rem", xxl: "1.3rem", xxxl: "1.8rem" },
                                lineHeight: 1.15,
                                textAlign: "center",
                                whiteSpace: "pre-line",
                              }}>
                                {t(tile.textKey)}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      <Typography sx={{
                        fontFamily: "Figtree, sans-serif",
                        fontSize: { xs: "1rem", sm: "1.05rem", md: "1.12rem", lg: "1.2rem", xl: "1.35rem", xxl: "2.2rem", xxxl: "3rem" },
                        lineHeight: 1.72,
                        whiteSpace: "pre-line",
                        maxWidth: "80ch",
                      }}>
                        {t(section.bodyKey)}
                      </Typography>
                    </Box>
                  ) : section.bodyKey.trim().length > 0 && (
                    <Typography sx={{
                      fontFamily: "Figtree, sans-serif",
                      fontSize: { xs: "1rem", sm: "1.05rem", md: "1.12rem", lg: "1.2rem", xl: "1.35rem", xxl: "2.2rem", xxxl: "3rem" },
                      lineHeight: 1.72,
                      maxWidth: "80ch",
                      whiteSpace: "pre-line",
                      mb: { xs: 3, md: 3.6, xxl: 6, xxxl: 9 },
                    }}>
                      {t(section.bodyKey)}
                    </Typography>
                  )}

                  {section.timelineLabelKey && section.timelineTicks && (
                    <Box sx={{ mt: { xs: 2.2, md: 2.8, xl: 3.2, xxl: 5, xxxl: 7 }, maxWidth: { xs: "92ch", xxl: "160ch", xxxl: "220ch" } }}>
                      <Box sx={{ position: "relative", pt: { xs: 2.4, md: 2.8, xl: 3.4, xxl: 5.5, xxxl: 7.5 } }}>
                        <Typography sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          fontFamily: "Stack Sans Headline, sans-serif",
                          fontWeight: 700,
                          fontSize: { xxl: "1.8rem", xxxl: "2.4rem" },
                        }}>
                          {t(section.timelineLabelKey)}
                        </Typography>
                        <Box sx={{ borderTop: { xs: "2px solid #FFFFFF", xxl: "3px solid #FFFFFF", xxxl: "4px solid #FFFFFF" }, width: "100%" }} />
                        <Box sx={{ position: "relative", height: { xs: "6rem", md: "7rem", xl: "8rem", xxl: "13rem", xxxl: "18rem" } }}>
                          {section.timelineTicks.map((tickKey, tickIndex) => {
                            const leftPositions = ["22%", "56%", "86%"];
                            return (
                              <Box key={tickKey} sx={{
                                position: "absolute",
                                top: 0,
                                left: leftPositions[tickIndex],
                                transform: "translateX(-50%)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: { xs: "8rem", sm: "10rem", md: "12rem", xl: "15rem", xxl: "24rem", xxxl: "34rem" },
                              }}>
                                <Box sx={{ width: { xs: "2px", xxl: "3px", xxxl: "4px" }, height: { xs: "1rem", md: "1.25rem", xl: "1.45rem", xxl: "2.2rem", xxxl: "3rem" }, bgcolor: "#FFFFFF" }} />
                                <Typography sx={{
                                  mt: { xs: 0.7, md: 0.9, xl: 1.1, xxl: 1.8, xxxl: 2.4 },
                                  fontFamily: "Figtree, sans-serif",
                                  fontWeight: 600,
                                  fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem", xl: "1.18rem", xxl: "2rem", xxxl: "2.8rem" },
                                  lineHeight: 1.35,
                                  textAlign: "center",
                                  whiteSpace: "pre-line",
                                }}>
                                  {t(tickKey)}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {section.infraTiles && !section.bodyKey.trim().length && (
                    <Box sx={{ mt: { xs: 2.2, md: 2.8, xl: 3.2, xxl: 5, xxxl: 7 }, maxWidth: { md: "34rem", xl: "40rem", xxl: "68rem", xxxl: "96rem" } }}>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" }, gap: { xs: 0.4, md: 0.5, xxl: 1, xxxl: 1.5 } }}>
                        {section.infraTiles.map((tile, tileIndex) => (
                          <Box
                            key={`${tile.textKey}-${tileIndex}`}
                            sx={{
                              bgcolor: tile.bgColor,
                              aspectRatio: "1.35 / 1",
                              minHeight: { xs: "5.5rem", md: "6.3rem", xl: "7rem", xxl: "11rem", xxxl: "16rem" },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              px: { xs: 0.7, md: 0.9, xl: 1.1, xxl: 1.8, xxxl: 2.5 },
                            }}
                          >
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: { xs: 0.8, md: 1, xl: 1.2, xxl: 2, xxxl: 2.8 } }}>
                              {tile.icon === "waste" && <FaTrashAlt style={{ fontSize: "clamp(1.5rem, 2.1vw, 4.5rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "grid" && <MdOutlineElectricalServices style={{ fontSize: "clamp(1.6rem, 2.2vw, 4.8rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "surface" && <MdFactory style={{ fontSize: "clamp(1.6rem, 2.2vw, 4.8rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "permits" && <MdOutlineFactCheck style={{ fontSize: "clamp(1.6rem, 2.2vw, 4.8rem)", color: "#FFFFFF" }} />}
                              <Typography sx={{
                                fontFamily: "Stack Sans Headline, sans-serif",
                                fontWeight: 700,
                                color: "#FFFFFF",
                                fontSize: { xs: "0.72rem", sm: "0.76rem", md: "0.82rem", lg: "0.86rem", xl: "0.92rem", xxl: "1.5rem", xxxl: "2.1rem" },
                                lineHeight: 1.15,
                                textAlign: "center",
                                whiteSpace: "pre-line",
                              }}>
                                {t(tile.textKey)}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {(section.sectionTitleKey || section.sectionDividerOnly || section.processShowArrows === false) && section.processStepKeys && (
                    <Box sx={{ mb: { xs: 3, sm: 3.2, md: 3.6, lg: 4.2, xxl: 6, xxxl: 9 } }}>
                      {section.sectionTitleKey && (
                        <Typography sx={{
                          fontFamily: "Stack Sans Headline, sans-serif",
                          fontWeight: 700,
                          fontSize: { xs: "1.05rem", sm: "1.15rem", md: "1.3rem", lg: "1.5rem", xl: "1.85rem", xxl: "3rem", xxxl: "4.2rem" },
                          lineHeight: 1.2,
                          mb: { xs: 1.4, md: 2, xl: 2.4, xxl: 4, xxxl: 5.5 },
                        }}>
                          {t(section.sectionTitleKey)}
                        </Typography>
                      )}
                      {section.sectionDividerOnly && <Box sx={{ borderTop: { xs: "2px solid #FFFFFF", xxl: "3px solid #FFFFFF", xxxl: "4px solid #FFFFFF" }, mb: { xs: 2, sm: 2.4, md: 3, xl: 3.5, xxl: 5.5, xxxl: 7.5 } }} />}
                      <Box sx={{
                        display: "grid",
                        gridTemplateColumns: section.processShowArrows === false
                          ? { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }
                          : { xs: "1fr", md: "repeat(7, minmax(0, auto))" },
                        alignItems: "stretch",
                        justifyContent: { md: "start" },
                        rowGap: 0,
                        columnGap: section.processShowArrows === false ? 0 : { md: 0 },
                        width: section.processShowArrows === false ? "100%" : "auto",
                        maxWidth: section.processShowArrows === false
                          ? { md: "44rem", xl: "48rem", xxl: "76rem", xxxl: "108rem" }
                          : "none",
                        bgcolor: "transparent",
                      }}>
                        {section.processStepKeys.map((step, stepIndex) => {
                          const isLast = stepIndex === section.processStepKeys!.length - 1;

                          return (
                            <Box key={step.textKey} sx={{ display: "contents" }}>
                              <Box sx={{
                                px: section.processShowArrows === false
                                  ? { xs: 0.6, md: 0.75, xl: 0.9, xxl: 1.5, xxxl: 2.2 }
                                  : { xs: 1.3, sm: 1.6, md: 1.8, xl: 2.2, xxl: 3.5, xxxl: 5 },
                                py: section.processShowArrows === false
                                  ? { xs: 0.9, md: 1.1, xl: 1.2, xxl: 2, xxxl: 2.8 }
                                  : { xs: 1.25, sm: 1.45, md: 1.6, xl: 1.9, xxl: 3, xxxl: 4.5 },
                                minWidth: section.processShowArrows === false
                                  ? "auto"
                                  : { md: "12rem", xl: "14rem", xxl: "22rem", xxxl: "32rem" },
                                minHeight: section.processShowArrows === false
                                  ? { xs: "6rem", md: "7.1rem", xl: "7.8rem", xxl: "12rem", xxxl: "17rem" }
                                  : "auto",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: section.processShowArrows === false ? "center" : "flex-start",
                              }}>
                                <Box sx={{ mb: { xs: 0.8, md: 1.05, xl: 1.25, xxl: 2, xxxl: 3 } }}>
                                  <Box
                                    component="img"
                                    src={PROCESS_ICON_SOURCES[step.icon]}
                                    alt=""
                                    aria-hidden="true"
                                    sx={{
                                      height: section.processShowArrows === false
                                        ? { xs: "clamp(2.6rem, 3.2vw, 3.6rem)", xxl: "clamp(4rem, 3.2vw, 6.5rem)", xxxl: "clamp(5rem, 3.2vw, 9rem)" }
                                        : { xs: "clamp(4rem, 4.8vw, 6.2rem)", xxl: "clamp(6rem, 4.8vw, 10rem)", xxxl: "clamp(8rem, 4.8vw, 14rem)" },
                                      width: "auto",
                                      maxHeight: { xs: "100px", xxl: "160px", xxxl: "220px" },
                                      display: "block",
                                      mx: section.processShowArrows === false ? "auto" : 0,
                                      filter: "brightness(0) invert(1)",
                                    }}
                                  />
                                </Box>
                                <Typography sx={{
                                  fontFamily: "Figtree, sans-serif",
                                  fontWeight: 600,
                                  fontSize: section.processShowArrows === false
                                    ? { xs: "0.64rem", sm: "0.7rem", md: "0.74rem", xl: "0.82rem", xxl: "1.35rem", xxxl: "1.9rem" }
                                    : { xs: "0.96rem", sm: "1rem", md: "1.08rem", lg: "1.14rem", xl: "1.35rem", xxl: "2.2rem", xxxl: "3.1rem" },
                                  lineHeight: section.processShowArrows === false ? 1.15 : 1.45,
                                  maxWidth: section.processShowArrows === false ? "14ch" : { md: "20ch" },
                                  textAlign: section.processShowArrows === false ? "center" : "left",
                                  whiteSpace: "pre-line",
                                }}>
                                  {t(step.textKey)}
                                </Typography>
                              </Box>
                              {section.processShowArrows !== false && !isLast && (
                                <Box sx={{ display: "flex", alignItems: "stretch", justifyContent: "stretch", minHeight: { xs: "2.2rem", md: "100%" } }}>
                                  <Box
                                    sx={{
                                      display: { xs: "block", md: "none" },
                                      width: "100%",
                                      height: "2.2rem",
                                      bgcolor: "rgba(255,255,255,0.12)",
                                      clipPath: "polygon(0 0,100% 0,100% 65%,50% 100%,0 65%)",
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      display: { xs: "none", md: "block" },
                                      width: { md: "3.2rem", xxl: "5rem", xxxl: "7rem" },
                                      minHeight: "100%",
                                      bgcolor: "rgba(255,255,255,0.12)",
                                      clipPath: "polygon(0 0,72% 0,100% 50%,72% 100%,0 100%,20% 50%)",
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                      {section.postProcessBodyKey && (
                        <Box sx={{ mt: { xs: 2.2, md: 2.8, xl: 3.2, xxl: 5, xxxl: 7 } }}>
                          <Typography sx={{
                            fontFamily: "Figtree, sans-serif",
                            fontSize: { xs: "1rem", sm: "1.05rem", md: "1.12rem", lg: "1.2rem", xl: "1.35rem", xxl: "2.2rem", xxxl: "3rem" },
                            lineHeight: 1.72,
                            maxWidth: "80ch",
                            whiteSpace: "pre-line",
                          }}>
                            {t(section.postProcessBodyKey)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Prev / Next navigation */}
                  <Box sx={{
                    mt: { xs: 3, md: 4, xxl: 7, xxxl: 10 },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    pl: { xs: 0, md: "5em" },
                    pr: { xs: 0, md: "5em" },
                    gap: 2,
                  }}>
                    {hasPrev ? (
                      <ButtonBase onClick={() => jumpToSection(index - 1)} sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1.1,
                        color: "#FFFFFF",
                        textDecoration: "underline",
                        textUnderlineOffset: "0.2em",
                        fontFamily: "Stack Sans Headline, sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem", lg: "1.12rem", xl: "1.18rem", xxl: "2.2rem", xxxl: "3rem" },
                      }}>
                        <Box component="span" aria-hidden="true" sx={{ width: { xs: "1.05rem", xxl: "1.7rem", xxxl: "2.3rem" }, height: { xs: "1.05rem", xxl: "1.7rem", xxxl: "2.3rem" }, display: "inline-block", borderTop: { xs: "1.5px solid #FFFFFF", xxl: "2.5px solid #FFFFFF", xxxl: "3px solid #FFFFFF" }, borderLeft: { xs: "1.5px solid #FFFFFF", xxl: "2.5px solid #FFFFFF", xxxl: "3px solid #FFFFFF" }, transform: "rotate(-45deg) translateY(1px)" }} />
                        {t(section.prevKey || "tech-body-prev-link")}
                      </ButtonBase>
                    ) : (
                      <Box />
                    )}

                    {hasNext ? (
                      <ButtonBase onClick={() => jumpToSection(index + 1)} sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1.1,
                        color: "#FFFFFF",
                        textDecoration: "underline",
                        textUnderlineOffset: "0.2em",
                        fontFamily: "Stack Sans Headline, sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem", lg: "1.12rem", xl: "1.18rem", xxl: "2.2rem", xxxl: "3rem" },
                      }}>
                        {t(section.nextKey)}
                        <Box component="span" aria-hidden="true" sx={{ width: { xs: "1.05rem", xxl: "1.7rem", xxxl: "2.3rem" }, height: { xs: "1.05rem", xxl: "1.7rem", xxxl: "2.3rem" }, display: "inline-block", borderTop: { xs: "1.5px solid #FFFFFF", xxl: "2.5px solid #FFFFFF", xxxl: "3px solid #FFFFFF" }, borderRight: { xs: "1.5px solid #FFFFFF", xxl: "2.5px solid #FFFFFF", xxxl: "3px solid #FFFFFF" }, transform: "rotate(45deg) translateY(1px)" }} />
                      </ButtonBase>
                    ) : (
                      <Box />
                    )}
                  </Box>
                </Box>
              </motion.div>
            </Container>
          </Box>
        );
      })}
    </Box>
  );
}

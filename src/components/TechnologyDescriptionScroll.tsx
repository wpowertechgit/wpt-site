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
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/p8VD26dwU14",
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
              px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 10, xxl: 10, xxxl: 20 },
              py: { xs: 5, sm: 6, md: 8, xl: 9 },
            }}
          >
            <Container maxWidth={false} sx={{ width: "100%", maxWidth: "120rem" }}>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, ease: "linear" }}
              >
                <Box sx={{ mb: { xs: 2, md: 2.5, xl: 3 }, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2 }}>
                  <Box
                    component="img"
                    src="/wpt-black-full-length-logo.svg"
                    alt="Waste Power Tech"
                    sx={{
                      width: { xs: "min(76vw, 280px)", sm: "340px", md: "420px", xl: "520px", xxl: "520px", xxxl: "660px" },
                      height: "auto",
                      display: "block",
                    }}
                  />
                  <Typography sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "0.95rem", sm: "1rem", md: "1.08rem", xl: "1.22rem" } }}>
                    {String(index + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                  </Typography>
                </Box>

                <Box sx={{ borderTop: "2px solid #FFFFFF", borderBottom: "2px solid #FFFFFF", py: { xs: 4, md: 5 }, minHeight: { xs: "auto", md: "72vh" } }}>
                  {title.trim().length > 0 && (
                    <Typography
                      variant="h2"
                      sx={{
                        fontFamily: "Stack Sans Headline, sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.4rem", lg: "2.8rem", xl: "3.4rem", xxl: "3.4rem", xxxl: "4.4rem" },
                        lineHeight: 1.12,
                        mb: { xs: 2.2, md: 2.5, xl: 3 },
                        maxWidth: "28ch",
                        whiteSpace: "pre-line",
                        textAlign: "left",
                        pl: section.titleLeftPadding ? { xs: 1.5, sm: 2, md: 2.5, xl: 3 } : 0,
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
                        gap: { xs: 1.2, md: 1.5, xl: 2 },
                        mb: { xs: 3, md: 3.6 },
                        alignItems: "stretch",
                      }}
                    >
                      <Box
                        sx={{
                          px: { xs: 1.2, md: 1.6, xl: 2 },
                          py: { xs: 1.2, md: 1.6, xl: 2 },
                          minHeight: { xs: "auto", md: "30rem", xl: "34rem" },
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: { xs: "1rem", sm: "1.05rem", md: "1.12rem", lg: "1.2rem", xl: "1.35rem", xxl: "1.35rem", xxxl: "1.9rem" }, lineHeight: 1.72, whiteSpace: "pre-line" }}>
                          {t(section.bodyKey)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          px: { xs: 1.2, md: 1.6, xl: 2 },
                          py: { xs: 1.2, md: 1.6, xl: 2 },
                          minHeight: { xs: "auto", md: "30rem", xl: "34rem" },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Typography sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "0.9rem", md: "0.98rem", xl: "1.12rem" }, mt: 0, mb: { xs: 0.8, md: 1 } }}>
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
                        gap: { xs: 2, md: 2.6, xl: 3.1 },
                        mb: { xs: 3, md: 3.6 },
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: { md: "44rem", xl: "48rem" },
                          display: "grid",
                          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                          gap: 0,
                          bgcolor: "#0000FF",
                        }}
                      >
                        {section.infraTiles.map((tile, tileIndex) => (
                          <Box key={`${tile.textKey}-${tileIndex}`} sx={{ bgcolor: tile.bgColor, minHeight: { xs: "6rem", md: "7.1rem", xl: "7.8rem" }, display: "flex", alignItems: "center", justifyContent: "center", px: { xs: 0.6, md: 0.75, xl: 0.9 } }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: { xs: 0.45, md: 0.6, xl: 0.8 } }}>
                              {tile.icon === "waste" && <FaTrashAlt style={{ fontSize: "clamp(1.9rem, 2.4vw, 2.6rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "grid" && <MdOutlineElectricalServices style={{ fontSize: "clamp(1.9rem, 2.4vw, 2.6rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "surface" && <MdFactory style={{ fontSize: "clamp(1.9rem, 2.4vw, 2.6rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "permits" && <MdOutlineFactCheck style={{ fontSize: "clamp(1.9rem, 2.4vw, 2.6rem)", color: "#FFFFFF" }} />}
                              <Typography sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, color: "#FFFFFF", fontSize: { xs: "0.64rem", sm: "0.7rem", md: "0.74rem", xl: "0.82rem", xxl: "0.82rem", xxxl: "0.92rem" }, lineHeight: 1.15, textAlign: "center", whiteSpace: "pre-line" }}>
                                {t(tile.textKey)}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: { xs: "1rem", sm: "1.05rem", md: "1.12rem", lg: "1.2rem", xl: "1.35rem", xxl: "1.35rem", xxxl: "1.9rem" }, lineHeight: 1.72, whiteSpace: "pre-line", maxWidth: "80ch" }}>
                        {t(section.bodyKey)}
                      </Typography>
                    </Box>
                  ) : section.bodyKey.trim().length > 0 && (
                    <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: { xs: "1rem", sm: "1.05rem", md: "1.12rem", lg: "1.2rem", xl: "1.35rem", xxl: "1.35rem", xxxl: "1.9rem" }, lineHeight: 1.72, maxWidth: "80ch", whiteSpace: "pre-line", mb: { xs: 3, md: 3.6 } }}>
                      {t(section.bodyKey)}
                    </Typography>
                  )}

                  {section.timelineLabelKey && section.timelineTicks && (
                    <Box sx={{ mt: { xs: 2.2, md: 2.8, xl: 3.2 }, maxWidth: "92ch" }}>
                      <Box sx={{ position: "relative", pt: { xs: 2.4, md: 2.8, xl: 3.4 } }}>
                        <Typography sx={{ position: "absolute", top: 0, left: 0, fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700 }}>{t(section.timelineLabelKey)}</Typography>
                        <Box sx={{ borderTop: "2px solid #FFFFFF", width: "100%" }} />
                        <Box sx={{ position: "relative", height: { xs: "6rem", md: "7rem", xl: "8rem" } }}>
                          {section.timelineTicks.map((tickKey, tickIndex) => {
                            const leftPositions = ["22%", "56%", "86%"];
                            return (
                              <Box key={tickKey} sx={{ position: "absolute", top: 0, left: leftPositions[tickIndex], transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", width: { xs: "8rem", sm: "10rem", md: "12rem", xl: "15rem", xxl: "15rem", xxxl: "18rem" } }}>
                                <Box sx={{ width: "2px", height: { xs: "1rem", md: "1.25rem", xl: "1.45rem" }, bgcolor: "#FFFFFF" }} />
                                <Typography sx={{ mt: { xs: 0.7, md: 0.9, xl: 1.1 }, fontFamily: "Figtree, sans-serif", fontWeight: 600, fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem", xl: "1.18rem", xxl: "1.18rem", xxxl: "1.55rem" }, lineHeight: 1.35, textAlign: "center", whiteSpace: "pre-line" }}>
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
                    <Box sx={{ mt: { xs: 2.2, md: 2.8, xl: 3.2 }, maxWidth: { md: "34rem", xl: "40rem" } }}>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" }, gap: { xs: 0.4, md: 0.5 } }}>
                        {section.infraTiles.map((tile, tileIndex) => (
                          <Box key={`${tile.textKey}-${tileIndex}`} sx={{ bgcolor: tile.bgColor, aspectRatio: "1.35 / 1", minHeight: { xs: "5.5rem", md: "6.3rem", xl: "7rem" }, display: "flex", alignItems: "center", justifyContent: "center", px: { xs: 0.7, md: 0.9, xl: 1.1 } }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: { xs: 0.8, md: 1, xl: 1.2 } }}>
                              {tile.icon === "waste" && <FaTrashAlt style={{ fontSize: "clamp(1.5rem, 2.1vw, 2.8rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "grid" && <MdOutlineElectricalServices style={{ fontSize: "clamp(1.6rem, 2.2vw, 3rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "surface" && <MdFactory style={{ fontSize: "clamp(1.6rem, 2.2vw, 3rem)", color: "#FFFFFF" }} />}
                              {tile.icon === "permits" && <MdOutlineFactCheck style={{ fontSize: "clamp(1.6rem, 2.2vw, 3rem)", color: "#FFFFFF" }} />}
                              <Typography sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, color: "#FFFFFF", fontSize: { xs: "0.72rem", sm: "0.76rem", md: "0.82rem", lg: "0.86rem", xl: "0.92rem", xxl: "0.92rem", xxxl: "1rem" }, lineHeight: 1.15, textAlign: "center", whiteSpace: "pre-line" }}>
                                {t(tile.textKey)}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {(section.sectionTitleKey || section.sectionDividerOnly || section.processShowArrows === false) && section.processStepKeys && (
                    <Box sx={{ mb: { xs: 3, sm: 3.2, md: 3.6, lg: 4.2 } }}>
                      {section.sectionTitleKey && (
                        <Typography sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "1.05rem", sm: "1.15rem", md: "1.3rem", lg: "1.5rem", xl: "1.85rem", xxl: "1.85rem", xxxl: "2.5rem" }, lineHeight: 1.2, mb: { xs: 1.4, md: 2, xl: 2.4 } }}>
                          {t(section.sectionTitleKey)}
                        </Typography>
                      )}
                      {section.sectionDividerOnly && <Box sx={{ borderTop: "2px solid #FFFFFF", mb: { xs: 2, sm: 2.4, md: 3, xl: 3.5 } }} />}
                      <Box sx={{ display: "grid", gridTemplateColumns: section.processShowArrows === false ? { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" } : { xs: "1fr", md: "repeat(7, minmax(0, auto))" }, alignItems: "stretch", justifyContent: { md: section.processShowArrows === false ? "start" : "start" }, rowGap: 0, columnGap: section.processShowArrows === false ? 0 : { md: 0 }, width: section.processShowArrows === false ? "100%" : "auto", maxWidth: section.processShowArrows === false ? { md: "44rem", xl: "48rem" } : "none", bgcolor: "transparent" }}>
                        {section.processStepKeys.map((step, stepIndex) => {
                          const isLast = stepIndex === section.processStepKeys!.length - 1;

                          return (
                            <Box key={step.textKey} sx={{ display: "contents" }}>
                              <Box sx={{ px: section.processShowArrows === false ? { xs: 0.6, md: 0.75, xl: 0.9 } : { xs: 1.3, sm: 1.6, md: 1.8, xl: 2.2, xxl: 2.2, xxxl: 2.8 }, py: section.processShowArrows === false ? { xs: 0.9, md: 1.1, xl: 1.2 } : { xs: 1.25, sm: 1.45, md: 1.6, xl: 1.9, xxl: 1.9, xxxl: 2.4 }, minWidth: section.processShowArrows === false ? "auto" : { md: "12rem", xl: "14rem", xxl: "14rem", xxxl: "16.5rem" }, minHeight: section.processShowArrows === false ? { xs: "6rem", md: "7.1rem", xl: "7.8rem" } : "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: section.processShowArrows === false ? "center" : "flex-start" }}>
                                <Box sx={{ mb: { xs: 0.8, md: 1.05, xl: 1.25 } }}>
                                  <Box component="img" src={PROCESS_ICON_SOURCES[step.icon]} alt="" aria-hidden="true" sx={{ height: section.processShowArrows === false ? "clamp(2.6rem, 3.2vw, 3.6rem)" : "clamp(4rem, 4.8vw, 6.2rem)", width: "auto", maxHeight: "100px", display: "block", mx: section.processShowArrows === false ? "auto" : 0, filter: "brightness(0) invert(1)" }} />
                                </Box>
                                <Typography sx={{ fontFamily: "Figtree, sans-serif", fontWeight: 600, fontSize: section.processShowArrows === false ? { xs: "0.64rem", sm: "0.7rem", md: "0.74rem", xl: "0.82rem", xxl: "0.82rem", xxxl: "0.92rem" } : { xs: "0.96rem", sm: "1rem", md: "1.08rem", lg: "1.14rem", xl: "1.35rem", xxl: "1.35rem", xxxl: "1.9rem" }, lineHeight: section.processShowArrows === false ? 1.15 : 1.45, maxWidth: section.processShowArrows === false ? "14ch" : { md: "20ch" }, textAlign: section.processShowArrows === false ? "center" : "left", whiteSpace: "pre-line" }}>
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
                                      width: "3.2rem",
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
                        <Box sx={{ mt: { xs: 2.2, md: 2.8, xl: 3.2 }, px: { xs: 0, md: 0 } }}>
                          <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: { xs: "1rem", sm: "1.05rem", md: "1.12rem", lg: "1.2rem", xl: "1.35rem", xxl: "1.35rem", xxxl: "1.9rem" }, lineHeight: 1.72, maxWidth: "80ch", whiteSpace: "pre-line" }}>
                            {t(section.postProcessBodyKey)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  <Box sx={{ mt: { xs: 3, md: 4 }, display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", pl: { xs: 0, md: "5em" }, pr: { xs: 0, md: "5em" }, gap: 2 }}>
                    {hasPrev ? (
                      <ButtonBase onClick={() => jumpToSection(index - 1)} sx={{ display: "inline-flex", alignItems: "center", gap: 1.1, color: "#FFFFFF", textDecoration: "underline", textUnderlineOffset: "0.2em", fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem", lg: "1.12rem", xl: "1.18rem" } }}>
                        <Box component="span" aria-hidden="true" sx={{ width: "1.05rem", height: "1.05rem", display: "inline-block", borderTop: "1.5px solid #FFFFFF", borderLeft: "1.5px solid #FFFFFF", transform: "rotate(-45deg) translateY(1px)" }} />
                        {t(section.prevKey || "tech-body-prev-link")}
                      </ButtonBase>
                    ) : (
                      <Box />
                    )}

                    {hasNext ? (
                      <ButtonBase onClick={() => jumpToSection(index + 1)} sx={{ display: "inline-flex", alignItems: "center", gap: 1.1, color: "#FFFFFF", textDecoration: "underline", textUnderlineOffset: "0.2em", fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem", lg: "1.12rem", xl: "1.18rem" } }}>
                        {t(section.nextKey)}
                        <Box component="span" aria-hidden="true" sx={{ width: "1.05rem", height: "1.05rem", display: "inline-block", borderTop: "1.5px solid #FFFFFF", borderRight: "1.5px solid #FFFFFF", transform: "rotate(45deg) translateY(1px)" }} />
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



import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Box, Button, ButtonBase, Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type SectionKey = "operational" | "caloric" | "scalability" | "roi" | "refraction";

type SectionItem = {
  key: SectionKey;
  titleKey: string;
  bodyKey?: string;
  imageAltKey?: string;
  imageSrc?: string;
  isRefraction?: boolean;
};

const SECTION_ITEMS: SectionItem[] = [
  {
    key: "operational",
    titleKey: "b2b.sections.operational.title",
    bodyKey: "b2b.sections.operational.body",
    imageAltKey: "b2b.sections.operational.imageAlt",
    imageSrc: "/b2iblueprint.jpg",
  },
  {
    key: "caloric",
    titleKey: "b2b.sections.caloric.title",
    bodyKey: "b2b.sections.caloric.body",
    imageAltKey: "b2b.sections.caloric.imageAlt",
    imageSrc: "/billboard3.jpg",
  },
  {
    key: "scalability",
    titleKey: "b2b.sections.scalability.title",
    bodyKey: "b2b.sections.scalability.body",
    imageAltKey: "b2b.sections.scalability.imageAlt",
    imageSrc: "/b2bstation.jpg",
  },
  {
    key: "roi",
    titleKey: "b2b.sections.roi.title",
    bodyKey: "b2b.sections.roi.body",
    imageAltKey: "b2b.sections.roi.imageAlt",
    imageSrc: "/office15.jpg",
  },
  {
    key: "refraction",
    titleKey: "b2b.refraction.title",
    bodyKey: "b2b.refraction.intro",
    isRefraction: true,
  },
];

const SUB_NAV_ITEMS: Array<{ key: SectionKey; labelKey: string }> = [
  { key: "operational", labelKey: "b2b.subnav.operational" },
  { key: "caloric", labelKey: "b2b.subnav.caloric" },
  { key: "scalability", labelKey: "b2b.subnav.scalability" },
  { key: "roi", labelKey: "b2b.subnav.roi" },
  { key: "refraction", labelKey: "b2b.subnav.refraction" },
];

export default function B2BTrackScroll() {
  const { t } = useTranslation();
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const sections = useMemo(() => SECTION_ITEMS, []);

  const jumpToSection = (index: number) => {
    const target = sectionRefs.current[index];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box sx={{ color: "#000000" }}>
      <Stack direction="row" spacing={1} sx={{ mb: 0, mt: 0, flexWrap: "wrap" }}>
        {SUB_NAV_ITEMS.map((item) => (
          <Button
            key={item.key}
            onClick={() => {
              const index = sections.findIndex((s) => s.key === item.key);
              if (index >= 0) jumpToSection(index);
            }}
            disableRipple
            sx={{
              alignSelf: "flex-start",
              borderRadius: 0,
              border: "1px solid #d8d8d8",
              color: "#000000",
              bgcolor: "transparent",
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 600,
              fontSize: {
                xs: "0.85rem",
                md: "0.95rem",
                xl: "1.05rem",
                xxl: "2rem",
                xxxl: "2.7rem",
              },
              textTransform: "none",
              px: { xs: 1.6, md: 2, xxl: 2.5, xxxl: 3 },
              py: { xs: 0.7, md: 0.9, xxl: 1.1, xxxl: 1.4 },
              letterSpacing: "0.02em",
              transition: "background 180ms linear",
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            {t(item.labelKey)}
          </Button>
        ))}
      </Stack>

      <Box sx={{ mb: 4, py: { xs: 3, md: 4, xl: 5, xxl: 6, xxxl: 8 } }}>
        <Typography
          sx={{
            fontFamily: "'Stack Sans Headline', 'Syne', sans-serif",
            fontSize: {
              xs: "2rem",
              md: "2.7rem",
              xl: "3.8rem",
              xxl: "5rem",
              xxxl: "6.5rem",
            },
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            mb: 1.5,
          }}
        >
          {t("b2b.hero.title")}
        </Typography>
        <Typography
          sx={{
            maxWidth: "72ch",
            fontFamily: "'Figtree', sans-serif",
            fontSize: {
              xs: "1rem",
              md: "1.05rem",
              xl: "1.2rem",
              xxl: "2rem",
              xxxl: "2.8rem",
            },
            lineHeight: 1.7,
            color: "#2f2f2f",
            mb: 2.3,
          }}
        >
          {t("b2b.hero.body")}
        </Typography>
        <Box
          component="img"
          src="/industrialside.jpg"
          alt={t("b2b.hero.imageAlt")}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          sx={{
            width: "100%",
            height: { xs: 220, md: 320, xl: 420, xxl: 560, xxxl: 720 },
            objectFit: "cover",
            display: "block",
            border: "1px solid #d8d8d8",
            filter: "grayscale(12%)",
          }}
        />
      </Box>

      {sections.map((section, index) => {
        const hasPrev = index > 0;
        const hasNext = index < sections.length - 1;

        return (
          <Box
            key={section.key}
            ref={(el) => {
              sectionRefs.current[index] = el as HTMLElement | null;
            }}
            sx={{
              minHeight: { xs: "100vh", xxxl: "unset" },
              display: "flex",
              alignItems: "center",
              px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8, xxl: 10, xxxl: 12 },
              py: { xs: 5, sm: 6, md: 8, xl: 9, xxl: 11, xxxl: 14 },
            }}
          >
            <Container
              maxWidth={false}
              sx={{
                width: "100%",
                maxWidth: "100% !important",
                px: "0 !important",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease: "linear" }}
              >
                <Box
                  sx={{
                    mb: { xs: 2, md: 2.5, xl: 3, xxl: 4, xxxl: 5 },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/wpt-black-full-length-logo.svg"
                    alt="Waste Power Tech"
                    sx={{
                      width: {
                        xs: "min(76vw, 280px)",
                        sm: "340px",
                        md: "420px",
                        xl: "520px",
                        xxl: "680px",
                        xxxl: "920px",
                      },
                      height: "auto",
                      display: "block",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "'Stack Sans Headline', sans-serif",
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.95rem",
                        sm: "1rem",
                        md: "1.08rem",
                        xl: "1.4rem",
                        xxl: "1.8rem",
                        xxxl: "2.4rem",
                      },
                    }}
                  >
                    {String(index + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    borderTop: "2px solid #000000",
                    borderBottom: "2px solid #000000",
                    py: { xs: 4, md: 5, xl: 6, xxl: 8, xxxl: 10 },
                    minHeight: { xs: "auto", md: "60vh", xl: "65vh", xxxl: "unset" },
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: "'Stack Sans Headline', sans-serif",
                      fontWeight: 700,
                      fontSize: {
                        xs: "1.8rem",
                        sm: "2.2rem",
                        md: "2.4rem",
                        lg: "2.8rem",
                        xl: "3.6rem",
                        xxl: "4.8rem",
                        xxxl: "6.4rem",
                      },
                      lineHeight: 1.12,
                      mb: { xs: 2.2, md: 2.5, xl: 3, xxl: 4, xxxl: 5 },
                      maxWidth: "28ch",
                      textAlign: "left",
                    }}
                  >
                    {t(section.titleKey)}
                  </Typography>

                  {section.isRefraction ? (
                    <Box sx={{ maxWidth: "80vw" }}>
                      <Typography
                        sx={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: {
                            xs: "1rem",
                            sm: "1.05rem",
                            md: "1.12rem",
                            lg: "1.2rem",
                            xl: "1.35rem",
                            xxl: "2.4rem",
                            xxxl: "2.5rem",
                          },
                          lineHeight: 1.72,
                          mb: 2.4,
                        }}
                      >
                        {t(section.bodyKey || "")}
                      </Typography>
                      {(["principle1", "principle2", "principle3"] as const).map((key) => (
                        <Box
                          key={key}
                          sx={{
                            borderLeft: {
                              xs: "3px solid #000000",
                              xxl: "4px solid #000000",
                              xxxl: "5px solid #000000",
                            },
                            pl: { xs: 1.6, xxl: 2, xxxl: 2.5 },
                            py: 0.4,
                            mb: { xs: 1.2, xxl: 1.6, xxxl: 2 },
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "'Figtree', sans-serif",
                              fontSize: {
                                xs: "0.95rem",
                                md: "1rem",
                                xl: "1.1rem",
                                xxl: "2.4rem",
                                xxxl: "2.8rem",
                              },
                              lineHeight: 1.65,
                            }}
                          >
                            {t(`b2b.refraction.${key}`)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: { xs: 2.2, md: 3, xl: 4, xxl: 5, xxxl: 6 },
                        alignItems: "start",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: {
                            xs: "1rem",
                            sm: "1.05rem",
                            md: "1.12rem",
                            lg: "1.2rem",
                            xl: "1.35rem",
                            xxl: "1.7rem",
                            xxxl: "3rem",
                          },
                          lineHeight: 1.72,
                          maxWidth: "56ch",
                        }}
                      >
                        {t(section.bodyKey || "")}
                      </Typography>
                      <Box
                        component="img"
                        src={section.imageSrc}
                        alt={t(section.imageAltKey || "")}
                        sx={{
                          width: "100%",
                          height: { xs: 240, md: 360, xl: 460, xxl: 580, xxxl: 760 },
                          objectFit: "cover",
                          border: "1px solid #000000",
                          display: "block",
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    mt: { xs: 2, md: 3, xxl: 4, xxxl: 5 },
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <ButtonBase
                    onClick={() => jumpToSection(Math.max(0, index - 1))}
                    disabled={!hasPrev}
                    sx={{
                      justifySelf: "start",
                      justifyContent: "flex-start",
                      textAlign: "left",
                      opacity: hasPrev ? 1 : 0,
                      pointerEvents: hasPrev ? "auto" : "none",
                      color: "#000000",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: {
                          xs: "0.88rem",
                          md: "0.95rem",
                          xl: "1.05rem",
                          xxl: "2rem",
                          xxxl: "2.8rem",
                        },
                      }}
                    >
                      {hasPrev ? `<- ${t(sections[index - 1].titleKey)}` : ""}
                    </Typography>
                  </ButtonBase>

                  <ButtonBase
                    onClick={() => jumpToSection(Math.min(sections.length - 1, index + 1))}
                    disabled={!hasNext}
                    sx={{
                      justifySelf: "end",
                      justifyContent: "flex-end",
                      textAlign: "right",
                      opacity: hasNext ? 1 : 0,
                      pointerEvents: hasNext ? "auto" : "none",
                      color: "#000000",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: {
                          xs: "0.88rem",
                          md: "0.95rem",
                          xl: "1.05rem",
                          xxl: "2rem",
                          xxxl: "2.8rem",
                        },
                      }}
                    >
                      {hasNext ? `${t(sections[index + 1].titleKey)} ->` : ""}
                    </Typography>
                  </ButtonBase>
                </Box>
              </motion.div>
            </Container>
          </Box>
        );
      })}
    </Box>
  );
}

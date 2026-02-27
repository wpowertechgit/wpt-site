import { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_SCENES = 10;
const PRIMARY_IMAGE_SRC = "/wp-statie.jpg";
const FALLBACK_IMAGE_SRC = "/wp_statie.jpg";

// Cumulative deltaY to advance one slide
const SLIDE_THRESHOLD = 280;
// Extra cumulative deltaY at the boundary slides before releasing page scroll
const EXIT_THRESHOLD = 320;
const MOBILE_NAVBAR_OFFSET = "5rem";

type Scene = { id: number; titleKey: string; bodyKey: string };

const SCENES: Scene[] = Array.from({ length: TOTAL_SCENES }, (_, i) => ({
  id: i + 1,
  titleKey: `clujCaseStudy.scenes.${i + 1}.title`,
  bodyKey: `clujCaseStudy.scenes.${i + 1}.body`,
}));

// ─── SceneImage ───────────────────────────────────────────────────────────────

function SceneImage({ alt }: { alt: string }) {
  const [src, setSrc] = useState(PRIMARY_IMAGE_SRC);
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setSrc(FALLBACK_IMAGE_SRC)}
      loading="lazy"
      decoding="async"
      sx={{
        width: "100%",
        height: { xs: 220, sm: 280, md: 440, lg: 520, xl: 620, xxl: 760, xxxl: 920 },
        objectFit: "cover",
        display: "block",
        border: "1px solid #000000",
        flexShrink: 0,
      }}
    />
  );
}

// ─── HeaderBar ────────────────────────────────────────────────────────────────

function HeaderBar({ currentIndex, total }: { currentIndex: number; total: number }) {
  return (
    <Box sx={{ bgcolor: "#FFFFFF", borderBottom: "2px solid #000000", flexShrink: 0, width: "100%" }}>
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          maxWidth: "100% !important",
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8, xxl: 10, xxxl: 12 },
          pt: { xs: 2.5, sm: 2.8, md: 2.5, lg: 2.8, xl: 3, xxl: 3.5, xxxl: 4.2 },
          pb: { xs: 1.4, sm: 1.6, md: 1.5, lg: 1.6, xl: 1.8, xxl: 2.1, xxxl: 2.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          component="img"
          src="/wpt-black-full-length-logo.svg"
          alt="Waste Power Tech"
          loading="eager"
          decoding="async"
          sx={{
            width: {
              xs: "min(68vw, 220px)",
              sm: "280px",
              md: "380px",
              lg: "460px",
              xl: "560px",
              xxl: "700px",
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
              xs: "0.85rem",
              sm: "0.95rem",
              md: "1rem",
              lg: "1.1rem",
              xl: "1.3rem",
              xxl: "1.8rem",
              xxxl: "2.4rem",
            },
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: "#000000",
            whiteSpace: "nowrap",
          }}
        >
          {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </Typography>
      </Container>
    </Box>
  );
}

// ─── Desktop ──────────────────────────────────────────────────────────────────
//
// One plain 100vh box in normal document flow. Footer sits below it.
// No fixed positioning. No z-index conflicts. No overlap ever.
//
// Scroll hijack model:
//   "locked" state = the component owns the scroll wheel.
//   We start locked. While locked, preventDefault on every wheel event.
//   Accumulate deltaY → advance slides.
//   When past last slide with enough extra scroll → set locked=false.
//   When locked=false → wheel events are NOT prevented → page scrolls normally
//   → footer becomes visible.
//   When page scrolls back up so the outer box top is near 0 → lock again.
//
// Everything lives in refs so there are zero stale-closure issues.

function DesktopCaseStudy() {
  const { t } = useTranslation();

  // ── All state lives in refs so event handlers never go stale ──────────────
  const indexRef = useRef(0);
  const lockedRef = useRef(true);   // starts locked — component is at top of page
  const transRef = useRef(false);   // mid-transition cooldown
  const slideAccum = useRef(0);
  const exitAccum = useRef(0);
  const entryAccum = useRef(0);
  const outerRef = useRef<HTMLDivElement>(null);

  // React state only for re-rendering the UI
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [locked, setLocked] = useState(true);

  const goTo = (next: number) => {
    if (next === indexRef.current) return;
    indexRef.current = next;
    transRef.current = true;
    setActiveIndex(next);
    setIsTransitioning(true);
    setTimeout(() => {
      transRef.current = false;
      setIsTransitioning(false);
    }, 600);
  };

  const setLock = (val: boolean) => {
    lockedRef.current = val;
    setLocked(val);
    // Always reset accumulators on lock change
    slideAccum.current = 0;
    exitAccum.current = 0;
    entryAccum.current = 0;
  };

  // ── Wheel handler ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const outer = outerRef.current;
      if (!outer) return;

      const rect = outer.getBoundingClientRect();
      const atTop = rect.top > -8 && rect.top < 8; // box is flush with viewport top

      // If we scrolled back up to the box, re-lock
      if (!lockedRef.current && atTop && e.deltaY < 0) {
        setLock(true);
      }

      if (!lockedRef.current) return; // not locked — let page scroll

      e.preventDefault(); // always block default while locked

      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;
      const idx = indexRef.current;

      // ── Last slide scrolling down → accumulate then release ───────────────
      if (goingDown && idx === TOTAL_SCENES - 1) {
        exitAccum.current += Math.abs(e.deltaY);
        slideAccum.current = 0;
        if (exitAccum.current >= EXIT_THRESHOLD) {
          setLock(false);
          // Let the browser take one natural scroll step to start moving the page
          // We achieve this by not calling preventDefault on the NEXT event,
          // which happens automatically since lockedRef is now false.
        }
        return;
      }

      // ── First slide scrolling up → accumulate then release ────────────────
      if (goingUp && idx === 0) {
        entryAccum.current += Math.abs(e.deltaY);
        slideAccum.current = 0;
        if (entryAccum.current >= EXIT_THRESHOLD) {
          setLock(false);
        }
        return;
      }

      // Reset boundary accumulators when not at edges
      if (goingDown) entryAccum.current = 0;
      if (goingUp) exitAccum.current = 0;

      // ── Normal slide navigation ───────────────────────────────────────────
      if (transRef.current) return;

      slideAccum.current += e.deltaY;
      if (Math.abs(slideAccum.current) < SLIDE_THRESHOLD) return;

      const direction = slideAccum.current > 0 ? 1 : -1;
      slideAccum.current = 0;

      const next = Math.min(TOTAL_SCENES - 1, Math.max(0, idx + direction));
      goTo(next);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []); // empty deps — reads everything via refs ✓

  // ── Keyboard handler ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lockedRef.current) return;
      if (transRef.current) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        slideAccum.current = 0;
        goTo(Math.min(TOTAL_SCENES - 1, indexRef.current + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        slideAccum.current = 0;
        goTo(Math.max(0, indexRef.current - 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []); // empty deps — reads everything via refs ✓

  // ── Scroll listener: re-lock when page scrolls back to box ────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (lockedRef.current) return;
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      // When the outer box top scrolls back to viewport top, re-engage
      if (rect.top >= -4) {
        setLock(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      ref={outerRef}
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#FFFFFF",
        color: "#000000",
        flexShrink: 0,
        // When unlocked, allow the page to scroll past this box to the footer.
        // The box itself never moves — the page scroll moves it.
        position: "relative",
      }}
    >
      <HeaderBar currentIndex={activeIndex} total={TOTAL_SCENES} />

      {/* Horizontal sliding track */}
      <Box sx={{ flex: 1, overflow: "hidden", position: "relative", minHeight: 0 }}>
        <motion.div
          animate={{ x: `${-activeIndex * 100}vw` }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          style={{ display: "flex", width: `${TOTAL_SCENES * 100}vw`, height: "100%" }}
        >
          {SCENES.map((scene, index) => (
            <Box
              key={scene.id}
              sx={{
                width: "100vw",
                minWidth: "100vw",
                height: "100%",
                overflow: "hidden",
                px: { md: 4, lg: 6, xl: 8, xxl: 10, xxxl: 12 },
                pt: { md: 3, lg: 4, xl: 4.5, xxl: 5, xxxl: 6 },
                pb: { md: 4, lg: 5, xl: 6, xxl: 7, xxxl: 8 },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Container maxWidth={false} sx={{ px: "0 !important", maxWidth: "100% !important" }}>
                <AnimatePresence mode="wait">
                  {activeIndex === index && (
                    <motion.div
                      key={scene.id}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.42, ease: "easeOut", delay: 0.08 }}
                    >
                      <Box sx={{ borderBottom: "2px solid #000000", py: { md: 4, lg: 5, xl: 6, xxl: 8, xxxl: 10 } }}>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { md: "1fr", lg: "1.05fr 0.95fr" },
                            gap: { md: 3, lg: 4, xl: 5, xxl: 6, xxxl: 8 },
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontFamily: "'Stack Sans Headline', sans-serif",
                                fontWeight: 700,
                                fontSize: { md: "2.3rem", lg: "2.8rem", xl: "3.7rem", xxl: "5rem", xxxl: "6.6rem" },
                                lineHeight: 1.08,
                                mb: { md: 2.2, xl: 2.8, xxl: 3.5, xxxl: 4.4 },
                                maxWidth: "22ch",
                              }}
                            >
                              {t(scene.titleKey, { defaultValue: `Scene ${scene.id}` })}
                            </Typography>

                            <Typography
                              sx={{
                                fontFamily: "'Figtree', sans-serif",
                                fontSize: { md: "1.02rem", lg: "1.12rem", xl: "1.3rem", xxl: "1.85rem", xxxl: "2.5rem" },
                                lineHeight: 1.7,
                                maxWidth: "70ch",
                                mb: { md: 2.2, xl: 2.6, xxl: 3.2, xxxl: 4.2 },
                              }}
                            >
                              {t(scene.bodyKey, {
                                defaultValue: `Placeholder body text for Scene ${scene.id}. This is where the case study content goes.`,
                              })}
                            </Typography>

                            <Typography
                              sx={{
                                fontFamily: "'Figtree', sans-serif",
                                fontWeight: 600,
                                fontSize: { md: "0.9rem", lg: "0.98rem", xl: "1.12rem", xxl: "1.55rem", xxxl: "2.2rem" },
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              {String(index + 1).padStart(2, "0")} / {String(TOTAL_SCENES).padStart(2, "0")}
                            </Typography>
                          </Box>

                          <SceneImage alt={t(scene.titleKey, { defaultValue: `Scene ${scene.id}` })} />
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Container>
            </Box>
          ))}
        </motion.div>
      </Box>

      {/* Dot navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { md: 1, xl: 1.5 },
          pb: { md: 2.5, xl: 3, xxl: 4 },
          pt: { md: 1, xl: 1.5 },
          flexShrink: 0,
        }}
      >
        {SCENES.map((_, i) => (
          <Box
            key={i}
            onClick={() => {
              if (isTransitioning) return;
              slideAccum.current = 0;
              exitAccum.current = 0;
              entryAccum.current = 0;
              goTo(i);
            }}
            sx={{
              width: { md: 8, xl: 10, xxl: 14 },
              height: { md: 8, xl: 10, xxl: 14 },
              borderRadius: "50%",
              bgcolor: i === activeIndex ? "#000000" : "rgba(0,0,0,0.2)",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              "&:hover": { bgcolor: i === activeIndex ? "#000000" : "rgba(0,0,0,0.5)" },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

// ─── Mobile ───────────────────────────────────────────────────────────────────

function MobileCaseStudy() {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: "#FFFFFF", color: "#000000", width: "100%", overflowX: "hidden" }}>
      {SCENES.map((scene, index) => (
        <Box
          key={scene.id}
          sx={{
            minHeight: index === 0 ? `calc(100svh - ${MOBILE_NAVBAR_OFFSET})` : "100svh",
            pt: index === 0 ? MOBILE_NAVBAR_OFFSET : 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <HeaderBar currentIndex={index} total={TOTAL_SCENES} />

          <Box
            sx={{
              flex: 1,
              px: { xs: 2, sm: 3 },
              pt: { xs: 3, sm: 3.5 },
              pb: { xs: 4, sm: 5 },
              display: "flex",
              alignItems: "center",
            }}
          >
            <Container maxWidth={false} sx={{ px: "0 !important", maxWidth: "100% !important", width: "100%" }}>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <Box sx={{ borderTop: "2px solid #000000", borderBottom: "2px solid #000000", py: { xs: 3, sm: 3.5 } }}>
                  <Typography
                    sx={{
                      fontFamily: "'Stack Sans Headline', sans-serif",
                      fontWeight: 700,
                      fontSize: { xs: "1.9rem", sm: "2.4rem" },
                      lineHeight: 1.1,
                      mb: 1.5,
                    }}
                  >
                    {t(scene.titleKey, { defaultValue: `Scene ${scene.id}` })}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      lineHeight: 1.65,
                      mb: 2.5,
                      maxWidth: "72ch",
                    }}
                  >
                    {t(scene.bodyKey, {
                      defaultValue: `Placeholder body text for Scene ${scene.id}. This is where the case study content goes.`,
                    })}
                  </Typography>

                  <SceneImage alt={t(scene.titleKey, { defaultValue: `Scene ${scene.id}` })} />

                  <Typography
                    sx={{
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 600,
                      fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      mt: 1.5,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")} / {String(TOTAL_SCENES).padStart(2, "0")}
                  </Typography>
                </Box>
              </motion.div>
            </Container>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function ClujCaseStudy() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        position: "relative",
        zIndex: 0,
        isolation: "isolate",
        bgcolor: "#FFFFFF",
      }}
    >
      {isMobile ? <MobileCaseStudy /> : <DesktopCaseStudy />}
    </Box>
  );
}

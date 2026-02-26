import { useEffect, useMemo, useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import BrandPillarContent from "../components/docs/BrandPillarContent";
import CertificatesGallery from "../components/docs/CertificatesGallery";
import DocumentsPillarContent from "../components/docs/DocumentsPillarContent";
import DocsPillar from "../components/docs/DocsPillar";

type PillarId = "blue" | "gray" | "red";

type PillarConfig = {
  id: PillarId;
  title: string;
  collapsedLabel: string;
  backgroundColor: string;
  textColor: string;
};

const PILLARS: PillarConfig[] = [
  {
    id: "blue",
    title: "Core Certifications",
    collapsedLabel: "Core Certifications",
    backgroundColor: "#0000FF",
    textColor: "#FFFFFF",
  },
  {
    id: "gray",
    title: "Documents, Agreements, Approvals, Authorizations",
    collapsedLabel: "Documents, Agreements, Approvals, Authorizations",
    backgroundColor: "#8E8E8E",
    textColor: "#FFFFFF",
  },
  {
    id: "red",
    title: "Brochures and Brand Assets",
    collapsedLabel: "Brochures and Brand Assets",
    backgroundColor: "#ED1C24",
    textColor: "#FFFFFF",
  },
];

const MOBILE_STACK_ORDER: PillarId[] = ["blue", "gray", "red"];
const MOVE_DURATION_MS = 320;
const EXPAND_DURATION_MS = 560;
const CONTENT_FADE_DELAY_MS = 1000;
const PILLAR_TEXT_RESTORE_DELAY_MS = 1600;

function renderPillarContent(id: PillarId) {
  if (id === "blue") return <CertificatesGallery />;
  if (id === "gray") return <DocumentsPillarContent />;
  return <BrandPillarContent />;
}

export default function Docs() {
  const [searchParams] = useSearchParams();
  const [activePillar, setActivePillar] = useState<PillarId>("blue");
  const [desktopOrder, setDesktopOrder] = useState<PillarId[]>(["blue", "gray", "red"]);
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "moving" | "expanding">("idle");
  const [showActiveContent, setShowActiveContent] = useState<boolean>(true);
  const [showPillarTexts, setShowPillarTexts] = useState<boolean>(true);
  const transitionTimersRef = useRef<number[]>([]);
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const isUnder1000 = useMediaQuery("(max-width:1000px)");

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  const orderedPillars = useMemo(
    () =>
      desktopOrder
        .map((pillarId) => PILLARS.find((pillar) => pillar.id === pillarId))
        .filter((pillar): pillar is PillarConfig => Boolean(pillar)),
    [desktopOrder]
  );

  const clearTransitionTimers = () => {
    transitionTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    transitionTimersRef.current = [];
  };

  const startTextAndContentRevealTimers = () => {
    const contentTimer = window.setTimeout(() => {
      setShowActiveContent(true);
    }, CONTENT_FADE_DELAY_MS);
    const textTimer = window.setTimeout(() => {
      setShowPillarTexts(true);
    }, PILLAR_TEXT_RESTORE_DELAY_MS);
    transitionTimersRef.current.push(contentTimer);
    transitionTimersRef.current.push(textTimer);
  };

  const handleDesktopActivate = (pillarId: PillarId) => {
    if (pillarId === activePillar) return;

    clearTransitionTimers();
    setTransitionPhase("moving");
    setShowActiveContent(false);
    setShowPillarTexts(false);
    setDesktopOrder((currentOrder) => [pillarId, ...currentOrder.filter((id) => id !== pillarId)]);
    setActivePillar(pillarId);

    const moveTimer = window.setTimeout(() => {
      setTransitionPhase("expanding");
      const expandTimer = window.setTimeout(() => {
        setTransitionPhase("idle");
      }, EXPAND_DURATION_MS);
      transitionTimersRef.current.push(expandTimer);
      startTextAndContentRevealTimers();
    }, MOVE_DURATION_MS);

    transitionTimersRef.current.push(moveTimer);
  };

  const handleMobileActivate = (pillarId: PillarId) => {
    if (pillarId === activePillar) return;

    clearTransitionTimers();
    setShowActiveContent(false);
    setShowPillarTexts(false);
    setActivePillar(pillarId);
    startTextAndContentRevealTimers();
  };

  useEffect(() => {
    const pillarParam = searchParams.get("pillar")?.toLowerCase();
    if (pillarParam !== "brand") return;

    clearTransitionTimers();
    setTransitionPhase("idle");
    setShowActiveContent(true);
    setShowPillarTexts(true);
    setActivePillar("red");
    setDesktopOrder((currentOrder) => ["red", ...currentOrder.filter((id) => id !== "red")]);
  }, [searchParams]);

  const desktopColumns =
    transitionPhase === "moving"
      ? "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)"
      : "minmax(0, 8fr) minmax(0, 1fr) minmax(0, 1fr)";

  if (!isTabletAndUp) {
    return (
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          color: "#000000",
          borderTop: "1px solid #d9d9d9",
          pt: isUnder1000 ? "5rem" : 0,
          pb: { xs: 0.75, sm: 1 },
          "& .MuiTypography-root, & a, & li, & span": {
            opacity: showPillarTexts ? 1 : 0,
            transition: "opacity 0.35s linear",
          },
        }}
      >
        {MOBILE_STACK_ORDER.map((pillarId) => {
          const pillar = PILLARS.find((entry) => entry.id === pillarId);
          if (!pillar) return null;
          const isActive = activePillar === pillar.id;

          return (
            <motion.div
              key={pillar.id}
              layout
              initial={false}
              animate={{ height: isActive ? "auto" : "4.9rem" }}
              transition={{ duration: 0.4, ease: "linear" }}
              style={{
                overflow: "hidden",
                marginBottom: "0.45rem",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.35)",
              }}
            >
              <DocsPillar
                isActive={isActive}
                title={pillar.title}
                collapsedLabel={pillar.collapsedLabel}
                backgroundColor={pillar.backgroundColor}
                textColor={pillar.textColor}
                onActivate={() => handleMobileActivate(pillar.id)}
                showActiveContent={!isActive || showActiveContent}
              >
                {renderPillarContent(pillar.id)}
              </DocsPillar>
            </motion.div>
          );
        })}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        color: "#000000",
        borderTop: "1px solid #d9d9d9",
        pt: isUnder1000 ? "5rem" : 0,
        "& .MuiTypography-root, & a, & li, & span": {
          opacity: showPillarTexts ? 1 : 0,
          transition: "opacity 0.35s linear",
        },
      }}
    >
      <motion.div
        initial={false}
        animate={{ gridTemplateColumns: desktopColumns }}
        transition={{
          duration: transitionPhase === "moving" ? MOVE_DURATION_MS / 1000 : EXPAND_DURATION_MS / 1000,
          ease: "linear",
        }}
        style={{
          width: "100%",
          height: isUnder1000 ? "calc(100dvh - 11rem)" : "calc(100dvh - 6rem)",
          minHeight: "34rem",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: desktopColumns,
          alignItems: "stretch",
        }}
      >
        {orderedPillars.map((pillar, index) => {
          const isActive = pillar.id === activePillar;

          return (
            <motion.div
              key={pillar.id}
              layout
              initial={false}
              style={{
                minWidth: 0,
                overflow: "hidden",
                boxShadow: index === 0 ? "none" : "inset 1px 0 0 rgba(255, 255, 255, 0.35)",
              }}
            >
              <DocsPillar
                isActive={isActive}
                title={pillar.title}
                collapsedLabel={pillar.collapsedLabel}
                backgroundColor={pillar.backgroundColor}
                textColor={pillar.textColor}
                onActivate={() => handleDesktopActivate(pillar.id)}
                showActiveContent={!isActive || showActiveContent}
              >
                {renderPillarContent(pillar.id)}
              </DocsPillar>
            </motion.div>
          );
        })}
      </motion.div>
    </Box>
  );
}

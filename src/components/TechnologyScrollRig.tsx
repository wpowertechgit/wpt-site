import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Fade, ThemeProvider, Typography, createTheme, useMediaQuery } from "@mui/material";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ScrollControls, useScroll } from "@react-three/drei";
import { motion } from "framer-motion";
import { easing } from "maath";
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";
import * as THREE from "three";
import { useTranslation } from "react-i18next";
import AssemblyCompressedModel from "./AssemblyCompressedModel";

type Vec3Tuple = [number, number, number];

type SectionPose = {
  position: Vec3Tuple;
  rotation: Vec3Tuple;
  title: string;
  body: string;
  titleKey: string;
  bodyKey: string;
};

type ViewportSize = {
  width: number;
  height: number;
};

type PoseData = Pick<SectionPose, "position" | "rotation">;

type PoseAnchor = {
  width: number;
  poses: SectionPose[];
};

type FovAnchor = {
  width: number;
  fov: number;
};

const FALLBACK_SECTION_COUNT = 9;

function getFallbackImageSources(isPhone: boolean) {
  const imagePrefix = isPhone ? "/fallbackMobile/tech-phone" : "/fallbackDesktop/tech-desktop";
  return Array.from({ length: FALLBACK_SECTION_COUNT }, (_, index) => `${imagePrefix}-${index + 1}.png`);
}

const OVERLAY_THEME = createTheme({
  typography: {
    fontFamily: "Figtree, sans-serif",
    h4: {
      fontFamily: "Stack Sans Headline, sans-serif",
      fontWeight: 700,
    },
  },
  shape: { borderRadius: 0 },
});

const BASE_SECTION_POSES: SectionPose[] = [
  {
    position: [-4.448, 5.032, 2.384],
    rotation: [-0.58, -0.75, -0.42],
    title: "Primary Shredder",
    body: "Waste enters through the primary shredder for initial size reduction.",
    titleKey: "tech-scroll-1-title",
    bodyKey: "tech-scroll-1-body",
  },
  {
    position: [3.031, 1.023, 2.305],
    rotation: [-0.117, -0.947, -0.095],
    title: "Secondary Shredder",
    body: "Secondary shredding reduces mixed waste to controlled feed size.",
    titleKey: "tech-scroll-2-title",
    bodyKey: "tech-scroll-2-body",
  },
  {
    position: [14.735, 24.277, 0.817],
    rotation: [-1.571, 0, 0.008],
    title: "Temporary Storage for Shredded Material",
    body: "Processed material is buffered before thermal processing.",
    titleKey: "tech-scroll-3-title",
    bodyKey: "tech-scroll-3-body",
  },
  {
    position: [24.811, 5.432, 10.78],
    rotation: [-0.526, 0.028, 0.016],
    title: "Feed System",
    body: "Automated feed controls maintain stable reactor input flow.",
    titleKey: "tech-scroll-4-title",
    bodyKey: "tech-scroll-4-body",
  },
  {
    position: [
      13.924,
      2.671,
      -4.548
    ],
    rotation: [
      -1.469,
      -1.302,
      -1.465
    ],
    title: "Pyrolysis Reactor",
    body: "Material undergoes high-temperature molecular disintegration without oxygen.",
    titleKey: "tech-scroll-5-title",
    bodyKey: "tech-scroll-5-body",
  },
  {
    position: [
      16.275,
      3.174,
      -5.178
    ],
    rotation: [
      -0.84,
      -0.533,
      -0.516
    ],
    title: "Solid Byproduct (Char / Carbon Residue)",
    body: "Carbon-rich residue is extracted for secondary industrial use.",
    titleKey: "tech-scroll-6-title",
    bodyKey: "tech-scroll-6-body",
  },
  {
    position: [
      32.632,
      1.182,
      -12.794
    ],
    rotation: [
      -3.001,
      0.752,
      3.045
    ],
    title: "Gas Filtration and Conditioning",
    body: "Gas is filtered and conditioned into cleaner synthesis gas.",
    titleKey: "tech-scroll-7-title",
    bodyKey: "tech-scroll-7-body",
  },
  {
    position: [11.688, 5.643, 19.137],
    rotation: [-0.595, -0.772, -0.441],
    title: "Gas Storage Tanks",
    body: "Conditioned gas is stored in pressurized tanks for flow regulation.",
    titleKey: "tech-scroll-8-title",
    bodyKey: "tech-scroll-8-body",
  },
  {
    position: [-15.303, 7.76, -1.068],
    rotation: [-1.573, 1.077, 1.574],
    title: "Power Generation",
    body: "Conditioned syngas drives generator units for electrical output.",
    titleKey: "tech-scroll-9-title",
    bodyKey: "tech-scroll-9-body",
  },
];

const REFERENCE_VIEWPORT: ViewportSize = { width: 1920, height: 1200 };

const TABLET_POSE_DATA: PoseData[] = [
  { position: [-2.93, 4.93, 1.179], rotation: [-0.665, -0.686, -0.46] },
  { position: [5.369, 0.482, 2.732], rotation: [-0.089, -0.805, -0.064] },
  { position: [16.386, 20.722, 1.075], rotation: [-1.571, 0, 0.006] },
  { position: [25.581, 5.535, 10.334], rotation: [-0.427, 0.008, 0.004] },
  { position: [14.828, 1.555, -5.121], rotation: [-1.376, -1.416, -1.374] },
  { position: [18.252, 0.807, -7.145], rotation: [-0.439, -0.639, -0.273] },
  { position: [37.631, 1.643, -13.292], rotation: [-3.043, 0.74, 3.075] },
  { position: [11.748, 6.042, 25.447], rotation: [-0.159, -0.687, -0.101] },
  { position: [-8.222, 10.586, -3.124], rotation: [-1.47, 1.279, 1.466] },
];

const PHONE_POSE_DATA: PoseData[] = [
  { position: [-1.443, 6.144, 2.881], rotation: [-0.551, -0.543, -0.307] },
  { position: [3.308, 4.045, 2.675], rotation: [-0.521, -0.828, -0.4] },
  { position: [15.681, 19.642, 3.468], rotation: [-1.571, 0, 0.025] },
  { position: [24.912, 6.755, 17.095], rotation: [-0.331, -0.017, -0.006] },
  { position: [6.424, 2.213, -3.617], rotation: [-1.018, -1.463, -1.016] },
  { position: [17.464, 1.763, -6.643], rotation: [-0.57, -0.75, -0.412] },
  { position: [38.343, 2.926, -13.199], rotation: [-2.92, 0.842, 2.975] },
  { position: [9.365, 8.947, 27.088], rotation: [-0.178, -0.695, -0.114] },
  { position: [-8.247, 8.488, -0.372], rotation: [-1.46, 1.476, 1.46] },
];

function buildAnchoredSectionPoses(data: PoseData[]) {
  return BASE_SECTION_POSES.map((base, index) => ({
    ...base,
    position: data[index].position,
    rotation: data[index].rotation,
  }));
}

const TABLET_SECTION_POSES = buildAnchoredSectionPoses(TABLET_POSE_DATA);
const PHONE_SECTION_POSES = buildAnchoredSectionPoses(PHONE_POSE_DATA);

const POSE_ANCHORS: PoseAnchor[] = [
  { width: 430, poses: PHONE_SECTION_POSES },
  { width: 768, poses: TABLET_SECTION_POSES },
  { width: REFERENCE_VIEWPORT.width, poses: BASE_SECTION_POSES },
];

const FOV_ANCHORS: FovAnchor[] = [
  { width: 430, fov: 56 },
  { width: 768, fov: 52 },
  { width: REFERENCE_VIEWPORT.width, fov: 42 },
];

function getCurrentViewport(): ViewportSize {
  if (typeof window === "undefined") return REFERENCE_VIEWPORT;
  const vv = window.visualViewport;
  if (vv) return { width: vv.width, height: vv.height };
  return { width: window.innerWidth, height: window.innerHeight };
}

function clonePose(pose: SectionPose): SectionPose {
  return {
    ...pose,
    position: [...pose.position] as Vec3Tuple,
    rotation: [...pose.rotation] as Vec3Tuple,
  };
}

function getClosestPoseAnchor(width: number) {
  return POSE_ANCHORS.reduce((closest, current) =>
    Math.abs(current.width - width) < Math.abs(closest.width - width) ? current : closest,
  );
}

function getClosestFov(width: number) {
  return FOV_ANCHORS.reduce((closest, current) =>
    Math.abs(current.width - width) < Math.abs(closest.width - width) ? current : closest,
  ).fov;
}

function getSectionPosesForClosestAnchor(width: number): SectionPose[] {
  return getClosestPoseAnchor(width).poses.map(clonePose);
}

function sectionOverlayPosition(section: number) {
  if (section === 0) return { left: { xs: 16, md: "3vw" }, top: "50%", transform: "translateY(-50%)" };
  if (section === 1 || section === 2 || section === 4 || section === 5 || section === 6 || section === 7) {
    return { right: { xs: 16, md: "3vw" }, top: "50%", transform: "translateY(-50%)" };
  }
  if (section === 3) return { left: { xs: 16, md: "3vw" }, bottom: { xs: 20, md: "10%" } };
  return { left: { xs: 16, md: "3vw" }, top: "50%", transform: "translateY(-50%)" };
}

function getSectionProgress(scrollOffset: number, sectionCount: number) {
  const scaled = THREE.MathUtils.clamp(scrollOffset, 0, 0.999999) * sectionCount;
  const section = Math.floor(scaled);
  const nextSection = Math.min(section + 1, sectionCount - 1);
  const t = scaled - section;
  return { section, nextSection, t };
}

function lerpPose(a: SectionPose, b: SectionPose, t: number) {
  return {
    position: [
      THREE.MathUtils.lerp(a.position[0], b.position[0], t),
      THREE.MathUtils.lerp(a.position[1], b.position[1], t),
      THREE.MathUtils.lerp(a.position[2], b.position[2], t),
    ] as Vec3Tuple,
    rotation: [
      THREE.MathUtils.lerp(a.rotation[0], b.rotation[0], t),
      THREE.MathUtils.lerp(a.rotation[1], b.rotation[1], t),
      THREE.MathUtils.lerp(a.rotation[2], b.rotation[2], t),
    ] as Vec3Tuple,
  };
}

// ─── FIX: Trackpad / wheel delta normalisation ───────────────────────────────
// Returns a normalised "scroll intent" in [-1, +1] range regardless of whether
// the event comes from a traditional mouse wheel (large deltaY steps) or a
// trackpad (small fractional steps that fire in rapid bursts).
function classifyWheelDelta(deltaY: number): { isMouse: boolean; sign: number } {
  const sign = deltaY > 0 ? 1 : -1;
  const isMouse = Math.abs(deltaY) >= 60;
  return { isMouse, sign };
}

// Mobile only: one page per section so scroll offset maps 1:1 with sections.
// Desktop bypasses ScrollControls entirely — sections are driven by the wheel handler.
const MOBILE_SCROLL_PAGES = 9;

function Scene({
  sectionPoses,
  activeSection,
  onSectionChange,
  modelScale,
  isMobile,
  levelHorizon,
  onScrollOffsetRef,
}: {
  sectionPoses: SectionPose[];
  activeSection: number;
  onSectionChange: (section: number) => void;
  modelScale: number;
  isMobile: boolean;
  levelHorizon: boolean;
  isTrackpad: boolean;
  onScrollOffsetRef?: React.MutableRefObject<number>;
}) {
  // Desktop: scroll is not used (no ScrollControls context).
  // isMobile path uses scroll offset via MobileScrollDriver callback instead.
  const sectionRef = useRef(-1);
  const lastOffsetRef = useRef(0);
  const mobileScrollOffsetRef = useRef(0);
  // FIX: use a dedicated "camera initialised" flag so we always snap on first frame
  const cameraInitialisedRef = useRef(false);
  const scrollAccumulatorRef = useRef(0);
  const cooldownRef = useRef(0);
  const targetEulerRef = useRef(new THREE.Euler());
  const targetQuatRef = useRef(new THREE.Quaternion());
  const targetPosRef = useRef(new THREE.Vector3());
  const lookFromRef = useRef(new THREE.Vector3());
  const lookDirRef = useRef(new THREE.Vector3());
  const lookAtRef = useRef(new THREE.Vector3());
  const lookMatrixRef = useRef(new THREE.Matrix4());

  // FIX: reset everything (including camera) whenever sectionPoses changes
  useEffect(() => {
    cameraInitialisedRef.current = false;
    sectionRef.current = -1;
    lastOffsetRef.current = 0;
    mobileScrollOffsetRef.current = 0;
    scrollAccumulatorRef.current = 0;
    cooldownRef.current = 0;
    onSectionChange(0);
  }, [onSectionChange, sectionPoses]);



  useFrame((state, delta) => {
    const setTargetQuaternion = (rotation: Vec3Tuple, cameraPosition: Vec3Tuple) => {
      targetEulerRef.current.set(...rotation);

      if (!levelHorizon) {
        targetQuatRef.current.setFromEuler(targetEulerRef.current);
        return;
      }

      lookFromRef.current.set(...cameraPosition);
      lookDirRef.current.set(0, 0, -1).applyEuler(targetEulerRef.current).normalize();
      lookAtRef.current.copy(lookFromRef.current).add(lookDirRef.current);
      lookMatrixRef.current.lookAt(lookFromRef.current, lookAtRef.current, state.camera.up);
      targetQuatRef.current.setFromRotationMatrix(lookMatrixRef.current);
    };

    // FIX: On first frame, hard-snap camera to section 0 and reset scroll to top.
    // We do this imperatively so it is guaranteed to fire regardless of React
    // render timing or how the Canvas was mounted.
    if (!cameraInitialisedRef.current) {
      const firstPose = sectionPoses[0];

      state.camera.position.set(...firstPose.position);
      setTargetQuaternion(firstPose.rotation, firstPose.position);
      state.camera.quaternion.copy(targetQuatRef.current);

      sectionRef.current = 0;
      lastOffsetRef.current = 0;
      scrollAccumulatorRef.current = 0;
      cooldownRef.current = 0;
      onSectionChange(0);

      cameraInitialisedRef.current = true;
      return;
    }

    // ── Mobile / small-screen: lerp through sections based on scroll offset ──
    if (isMobile) {
      const offset = onScrollOffsetRef ? onScrollOffsetRef.current : mobileScrollOffsetRef.current;
      const { section, nextSection, t } = getSectionProgress(offset, sectionPoses.length);
      const targetPose = lerpPose(sectionPoses[section], sectionPoses[nextSection], t);

      easing.damp3(state.camera.position, targetPose.position, 0.28, delta);

      setTargetQuaternion(targetPose.rotation, targetPose.position);
      state.camera.quaternion.slerp(targetQuatRef.current, 1 - Math.exp(-9 * delta));

      if (sectionRef.current !== section) {
        sectionRef.current = section;
        onSectionChange(section);
      }
      return;
    }

    // ── Desktop: section is driven entirely by the native wheel handler above.
    // useFrame just animates the camera toward the current activeSection pose.
    const currentPose = sectionPoses[activeSection];
    const speed = activeSection === 7 ? 0.62 : 0.28;

    targetPosRef.current.set(...currentPose.position);
    easing.damp3(state.camera.position, currentPose.position, speed, delta);

    setTargetQuaternion(currentPose.rotation, currentPose.position);
    state.camera.quaternion.slerp(targetQuatRef.current, 1 - Math.exp(-9 * delta));

    if (state.camera.position.distanceTo(targetPosRef.current) < 0.002) {
      state.camera.position.copy(targetPosRef.current);
    }
    if (state.camera.quaternion.angleTo(targetQuatRef.current) < 0.002) {
      state.camera.quaternion.copy(targetQuatRef.current);
    }
  });

  return (
    <>
      <ambientLight intensity={0.44} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} />

      <group scale={modelScale}>
        <Center>
          <Suspense
            fallback={
              <mesh position={[0, 1, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="#8E8E8E" wireframe />
              </mesh>
            }
          >
            <AssemblyCompressedModel />
          </Suspense>
        </Center>
      </group>
    </>
  );
}

// Thin component that lives inside ScrollControls and syncs scroll.offset into a ref.
function MobileScrollDriver({
  offsetRef,
  scrollElementRef,
}: {
  offsetRef: React.MutableRefObject<number>;
  scrollElementRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const scroll = useScroll();
  useFrame(() => {
    offsetRef.current = scroll.offset;
    const state = scroll as unknown as { el?: HTMLDivElement };
    if (state.el) {
      scrollElementRef.current = state.el;
    }
  });
  return null;
}

function Overlay({
  activePose,
  activeSection,
  isMobile,
  showScrollHint,
}: {
  activePose: SectionPose;
  activeSection: number;
  isMobile: boolean;
  showScrollHint: boolean;
}) {
  const { t } = useTranslation();
  const pos = sectionOverlayPosition(activeSection);
  const logoSrc = isMobile ? "/wpt-black-full-length-logo.svg" : "/wpt-black-compact-logo.svg";

  return (
    <ThemeProvider theme={OVERLAY_THEME}>
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Box
          sx={{
            position: "absolute",
            // FIX: tighter widths on small screens so the model stays visible
            width: isMobile
              ? { xs: "min(calc(100% - 24px), 340px)", sm: "min(calc(100% - 32px), 420px)" }
              : { xs: "calc(100% - 32px)", sm: 420, md: 500, lg: 580, xl: 640, xxl: 1260, xxxl: 1920 },
            maxWidth: isMobile ? { xs: "78vw", sm: "72vw" } : { xs: "90vw", xxl: "48vw", xxxl: "50vw" },
            px: isMobile
              ? { xs: 1.5, sm: 2 }
              : { xs: 2, md: 2.5, lg: 3, xxl: 6, xxxl: 8 },
            py: isMobile
              ? { xs: 1.25, sm: 1.75 }
              : { xs: 1.5, md: 2, lg: 2.5, xxl: 5, xxxl: 7 },
            bgcolor: "#ffffff",
            border: isMobile ? "none" : "1px solid #000000",
            boxShadow: isMobile ? "none" : "0 10px 26px rgba(0,0,0,0.08)",
            pointerEvents: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            ...(isMobile
              ? {
                // FIX: push the card below the safe area + navbar height (56-72px) with a
                // sensible cap so it never covers more than ~45% of screen height
                top: {
                  xs: "calc(env(safe-area-inset-top, 0px) + 60px)",
                  sm: "calc(env(safe-area-inset-top, 0px) + 68px)",
                  md: "calc(env(safe-area-inset-top, 0px) + 76px)",
                },
                left: { xs: 12, sm: 16 },
                right: "auto",
                transform: "none",
              }
              : pos),
            "@media (min-width:2560px)": {
              width: 960,
              maxWidth: "48vw",
            },
            "@media (min-width:3000px)": {
              width: 1260,
              maxWidth: "48vw",
            },
          }}
        >
          <Fade in key={activeSection} timeout={300}>
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "stretch" }}>
              <Box
                sx={{
                  flex: isMobile ? "none" : "0 0 46%",
                  width: isMobile ? { xs: "64%", sm: "56%" } : "46%",
                  pr: isMobile ? 0 : { xs: 2, xxl: 4, xxxl: 6 },
                  mb: isMobile ? 1 : 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box component="img" src={logoSrc} alt="Waste Power Tech" sx={{ width: "100%", height: "auto", display: "block" }} />
              </Box>
              <Box sx={{ flex: 1, pl: isMobile ? 0 : { xs: 2, xxl: 4, xxxl: 6 } }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Stack Sans Headline, sans-serif",
                    fontWeight: 700,
                    textAlign: "left",
                    // FIX: significantly reduced base font-sizes for small screens
                    fontSize: {
                      xs: "0.95rem",
                      sm: "1.1rem",
                      md: "1.8rem",
                      lg: "2.15rem",
                      xl: "2.4rem",
                      xxl: "3rem",
                      xxxl: "4rem",
                    },
                    "@media (min-width:2560px)": { fontSize: "4rem" },
                    lineHeight: 1.08,
                    letterSpacing: "-0.015em",
                    mb: { xs: 0.5, md: 0.85 },
                  }}
                >
                  {t(activePose.titleKey, { defaultValue: activePose.title })}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Figtree, sans-serif",
                    textAlign: "left",
                    fontWeight: 400,
                    // FIX: smaller body text on mobile
                    fontSize: {
                      xs: "0.76rem",
                      sm: "0.86rem",
                      md: "1.08rem",
                      lg: "1.2rem",
                      xl: "1.32rem",
                      xxl: "2.7rem",
                      xxxl: "2.7rem",
                    },
                    "@media (min-width:2560px)": { fontSize: "2rem" },
                    "@media (min-width:3840px)": { fontSize: "2.7rem" },
                    lineHeight: 1.45,
                    color: "rgba(0,0,0,0.82)",
                    maxWidth: "74ch",
                  }}
                >
                  {t(activePose.bodyKey, { defaultValue: activePose.body })}
                </Typography>
                <ScrollHintOverlay visible={showScrollHint} isMobile={isMobile} />
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function ScrollHintOverlay({
  visible,
  isMobile,
}: {
  visible: boolean;
  isMobile: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Fade in={visible} timeout={{ enter: 180, exit: 180 }} unmountOnExit>
      <Box
        sx={{
          mt: { xs: 1.25, sm: 1.5, md: 2, lg: 2.2, xl: 2.5, xxl: 2.8, xxxl: 3.4 },
          width: "fit-content",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.2, md: 1.5, lg: 1.7, xl: 1.9, xxl: 2.2, xxxl: 2.7 },
            px: { xs: 1.1, sm: 1.3, md: 1.7, lg: 1.9, xl: 2.2, xxl: 2.5, xxxl: 3 },
            py: { xs: 0.75, sm: 0.9, md: 1.15, lg: 1.3, xl: 1.45, xxl: 1.7, xxxl: 2.1 },
            bgcolor: "#ffffff",
            border: isMobile ? "none" : "1px solid #000000",
            boxShadow: isMobile ? "none" : "0 8px 18px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: 18, sm: 20, md: 26, lg: 30, xl: 34, xxl: 40, xxxl: 50 },
              height: { xs: 32, sm: 36, md: 48, lg: 56, xl: 64, xxl: 74, xxxl: 92 },
              flexShrink: 0,
              border: "1px solid #000000",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ y: [0, 14, 0], opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 0.9, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
              style={{
                position: "absolute",
                top: "12%",
                left: "18%",
                right: "18%",
                height: "22%",
                background: "#0000FF",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: "Figtree, sans-serif",
              fontSize: { xs: "0.72rem", sm: "0.82rem", md: "1rem", lg: "1.08rem", xl: "1.18rem", xxl: "2.8rem", xxxl: "3rem" },
              fontWeight: 500,
              lineHeight: 1.25,
              letterSpacing: "0.01em",
              color: "#000000",
              maxWidth: { xs: "18ch", sm: "22ch", md: "26ch", lg: "28ch", xl: "30ch" },
            }}
          >
            {t("tech-scroll-hint", { defaultValue: "Scroll to progress. Or use the -> and <- arrows" })}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}

// ─── Loading gate overlay ─────────────────────────────────────────────────────
function LoadingGate({
  isMobile,
  onStart,
}: {
  isMobile: boolean;
  onStart: () => void;
}) {
  const { t } = useTranslation();
  const bgImage = isMobile
    ? "/fallbackMobile/tech-phone-1.png"
    : "/fallbackDesktop/tech-desktop-1.png";

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: isMobile ? "flex-start" : "center",
      }}
    >
      {/* Background static image */}
      <Box
        component="img"
        src={bgImage}
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />

      {/* Intro card — same box styling as the explanation cards */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          ml: isMobile ? { xs: "12px", sm: "16px" } : 0,
          mt: isMobile
            ? {
              xs: "calc(env(safe-area-inset-top, 0px) + 60px)",
              sm: "calc(env(safe-area-inset-top, 0px) + 68px)",
            }
            : 0,
          alignSelf: isMobile ? "flex-start" : "center",
          width: isMobile
            ? { xs: "min(calc(100% - 24px), 340px)", sm: "min(calc(100% - 32px), 420px)" }
            : { sm: 460, md: 520, lg: 580 },
          maxWidth: isMobile ? "78vw" : "90vw",
          px: isMobile ? { xs: 1.5, sm: 2 } : { xs: 2, md: 3 },
          py: isMobile ? { xs: 1.5, sm: 2 } : { xs: 2, md: 3 },
          bgcolor: "#ffffff",
          border: "1px solid #000000",
          boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Stack Sans Headline, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "1.8rem" },
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            mb: { xs: 0.75, md: 1 },
          }}
        >
          {t("tech-gate-title", { defaultValue: "Explore Our 3D Process Model" })}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Figtree, sans-serif",
            fontWeight: 400,
            fontSize: { xs: "0.78rem", sm: "0.88rem", md: "1rem" },
            lineHeight: 1.45,
            color: "rgba(0,0,0,0.8)",
            mb: { xs: 1.25, md: 1.75 },
          }}
        >
          {t("tech-gate-body", {
            defaultValue:
              "Walk through each stage of our waste-to-energy solution in an interactive 3D environment. Scroll to move between sections.",
          })}
        </Typography>
        <Box
          component="button"
          onClick={onStart}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: { xs: 1.5, md: 2 },
            py: { xs: 0.75, md: 1 },
            bgcolor: "#000000",
            color: "#ffffff",
            border: "1px solid #000000",
            fontFamily: "Figtree, sans-serif",
            fontWeight: 600,
            fontSize: { xs: "0.82rem", sm: "0.9rem", md: "1rem" },
            cursor: "pointer",
            letterSpacing: "0.01em",
          }}
        >
          {t("tech-gate-cta", { defaultValue: "Start Interactive Tour" })}
          <Box component="span" sx={{ fontSize: "1.1em", lineHeight: 1 }}>→</Box>
        </Box>
      </Box>
    </Box>
  );
}

function supportsTechnologyRig() {
  if (typeof window === "undefined") return true;
  if (typeof document === "undefined") return true;
  const canvas = document.createElement("canvas");
  const hasWebGL =
    !!window.WebGLRenderingContext &&
    (!!canvas.getContext("webgl") || !!canvas.getContext("experimental-webgl"));
  return hasWebGL;
}

function TechnologyFallbackSequence() {
  const isMobile = useMediaQuery("(max-width:767px)");
  const images = useMemo(() => getFallbackImageSources(isMobile), [isMobile]);

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#ffffff",
        borderTop: "1px solid #d9d9d9",
        borderBottom: "1px solid #d9d9d9",
      }}
    >
      {images.map((src, index) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt={`Technology process section ${index + 1}`}
          loading={index === 0 ? "eager" : "lazy"}
          sx={{
            display: "block",
            width: "100%",
            height: "auto",
            borderBottom: index < images.length - 1 ? "1px solid #d9d9d9" : "none",
          }}
        />
      ))}
    </Box>
  );
}

function RigVisibilityHelp({
  onOpenGallery,
  onPrevSection,
  onNextSection,
  canPrev,
  canNext,
}: {
  onOpenGallery: () => void;
  onPrevSection: () => void;
  onNextSection: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  const { t } = useTranslation();
  const [isQuestionHovering, setIsQuestionHovering] = useState(false);
  const [isQuestionFocused, setIsQuestionFocused] = useState(false);
  const [isPromptHovering, setIsPromptHovering] = useState(false);
  const showPrompt = isQuestionHovering || isQuestionFocused || isPromptHovering;

  return (
    <Box
      sx={{
        position: "absolute",
        left: { xs: 12, sm: 16, md: 20 },
        bottom: { xs: 12, sm: 16, md: 20 },
        zIndex: 35,
        display: "flex",
        alignItems: "flex-end",
        gap: 1.1,
        pointerEvents: "auto",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          gap: { xs: 0.8, md: 0.8 },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            order: { xs: 1, md: 2 },
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={onPrevSection}
            disabled={!canPrev}
            aria-label="Previous section"
            sx={{
              width: { xs: 64, sm: 72, md: 58 },
              height: { xs: 64, sm: 72, md: 58 },
              border: "2px solid #000000",
              bgcolor: "#000000",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0,
              cursor: canPrev ? "pointer" : "not-allowed",
              borderRadius: 0,
              opacity: canPrev ? 1 : 0.35,
              "& svg": {
                width: { xs: 34, sm: 38, md: 32 },
                height: "auto",
              },
            }}
          >
            <MdOutlineArrowBackIosNew />
          </Box>

          <Box
            component="button"
            type="button"
            onClick={onNextSection}
            disabled={!canNext}
            aria-label="Next section"
            sx={{
              width: { xs: 64, sm: 72, md: 58 },
              height: { xs: 64, sm: 72, md: 58 },
              border: "2px solid #000000",
              bgcolor: "#000000",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0,
              cursor: canNext ? "pointer" : "not-allowed",
              borderRadius: 0,
              opacity: canNext ? 1 : 0.35,
              "& svg": {
                width: { xs: 34, sm: 38, md: 32 },
                height: "auto",
              },
            }}
          >
            <MdOutlineArrowForwardIos />
          </Box>
        </Box>

        <Box
          component="button"
          type="button"
          aria-label={t("tech-rig-help-label", { defaultValue: "Model visibility help" })}
          onClick={onOpenGallery}
          onMouseEnter={() => setIsQuestionHovering(true)}
          onMouseLeave={() => setIsQuestionHovering(false)}
          onFocus={() => setIsQuestionFocused(true)}
          onBlur={() => setIsQuestionFocused(false)}
          sx={{
            width: { xs: 36, sm: 40, md: 42 },
            height: { xs: 36, sm: 40, md: 42 },
            border: "1px solid #000000",
            bgcolor: "#000000",
            color: "#ffffff",
            fontFamily: "Stack Sans Headline, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "1.05rem", sm: "1.1rem", md: "1.2rem" },
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            p: 0,
            cursor: "pointer",
            borderRadius: 0,
            order: { xs: 2, md: 1 },
            "&:focus-visible": {
              outline: "2px solid #0000FF",
              outlineOffset: 2,
            },
          }}
        >
          ?
        </Box>
      </Box>

      <Fade in={showPrompt} timeout={{ enter: 140, exit: 140 }} unmountOnExit>
        <Box
          onMouseEnter={() => setIsPromptHovering(true)}
          onMouseLeave={() => setIsPromptHovering(false)}
          sx={{
            maxWidth: { xs: "30ch", sm: "34ch", md: "38ch" },
            bgcolor: "#ffffff",
            border: "1px solid #000000",
            px: { xs: 1, sm: 1.2, md: 1.4 },
            py: { xs: 0.9, sm: 1, md: 1.15 },
            boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Figtree, sans-serif",
              fontWeight: 500,
              fontSize: { xs: "0.78rem", sm: "0.82rem", md: "0.9rem" },
              lineHeight: 1.3,
              color: "#000000",
              mb: 0.8,
            }}
          >
            {t("tech-rig-help-prompt", { defaultValue: "Model not visible?" })}
          </Typography>
          <Box
            component="button"
            type="button"
            onClick={onOpenGallery}
            sx={{
              border: "1px solid #000000",
              bgcolor: "#000000",
              color: "#ffffff",
              fontFamily: "Figtree, sans-serif",
              fontWeight: 600,
              fontSize: { xs: "0.74rem", sm: "0.78rem", md: "0.86rem" },
              letterSpacing: "0.01em",
              px: { xs: 1, sm: 1.2, md: 1.4 },
              py: { xs: 0.45, sm: 0.5, md: 0.6 },
              borderRadius: 0,
              cursor: "pointer",
            }}
          >
            {t("tech-rig-help-open-gallery", { defaultValue: "Open image gallery" })}
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

function RigFallbackGallery({
  open,
  onClose,
  isPhone,
}: {
  open: boolean;
  onClose: () => void;
  isPhone: boolean;
}) {
  const { t } = useTranslation();
  const images = useMemo(() => getFallbackImageSources(isPhone), [isPhone]);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = images.length - 1;
  const atFirst = activeIndex <= 0;
  const atLast = activeIndex >= lastIndex;

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
  }, [open, isPhone]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, lastIndex));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, lastIndex]);

  return (
    <Fade in={open} timeout={{ enter: 160, exit: 160 }} unmountOnExit>
      <Box
        role="dialog"
        aria-modal="true"
        aria-label={t("tech-rig-gallery-dialog-label", {
          defaultValue: "Technology fallback image gallery",
        })}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1400,
          bgcolor: "rgba(255,255,255,0.97)",
          borderTop: "1px solid #000000",
        }}
      >
        <Box
          sx={{
            height: "100%",
            overflowY: "auto",
            px: { xs: 1.2, sm: 1.8, md: 2.5 },
            py: { xs: 1.2, sm: 1.4, md: 1.8 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5, mb: 1.2 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: "Stack Sans Headline, sans-serif",
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.015em",
                }}
              >
                {t("tech-rig-gallery-title", { defaultValue: "Technology Image Sequence" })}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  fontWeight: 400,
                  fontSize: { xs: "0.75rem", sm: "0.82rem", md: "0.9rem" },
                  color: "rgba(0,0,0,0.78)",
                  lineHeight: 1.35,
                  mt: 0.45,
                }}
              >
                {t("tech-rig-gallery-description", {
                  defaultValue: "If 3D is not visible, use these static section images.",
                })}
              </Typography>
            </Box>
            <Box
              component="button"
              type="button"
              onClick={onClose}
              sx={{
                border: "1px solid #000000",
                bgcolor: "#000000",
                color: "#ffffff",
                px: { xs: 0.95, sm: 1.1, md: 1.25 },
                py: { xs: 0.5, sm: 0.55, md: 0.6 },
                fontFamily: "Figtree, sans-serif",
                fontWeight: 600,
                fontSize: { xs: "0.74rem", sm: "0.78rem", md: "0.86rem" },
                letterSpacing: "0.01em",
                borderRadius: 0,
                cursor: "pointer",
              }}
            >
              {t("tech-rig-gallery-close", { defaultValue: "Close gallery" })}
            </Box>
          </Box>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "100%", md: "92vw", xl: "86vw" },
              mx: "auto",
              border: "1px solid #000000",
              bgcolor: "#ffffff",
              p: { xs: 0.6, sm: 0.8, md: 1 },
              pb: { xs: 1.2, sm: 1.5, md: 2.2 },
            }}
          >
            <Box
              component="img"
              src={images[activeIndex]}
              alt={t("tech-rig-gallery-image-alt", {
                defaultValue: "Technology process fallback section {{index}}",
                index: activeIndex + 1,
              })}
              loading="eager"
              sx={{
                display: "block",
                width: "100%",
                height: "auto",
                maxHeight: { xs: "72vh", md: "76vh" },
                objectFit: "contain",
                objectPosition: "center",
                border: "1px solid #d9d9d9",
              }}
            />

            <Box
              component="button"
              type="button"
              onClick={() => setActiveIndex((current) => Math.max(current - 1, 0))}
              disabled={atFirst}
              aria-label={t("tech-rig-gallery-prev", { defaultValue: "Previous" })}
              sx={{
                position: "absolute",
                left: { xs: 8, sm: 10, md: 14 },
                top: "50%",
                transform: "translateY(-50%)",
                minWidth: { xs: 78, sm: 86, md: 94 },
                border: "1px solid #000000",
                bgcolor: "#000000",
                color: "#ffffff",
                px: { xs: 0.8, sm: 1, md: 1.1 },
                py: { xs: 0.5, sm: 0.55, md: 0.6 },
                fontFamily: "Figtree, sans-serif",
                fontWeight: 600,
                fontSize: { xs: "0.72rem", sm: "0.76rem", md: "0.82rem" },
                letterSpacing: "0.01em",
                borderRadius: 0,
                cursor: atFirst ? "not-allowed" : "pointer",
                opacity: atFirst ? 0.35 : 1,
              }}
            >
              <MdOutlineArrowBackIosNew />
            </Box>

            <Box
              component="button"
              type="button"
              onClick={() => setActiveIndex((current) => Math.min(current + 1, lastIndex))}
              disabled={atLast}
              aria-label={t("tech-rig-gallery-next", { defaultValue: "Next" })}
              sx={{
                position: "absolute",
                right: { xs: 8, sm: 10, md: 14 },
                top: "50%",
                transform: "translateY(-50%)",
                minWidth: { xs: 60, sm: 66, md: 74 },
                border: "1px solid #000000",
                bgcolor: "#000000",
                color: "#ffffff",
                px: { xs: 0.8, sm: 1, md: 1.1 },
                py: { xs: 0.5, sm: 0.55, md: 0.6 },
                fontFamily: "Figtree, sans-serif",
                fontWeight: 600,
                fontSize: { xs: "0.72rem", sm: "0.76rem", md: "0.82rem" },
                letterSpacing: "0.01em",
                borderRadius: 0,
                cursor: atLast ? "not-allowed" : "pointer",
                opacity: atLast ? 0.35 : 1,
              }}
            >
              <MdOutlineArrowForwardIos />

            </Box>
          </Box>

          <Typography
            sx={{
              mt: 0.9,
              fontFamily: "Figtree, sans-serif",
              fontWeight: 500,
              fontSize: { xs: "0.74rem", sm: "0.8rem", md: "0.86rem" },
              color: "rgba(0,0,0,0.78)",
              textAlign: "center",
            }}
          >
            {t("tech-rig-gallery-counter", {
              defaultValue: "{{current}} / {{total}}",
              current: activeIndex + 1,
              total: images.length,
            })}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}

export default function TechnologyScrollRig() {
  const isMobile = useMediaQuery("(max-width:767px)");
  const is4k = useMediaQuery("(min-width:2560px)");
  const [activeSection, setActiveSection] = useState(0);
  const [viewportSize, setViewportSize] = useState<ViewportSize>(() => getCurrentViewport());
  const [hasRigSupport] = useState(() => supportsTechnologyRig());
  const [showScrollHint, setShowScrollHint] = useState(false);
  // FIX: gate — user must press "Start" before the rig loads
  const [rigStarted, setRigStarted] = useState(false);
  const [fallbackGalleryOpen, setFallbackGalleryOpen] = useState(false);
  // FIX: trackpad detection
  const [isTrackpad, setIsTrackpad] = useState(false);
  const rigContainerRef = useRef<HTMLDivElement | null>(null);
  const hasShownScrollHintRef = useRef(false);
  const hintTimeoutRef = useRef<number | null>(null);
  const mobileScrollOffsetRef = useRef(0);
  const mobileScrollElementRef = useRef<HTMLDivElement | null>(null);
  // FIX: key to force Canvas remount after gate is opened (guarantees fresh camera state)
  const [canvasKey, setCanvasKey] = useState(0);

  const dismissScrollHint = useCallback(() => {
    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    setShowScrollHint(false);
  }, []);

  const handleStart = useCallback(() => {
    setRigStarted(true);
    // bump key so Canvas remounts fresh with correct initial camera
    setCanvasKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!fallbackGalleryOpen || typeof document === "undefined") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [fallbackGalleryOpen]);

  // ── Viewport tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    const updateViewport = () => {
      const next = getCurrentViewport();
      setViewportSize((prev) => {
        if (Math.abs(prev.width - next.width) < 0.5 && Math.abs(prev.height - next.height) < 0.5) return prev;
        return next;
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  // ── Scroll hint reveal via IntersectionObserver ────────────────────────────
  useEffect(() => {
    if (!hasRigSupport || !rigStarted) return;

    const element = rigContainerRef.current;
    if (!element) return;

    const revealScrollHint = () => {
      if (hasShownScrollHintRef.current) return;

      hasShownScrollHintRef.current = true;
      setShowScrollHint(true);
      hintTimeoutRef.current = window.setTimeout(() => {
        setShowScrollHint(false);
        hintTimeoutRef.current = null;
      }, 10000);
    };

    if (typeof window === "undefined" || typeof window.IntersectionObserver === "undefined") {
      revealScrollHint();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.45) return;
        revealScrollHint();
        observer.disconnect();
      },
      { threshold: [0.45] },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasRigSupport, rigStarted]);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current !== null) {
        window.clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  // ── Keyboard arrow navigation (desktop) ───────────────────────────────────
  useEffect(() => {
    if (!rigStarted || isMobile) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        dismissScrollHint();
        setActiveSection((prev) => Math.min(prev + 1, sectionPoses.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        dismissScrollHint();
        setActiveSection((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // We intentionally capture sectionPoses.length via closure below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rigStarted, isMobile, dismissScrollHint]);

  const sectionPoses = useMemo(() => {
    return getSectionPosesForClosestAnchor(viewportSize.width);
  }, [viewportSize.width]);
  const sectionCount = sectionPoses.length;

  const isSmallScreen = viewportSize.width < 1000;
  const usesScrollControls = isMobile || isSmallScreen;

  const jumpToSection = useCallback((targetSection: number) => {
    const clamped = THREE.MathUtils.clamp(targetSection, 0, sectionCount - 1);

    if (usesScrollControls) {
      const el = mobileScrollElementRef.current;
      if (el) {
        const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
        const offset = clamped / sectionCount;
        const targetTop = Math.min(maxScroll, Math.max(0, maxScroll * offset + (clamped > 0 ? 1 : 0)));
        el.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    } else {
      setActiveSection(clamped);
    }
  }, [sectionCount, usesScrollControls]);

  const goToNextSection = useCallback(() => {
    dismissScrollHint();
    jumpToSection(activeSection + 1);
  }, [dismissScrollHint, jumpToSection, activeSection]);

  const goToPrevSection = useCallback(() => {
    dismissScrollHint();
    jumpToSection(activeSection - 1);
  }, [dismissScrollHint, jumpToSection, activeSection]);

  const modelScale = useMemo(() => {
    if (isSmallScreen) return 1;
    if (is4k) return 1.1;
    return 0.9;
  }, [is4k, isSmallScreen]);

  const cameraFov = useMemo(() => {
    return getClosestFov(viewportSize.width);
  }, [viewportSize.width]);

  const firstPose = sectionPoses[0];
  const usePhoneStyleOverlay = viewportSize.width < 1030;
  const levelHorizon = isSmallScreen;

  // FIX: detect trackpad vs mouse wheel and handle exit-scroll properly
  // ── Non-passive wheel handler ─────────────────────────────────────────────
  // React's onWheel is always passive in modern browsers which means we can't
  // call preventDefault() on it. We attach a native listener instead so we can
  // block ScrollControls from consuming the event when the user is at the first
  // or last section and wants to scroll the page.
  const activeSectionRef = useRef(activeSection);
  useEffect(() => { activeSectionRef.current = activeSection; }, [activeSection]);
  const sectionCountRef = useRef(sectionPoses.length);
  useEffect(() => { sectionCountRef.current = sectionPoses.length; }, [sectionPoses.length]);

  // ── Desktop wheel: drive sections directly, no ScrollControls dependency ──
  // We accumulate raw wheel deltaY and advance/retreat sections ourselves.
  // At the first/last section boundary we let the event pass through to the page.
  const wheelAccumulatorRef = useRef(0);
  const wheelCooldownRef = useRef(0);

  useEffect(() => {
    const el = rigContainerRef.current;
    if (!el) return;

    let lastTime = performance.now();

    const onWheel = (e: WheelEvent) => {
      dismissScrollHint();
      if (isMobile || isSmallScreen) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const { isMouse, sign } = classifyWheelDelta(e.deltaY);
      setIsTrackpad(!isMouse);

      const atLast = activeSectionRef.current >= sectionCountRef.current - 1;
      const atFirst = activeSectionRef.current <= 0;

      // At boundary in exit direction — let the page scroll, don't consume.
      if (atLast && sign > 0) return;
      if (atFirst && sign < 0) return;

      // We're navigating inside the rig — consume the event entirely.
      e.preventDefault();
      e.stopPropagation();

      // Cooldown: ignore bursts right after a section change.
      wheelCooldownRef.current = Math.max(0, wheelCooldownRef.current - dt);
      if (wheelCooldownRef.current > 0) return;

      const threshold = isMouse ? 80 : 220;
      wheelAccumulatorRef.current += Math.abs(e.deltaY) * sign;

      if (wheelAccumulatorRef.current >= threshold) {
        wheelAccumulatorRef.current = 0;
        wheelCooldownRef.current = isMouse ? 0.25 : 0.45;
        setActiveSection((prev) => Math.min(prev + 1, sectionCountRef.current - 1));
      } else if (wheelAccumulatorRef.current <= -threshold) {
        wheelAccumulatorRef.current = 0;
        wheelCooldownRef.current = isMouse ? 0.25 : 0.45;
        setActiveSection((prev) => Math.max(prev - 1, 0));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [dismissScrollHint, isMobile, isSmallScreen]);

  if (!hasRigSupport) {
    return <TechnologyFallbackSequence />;
  }

  return (
    <Box
      ref={rigContainerRef}
      onTouchStartCapture={dismissScrollHint}
      sx={{
        width: "100%",
        height: isMobile ? "100dvh" : "100vh",
        minHeight: isMobile ? "100dvh" : "100vh",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid #d9d9d9",
        borderBottom: "1px solid #d9d9d9",
        bgcolor: "#ffffff",
        "& *": {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
        "& *::-webkit-scrollbar": {
          display: "none",
          width: 0,
          height: 0,
        },
      }}
    >
      {/* Loading gate — shown until user clicks Start */}
      {!rigStarted && (
        <LoadingGate isMobile={usePhoneStyleOverlay} onStart={handleStart} />
      )}

      {/* 3D Canvas — only mounted after user starts */}
      {rigStarted && (
        <>
          <Canvas
            key={canvasKey}
            dpr={[1, 1]}
            gl={{ antialias: false, powerPreference: "low-power" }}
            // FIX: set initial camera position AND rotation here so the very first
            // rendered frame matches section 0 — prevents the "wrong start pose" glitch
            camera={{ position: firstPose.position, rotation: firstPose.rotation, fov: cameraFov }}
            onCreated={({ camera }) => {
              // Belt-and-braces: also set rotation imperatively on creation
              camera.rotation.set(...firstPose.rotation);
              camera.position.set(...firstPose.position);
            }}
          >
            {usesScrollControls ? (
              <ScrollControls
                pages={MOBILE_SCROLL_PAGES}
                damping={0.3}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <MobileScrollDriver
                  offsetRef={mobileScrollOffsetRef}
                  scrollElementRef={mobileScrollElementRef}
                />
                <Scene
                  sectionPoses={sectionPoses}
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                  modelScale={modelScale}
                  isMobile={true}
                  levelHorizon={levelHorizon}
                  isTrackpad={false}
                  onScrollOffsetRef={mobileScrollOffsetRef}
                />
              </ScrollControls>
            ) : (
              <Scene
                sectionPoses={sectionPoses}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                modelScale={modelScale}
                isMobile={false}
                levelHorizon={false}
                isTrackpad={isTrackpad}
              />
            )}
          </Canvas>

          <Overlay
            activePose={sectionPoses[activeSection]}
            activeSection={activeSection}
            isMobile={usePhoneStyleOverlay}
            showScrollHint={showScrollHint}
          />
        </>
      )}

      {rigStarted && (
        <RigVisibilityHelp
          onOpenGallery={() => setFallbackGalleryOpen(true)}
          onPrevSection={goToPrevSection}
          onNextSection={goToNextSection}
          canPrev={activeSection > 0}
          canNext={activeSection < sectionCount - 1}
        />
      )}

      <RigFallbackGallery
        open={fallbackGalleryOpen}
        onClose={() => setFallbackGalleryOpen(false)}
        isPhone={isMobile}
      />
    </Box>
  );
}

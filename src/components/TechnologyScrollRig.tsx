import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Fade, ThemeProvider, Typography, createTheme, useMediaQuery } from "@mui/material";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ScrollControls, useScroll } from "@react-three/drei";
import { motion } from "framer-motion";
import { easing } from "maath";
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
    position: [-22.13, 2, 12.5],
    rotation: [-0.5, -0.7, -0.4],
    title: "Primary Shredder",
    body: "Waste enters through the primary shredder for initial size reduction.",
    titleKey: "tech-scroll-1-title",
    bodyKey: "tech-scroll-1-body",
  },
  {
    position: [-14.7, 0, 9],
    rotation: [0.5, -1.5, 0.5],
    title: "Secondary Shredder",
    body: "Secondary shredding reduces mixed waste to controlled feed size.",
    titleKey: "tech-scroll-2-title",
    bodyKey: "tech-scroll-2-body",
  },
  {
    position: [-4.8, 9.1, 14.8],
    rotation: [-1.55, -0.001, -0.001],
    title: "Temporary Storage for Shredded Material",
    body: "Processed material is buffered before thermal processing.",
    titleKey: "tech-scroll-3-title",
    bodyKey: "tech-scroll-3-body",
  },
  {
    position: [3.9, 2.4, 21.6],
    rotation: [-0.2, 0.004, 0.004],
    title: "Feed System",
    body: "Automated feed controls maintain stable reactor input flow.",
    titleKey: "tech-scroll-4-title",
    bodyKey: "tech-scroll-4-body",
  },
  {
    position: [-5.2, -0.1, 7.8],
    rotation: [2.2, -1.555, 2.2],
    title: "Pyrolysis Reactor",
    body: "Material undergoes high-temperature molecular disintegration without oxygen.",
    titleKey: "tech-scroll-5-title",
    bodyKey: "tech-scroll-5-body",
  },
  {
    position: [-2.48, 1.15, 6.43],
    rotation: [-0.74, -0.53, -0.43],
    title: "Solid Byproduct (Char / Carbon Residue)",
    body: "Carbon-rich residue is extracted for secondary industrial use.",
    titleKey: "tech-scroll-6-title",
    bodyKey: "tech-scroll-6-body",
  },
  {
    position: [7.46, -0.119, 0.983],
    rotation: [3.1, 0.84, -3.12],
    title: "Gas Filtration and Conditioning",
    body: "Gas is filtered and conditioned into cleaner synthesis gas.",
    titleKey: "tech-scroll-7-title",
    bodyKey: "tech-scroll-7-body",
  },
  {
    position: [-4.9, 2.5, 32.9],
    rotation: [-0.137, -0.88, -0.106],
    title: "Gas Storage Tanks",
    body: "Conditioned gas is stored in pressurized tanks for flow regulation.",
    titleKey: "tech-scroll-8-title",
    bodyKey: "tech-scroll-8-body",
  },
  {
    position: [-38.34, 0.43, 8.5],
    rotation: [-1.18, 1.55, 1.18],
    title: "Power Generation",
    body: "Conditioned syngas drives generator units for electrical output.",
    titleKey: "tech-scroll-9-title",
    bodyKey: "tech-scroll-9-body",
  },
];

const REFERENCE_VIEWPORT: ViewportSize = { width: 1920, height: 1200 };

const TABLET_POSE_DATA: PoseData[] = [
  { position: [-27.605, -0.963, 10.804], rotation: [0.089, -1.196, 0.023] },
  { position: [-17.182, -0.205, 19.039], rotation: [0.01, -0.797, 0.007] },
  { position: [-5.744, 19.607, 15.028], rotation: [-1.487, -0.002, -0.018] },
  { position: [3.201, 3.199, 26.533], rotation: [-0.182, -0.088, -0.014] },
  { position: [-5.869, 0.186, 8.6], rotation: [-0.28, -1.519, -0.28] },
  { position: [-4.406, -2.019, 6.317], rotation: [0.18, -0.738, 0.22] },
  { position: [16.833, 0.214, -0.712], rotation: [-3.121, 0.84, 3.126] },
  { position: [28.125, 6.528, 39.69], rotation: [-0.213, 0.631, 0.127] },
  { position: [-19.972, 8.98, 9.54], rotation: [-1.517, 1.378, 1.1516] },
];

const PHONE_POSE_DATA: PoseData[] = [
  { position: [-26.809, 0.072, 19.094], rotation: [-0.003, -0.728, 0.007] },
  { position: [-22.532, 0.96, 23.34], rotation: [-0.04, -0.8, -0.02] },
  { position: [-5.744, 19.607, 15.028], rotation: [-1.487, -0.002, -0.018] },
  { position: [-1.164, 3.755, 27.157], rotation: [-0.205, -0.375, -0.076] },
  { position: [-12.483, 0.28, 8.9], rotation: [-0.286, -1.519, -0.28] },
  { position: [-3.841, -2.125, 6.79], rotation: [0.182, -0.688, 0.116] },
  { position: [16.833, 0.214, -0.712], rotation: [-3.121, 0.84, 3.126] },
  { position: [42, 10.7, 56.3], rotation: [-0.226, 0.658, 0.14] },
  { position: [-19.972, 8.98, 9.54], rotation: [-1.517, 1.378, 1.1516] },
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

function Scene({
  sectionPoses,
  activeSection,
  onSectionChange,
  modelScale,
  isMobile,
  levelHorizon,
  useExactSmallScreenPose,
}: {
  sectionPoses: SectionPose[];
  activeSection: number;
  onSectionChange: (section: number) => void;
  modelScale: number;
  isMobile: boolean;
  levelHorizon: boolean;
  useExactSmallScreenPose: boolean;
}) {
  const scroll = useScroll();
  const sectionRef = useRef(-1);
  const lastOffsetRef = useRef(0);
  const offsetPrimedRef = useRef(false);
  const startResetRef = useRef(false);
  const scrollAccumulatorRef = useRef(0);
  const cooldownRef = useRef(0);
  const targetEulerRef = useRef(new THREE.Euler());
  const targetQuatRef = useRef(new THREE.Quaternion());
  const targetPosRef = useRef(new THREE.Vector3());
  const lookFromRef = useRef(new THREE.Vector3());
  const lookDirRef = useRef(new THREE.Vector3());
  const lookAtRef = useRef(new THREE.Vector3());
  const lookMatrixRef = useRef(new THREE.Matrix4());

  useEffect(() => {
    offsetPrimedRef.current = false;
    startResetRef.current = false;
    sectionRef.current = -1;
    lastOffsetRef.current = 0;
    scrollAccumulatorRef.current = 0;
    cooldownRef.current = 0;
    onSectionChange(0);
  }, [onSectionChange, sectionPoses]);

  useFrame((state, delta) => {
    if (!offsetPrimedRef.current) {
      lastOffsetRef.current = scroll.offset;
      offsetPrimedRef.current = true;
    }

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

    if (!startResetRef.current) {
      const firstPose = sectionPoses[0];
      const scrollElement = (scroll as unknown as { el?: HTMLElement }).el;
      if (scrollElement) {
        scrollElement.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

      sectionRef.current = 0;
      offsetPrimedRef.current = false;
      lastOffsetRef.current = 0;
      scrollAccumulatorRef.current = 0;
      cooldownRef.current = 0;
      onSectionChange(0);

      targetPosRef.current.set(...firstPose.position);
      state.camera.position.copy(targetPosRef.current);
      setTargetQuaternion(firstPose.rotation, firstPose.position);
      state.camera.quaternion.copy(targetQuatRef.current);
      startResetRef.current = true;
      return;
    }

    if (useExactSmallScreenPose) {
      const { section } = getSectionProgress(scroll.offset, sectionPoses.length);
      const targetPose = sectionPoses[section];

      targetPosRef.current.set(...targetPose.position);
      state.camera.position.copy(targetPosRef.current);

      setTargetQuaternion(targetPose.rotation, targetPose.position);
      state.camera.quaternion.copy(targetQuatRef.current);

      if (sectionRef.current !== section) {
        sectionRef.current = section;
        onSectionChange(section);
      }
      return;
    }

    if (isMobile) {
      const { section, nextSection, t } = getSectionProgress(scroll.offset, sectionPoses.length);
      const targetPose = lerpPose(sectionPoses[section], sectionPoses[nextSection], t);

      targetPosRef.current.set(...targetPose.position);
      easing.damp3(state.camera.position, targetPose.position, 0.28, delta);

      setTargetQuaternion(targetPose.rotation, targetPose.position);
      state.camera.quaternion.slerp(targetQuatRef.current, 1 - Math.exp(-9 * delta));

      if (sectionRef.current !== section) {
        sectionRef.current = section;
        onSectionChange(section);
      }
      return;
    }

    const offsetDelta = scroll.offset - lastOffsetRef.current;
    lastOffsetRef.current = scroll.offset;
    cooldownRef.current = Math.max(0, cooldownRef.current - delta);

    if (cooldownRef.current <= 0 && Math.abs(offsetDelta) > 0.00015) {
      scrollAccumulatorRef.current += offsetDelta;

      const threshold = 0.058;
      if (scrollAccumulatorRef.current >= threshold && activeSection < sectionPoses.length - 1) {
        onSectionChange(activeSection + 1);
        scrollAccumulatorRef.current = 0;
        cooldownRef.current = 0.2;
      } else if (scrollAccumulatorRef.current <= -threshold && activeSection > 0) {
        onSectionChange(activeSection - 1);
        scrollAccumulatorRef.current = 0;
        cooldownRef.current = 0.2;
      }
    }

    const currentPose = sectionPoses[activeSection];
    const nextPose = sectionPoses[Math.min(activeSection + 1, sectionPoses.length - 1)];
    const speed = activeSection === 7 && nextPose === sectionPoses[8] ? 0.62 : 0.28;

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

function Overlay({
  activePose,
  activeSection,
  isMobile,
}: {
  activePose: SectionPose;
  activeSection: number;
  isMobile: boolean;
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
            width: isMobile ? "100%" : { xs: "calc(100% - 32px)", sm: 420, md: 500, lg: 580, xl: 640 },
            maxWidth: isMobile ? "100%" : "90vw",
            px: isMobile ? { xs: 2, sm: 2.5 } : { xs: 2, md: 2.5, lg: 3 },
            py: isMobile ? { xs: 2, sm: 2.5 } : { xs: 1.5, md: 2, lg: 2.5 },
            bgcolor: "#ffffff",
            border: isMobile ? "none" : "1px solid #000000",
            boxShadow: isMobile ? "none" : "0 10px 26px rgba(0,0,0,0.08)",
            pointerEvents: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            ...(isMobile
              ? {
                top: {
                  xs: "calc(env(safe-area-inset-top, 0px) + 56px)",
                  sm: "calc(env(safe-area-inset-top, 0px) + 64px)",
                  md: "calc(env(safe-area-inset-top, 0px) + 72px)",
                },
                left: 0,
                right: 0,
                transform: "none",
              }
              : pos),
          }}
        >
          <Fade in key={activeSection} timeout={300}>
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "stretch" }}>
              <Box
                sx={{
                  flex: isMobile ? "none" : "0 0 46%",
                  width: isMobile ? { xs: "76%", sm: "64%" } : "46%",
                  pr: isMobile ? 0 : 2,
                  mb: isMobile ? 1.5 : 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box component="img" src={logoSrc} alt="Waste Power Tech" sx={{ width: "100%", height: "auto", display: "block" }} />
              </Box>
              <Box sx={{ flex: 1, pl: isMobile ? 0 : 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Stack Sans Headline, sans-serif",
                    fontWeight: 700,
                    textAlign: "left",
                    fontSize: { xs: "1.25rem", sm: "1.45rem", md: "1.8rem", lg: "2.15rem", xl: "2.4rem", xxl: "2.4rem", xxxl: "3rem" },
                    "@media (min-width:2560px)": { fontSize: "2.8rem" },
                    lineHeight: 1.08,
                    letterSpacing: "-0.015em",
                    mb: { xs: 0.65, md: 0.85 },
                  }}
                >
                  {t(activePose.titleKey, { defaultValue: activePose.title })}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Figtree, sans-serif",
                    textAlign: "left",
                    fontWeight: 400,
                    fontSize: { xs: "0.9rem", sm: "0.98rem", md: "1.08rem", lg: "1.2rem", xl: "1.32rem", xxl: "1.32rem", xxxl: "2rem" },
                    "@media (min-width:2560px)": { fontSize: "1.55rem" },
                    lineHeight: 1.45,
                    color: "rgba(0,0,0,0.82)",
                    maxWidth: "74ch",
                  }}
                >
                  {t(activePose.bodyKey, { defaultValue: activePose.body })}
                </Typography>
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
}: {
  visible: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Fade in={visible} timeout={{ enter: 180, exit: 180 }} unmountOnExit>
      <Box
        sx={{
          position: "absolute",
          left: { xs: 16, md: 24 },
          bottom: { xs: 20, md: 28 },
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: { xs: 1.25, md: 1.5 },
            py: { xs: 0.9, md: 1.1 },
            bgcolor: "#ffffff",
            border: "1px solid #000000",
            boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 18,
              height: 34,
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
                top: 4,
                left: 3,
                right: 3,
                height: 7,
                background: "#0000FF",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: "Figtree, sans-serif",
              fontSize: { xs: "0.76rem", md: "0.82rem" },
              fontWeight: 500,
              lineHeight: 1.25,
              letterSpacing: "0.01em",
              color: "#000000",
            }}
          >
            {t("tech-scroll-hint", { defaultValue: "Scroll to progress" })}
          </Typography>
        </Box>
      </Box>
    </Fade>
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
  const imagePrefix = isMobile ? "/fallbackMobile/tech-phone" : "/fallbackDesktop/tech-desktop";
  const images = useMemo(
    () => Array.from({ length: FALLBACK_SECTION_COUNT }, (_, index) => `${imagePrefix}-${index + 1}.png`),
    [imagePrefix],
  );

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

export default function TechnologyScrollRig() {
  const isMobile = useMediaQuery("(max-width:767px)");
  const is4k = useMediaQuery("(min-width:2560px)");
  const [activeSection, setActiveSection] = useState(0);
  const [viewportSize, setViewportSize] = useState<ViewportSize>(() => getCurrentViewport());
  const [hasRigSupport, setHasRigSupport] = useState(true);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const rigContainerRef = useRef<HTMLDivElement | null>(null);
  const hasShownScrollHintRef = useRef(false);
  const hintTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setHasRigSupport(supportsTechnologyRig());
  }, []);

  const dismissScrollHint = useCallback(() => {
    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }

    setShowScrollHint(false);
  }, []);

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

  useEffect(() => {
    if (!hasRigSupport) return;

    const element = rigContainerRef.current;
    if (!element) return;

    const revealScrollHint = () => {
      if (hasShownScrollHintRef.current) return;

      hasShownScrollHintRef.current = true;
      setShowScrollHint(true);
      hintTimeoutRef.current = window.setTimeout(() => {
        setShowScrollHint(false);
        hintTimeoutRef.current = null;
      }, 6000);
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
      {
        threshold: [0.45],
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasRigSupport]);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current !== null) {
        window.clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  const sectionPoses = useMemo(() => {
    return getSectionPosesForClosestAnchor(viewportSize.width);
  }, [viewportSize.width]);
  const isSmallScreen = viewportSize.width < 1000;

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

  if (!hasRigSupport) {
    return <TechnologyFallbackSequence />;
  }

  const handleRigWheelCapture = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      dismissScrollHint();

      if (isMobile || isSmallScreen) return;

      const atLastSection = activeSection >= sectionPoses.length - 1;
      const atFirstSection = activeSection <= 0;

      if ((atLastSection && event.deltaY > 0) || (atFirstSection && event.deltaY < 0)) {
        event.preventDefault();
        event.stopPropagation();
        window.scrollBy({
          top: event.deltaY,
          behavior: "auto",
        });
      }
    },
    [activeSection, dismissScrollHint, isMobile, isSmallScreen, sectionPoses.length],
  );

  return (
    <Box
      ref={rigContainerRef}
      onWheelCapture={handleRigWheelCapture}
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
      <Canvas
        dpr={[1, 1]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        camera={{ position: firstPose.position, fov: cameraFov }}
        onCreated={({ camera }) => {
          camera.rotation.set(...firstPose.rotation);
        }}
      >
        <ScrollControls pages={sectionPoses.length} damping={0.18} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <Scene
            sectionPoses={sectionPoses}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            modelScale={modelScale}
            isMobile={isMobile}
            levelHorizon={levelHorizon}
            useExactSmallScreenPose={false}
          />
        </ScrollControls>
      </Canvas>

      <Overlay activePose={sectionPoses[activeSection]} activeSection={activeSection} isMobile={usePhoneStyleOverlay} />
      <ScrollHintOverlay visible={showScrollHint} />
    </Box>
  );
}


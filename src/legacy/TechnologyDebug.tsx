import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Divider, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import AssemblyCompressedModel from "../components/AssemblyCompressedModel";
import rawCameraPoses from "./cameraPoses.json";

type Vec3Tuple = [number, number, number];

type Telemetry = {
  cameraPos: Vec3Tuple;
  cameraRot: Vec3Tuple;
  target: Vec3Tuple;
  hit: Vec3Tuple | null;
};

type PoseData = {
  position: Vec3Tuple;
  rotation: Vec3Tuple;
};

type SavedPoseData = PoseData & {
  mouseWorld: Vec3Tuple | null;
};

type RawSavedPoseData = {
  position?: number[];
  rotation?: number[];
  target?: number[];
  mouseWorld?: number[] | null;
};

type RawSavedPoseMap = Record<string, Record<string, RawSavedPoseData>>;

type AnchorSet = {
  width: number;
  fov: number;
  label: string;
  poses: PoseData[];
};

type SnapRequest = {
  pose: PoseData;
  fov: number;
};

type PanelPosition = {
  x: number;
  y: number;
};

const DESKTOP_FALLBACK_POSES: PoseData[] = [
  { position: [-22.13, 2, 12.5], rotation: [-0.5, -0.7, -0.4] },
  { position: [-14.7, 0, 9], rotation: [0.5, -1.5, 0.5] },
  { position: [-4.8, 9.1, 14.8], rotation: [-1.55, -0.001, -0.001] },
  { position: [3.9, 2.4, 21.6], rotation: [-0.2, 0.004, 0.004] },
  { position: [-5.2, -0.1, 7.8], rotation: [2.2, -1.555, 2.2] },
  { position: [-2.48, 1.15, 6.43], rotation: [-0.74, -0.53, -0.43] },
  { position: [7.46, -0.119, 0.983], rotation: [3.1, 0.84, -3.12] },
  { position: [-4.9, 2.5, 32.9], rotation: [-0.137, -0.88, -0.106] },
  { position: [-38.34, 0.43, 8.5], rotation: [-1.18, 1.55, 1.18] },
];

const TABLET_FALLBACK_POSES: PoseData[] = [
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

const PHONE_FALLBACK_POSES: PoseData[] = [
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

const RAW_CAMERA_POSES = rawCameraPoses as RawSavedPoseMap;

function toVec3Tuple(value: unknown): Vec3Tuple | null {
  if (!Array.isArray(value) || value.length !== 3) return null;
  const [x, y, z] = value;
  if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number") return null;
  return [x, y, z];
}

function deriveCameraRotation(position: Vec3Tuple, target: Vec3Tuple): Vec3Tuple {
  const camera = new THREE.PerspectiveCamera();
  camera.position.set(...position);
  camera.lookAt(new THREE.Vector3(...target));
  return [n3(camera.rotation.x), n3(camera.rotation.y), n3(camera.rotation.z)];
}

function normalizeSavedPose(pose?: RawSavedPoseData | null): SavedPoseData | null {
  if (!pose) return null;

  const position = toVec3Tuple(pose.position);
  if (!position) return null;

  const rotation = toVec3Tuple(pose.rotation)
    ?? (() => {
      const lookTarget = toVec3Tuple(pose.target) ?? toVec3Tuple(pose.mouseWorld);
      return lookTarget ? deriveCameraRotation(position, lookTarget) : null;
    })();

  if (!rotation) return null;

  return {
    position,
    rotation,
    mouseWorld: toVec3Tuple(pose.mouseWorld),
  };
}

function buildPresetPoses(widthKey: string, fallback: PoseData[]): PoseData[] {
  const widthBucket = RAW_CAMERA_POSES[widthKey];

  return fallback.map((pose, index) => {
    const normalized = normalizeSavedPose(widthBucket?.[String(index + 1)]);
    return normalized
      ? { position: normalized.position, rotation: normalized.rotation }
      : pose;
  });
}

function buildInitialSavedPoses(): Record<string, Record<string, SavedPoseData>> {
  const next: Record<string, Record<string, SavedPoseData>> = {};

  Object.entries(RAW_CAMERA_POSES).forEach(([widthKey, sections]) => {
    const normalizedSections: Record<string, SavedPoseData> = {};

    Object.entries(sections).forEach(([sectionKey, pose]) => {
      const normalized = normalizeSavedPose(pose);
      if (normalized) {
        normalizedSections[sectionKey] = normalized;
      }
    });

    if (Object.keys(normalizedSections).length > 0) {
      next[widthKey] = normalizedSections;
    }
  });

  return next;
}

const DESKTOP_POSES = buildPresetPoses("1920", DESKTOP_FALLBACK_POSES);
const TABLET_POSES = buildPresetPoses("768", TABLET_FALLBACK_POSES);
const PHONE_POSES = buildPresetPoses("430", PHONE_FALLBACK_POSES);

const ANCHOR_SETS: AnchorSet[] = [
  { width: 430, fov: 56, label: "Phone 430", poses: PHONE_POSES },
  { width: 768, fov: 52, label: "Tablet 768", poses: TABLET_POSES },
  { width: 1920, fov: 42, label: "Desktop 1920", poses: DESKTOP_POSES },
];

function f(n: number) {
  return n.toFixed(3);
}

function n3(n: number) {
  return Number(n.toFixed(3));
}

function parseWidth(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 768;
  return THREE.MathUtils.clamp(parsed, 240, 6000);
}

function getClosestAnchor(width: number) {
  return ANCHOR_SETS.reduce((closest, current) =>
    Math.abs(current.width - width) < Math.abs(closest.width - width) ? current : closest,
  );
}

function poseSnippet(pose: PoseData) {
  return `position: [${f(pose.position[0])}, ${f(pose.position[1])}, ${f(pose.position[2])}], rotation: [${f(pose.rotation[0])}, ${f(pose.rotation[1])}, ${f(pose.rotation[2])}]`;
}

function DebugScene({
  setTelemetry,
  snapRequest,
}: {
  setTelemetry: React.Dispatch<React.SetStateAction<Telemetry>>;
  snapRequest: SnapRequest | null;
}) {
  const { camera } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const pressedRef = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });
  const frameAccumulator = useRef(0);
  const fallbackPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    [],
  );
  const fallbackPoint = useMemo(() => new THREE.Vector3(), []);
  const forwardRef = useRef(new THREE.Vector3());
  const rightRef = useRef(new THREE.Vector3());
  const moveVectorRef = useRef(new THREE.Vector3());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key in pressedRef.current) {
        pressedRef.current[event.key as keyof typeof pressedRef.current] = true;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key in pressedRef.current) {
        pressedRef.current[event.key as keyof typeof pressedRef.current] = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!snapRequest) return;

    camera.position.set(...snapRequest.pose.position);
    camera.rotation.set(...snapRequest.pose.rotation);

    if (controlsRef.current) {
      const lookDir = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation).normalize();
      const nextTarget = camera.position.clone().add(lookDir.multiplyScalar(10));
      controlsRef.current.target.copy(nextTarget);
      controlsRef.current.update();
    }
  }, [camera, snapRequest]);

  useFrame((state, delta) => {
    if (controlsRef.current) {
      const moveSpeed = 7 * delta;
      const orbitTarget = controlsRef.current.target as THREE.Vector3;
      const forward = forwardRef.current;
      const right = rightRef.current;
      const moveVector = moveVectorRef.current;
      moveVector.set(0, 0, 0);

      camera.getWorldDirection(forward);
      forward.set(forward.x, 0, forward.z);
      if (forward.lengthSq() > 0) forward.normalize();

      right.crossVectors(forward, camera.up).normalize();

      if (pressedRef.current.ArrowUp) moveVector.add(forward);
      if (pressedRef.current.ArrowDown) moveVector.sub(forward);
      if (pressedRef.current.ArrowRight) moveVector.add(right);
      if (pressedRef.current.ArrowLeft) moveVector.sub(right);

      if (moveVector.lengthSq() > 0) {
        moveVector.normalize().multiplyScalar(moveSpeed);
        camera.position.add(moveVector);
        orbitTarget.add(moveVector);
        controlsRef.current.update();
      }
    }

    frameAccumulator.current += delta;
    if (frameAccumulator.current < 0.08) return;
    frameAccumulator.current = 0;

    state.raycaster.setFromCamera(state.pointer, camera);

    let hit: Vec3Tuple | null = null;
    if (modelRef.current) {
      const intersections = state.raycaster.intersectObject(modelRef.current, true);
      if (intersections.length > 0) {
        const p = intersections[0].point;
        hit = [p.x, p.y, p.z];
      }
    }

    if (!hit && state.raycaster.ray.intersectPlane(fallbackPlane, fallbackPoint)) {
      hit = [fallbackPoint.x, fallbackPoint.y, fallbackPoint.z];
    }

    const cr = camera.rotation;
    const target = controlsRef.current?.target
      ? [
        controlsRef.current.target.x,
        controlsRef.current.target.y,
        controlsRef.current.target.z,
      ]
      : [0, 0, 0];

    setTelemetry({
      cameraPos: [camera.position.x, camera.position.y, camera.position.z],
      cameraRot: [cr.x, cr.y, cr.z],
      target: target as Vec3Tuple,
      hit,
    });
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} />

      <group ref={modelRef}>
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

      <gridHelper args={[20, 20, "#8E8E8E", "#DDDDDD"]} />
      <axesHelper args={[2]} />
      <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.08} />
    </>
  );
}

export default function TechnologyDebug() {
  const [telemetry, setTelemetry] = useState<Telemetry>({
    cameraPos: [5, 5, 5],
    cameraRot: [0, 0, 0],
    target: [0, 0, 0],
    hit: null,
  });
  const [widthInput, setWidthInput] = useState("768");
  const [activeSection, setActiveSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [manualSnapPose, setManualSnapPose] = useState<PoseData | null>(null);
  const [saveSection, setSaveSection] = useState("1");
  const [savedPoses, setSavedPoses] = useState<Record<string, Record<string, SavedPoseData>>>(() => buildInitialSavedPoses());
  const [panelVisible, setPanelVisible] = useState(true);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition>({ x: 16, y: 16 });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, pointerId: -1, offsetX: 0, offsetY: 0 });

  const parsedWidth = useMemo(() => parseWidth(widthInput), [widthInput]);
  const closestAnchor = useMemo(() => getClosestAnchor(parsedWidth), [parsedWidth]);
  const activePose = closestAnchor.poses[activeSection];
  const snapPose = manualSnapPose ?? activePose;
  const snapRequest = useMemo<SnapRequest>(() => ({
    pose: snapPose,
    fov: closestAnchor.fov,
  }), [closestAnchor.fov, snapPose]);

  const clampPanelPosition = useCallback((nextX: number, nextY: number): PanelPosition => {
    const panelWidth = panelRef.current?.offsetWidth ?? Math.min(window.innerWidth * 0.92, 540);
    const panelHeight = panelRef.current?.offsetHeight ?? Math.min(window.innerHeight * 0.9, 680);
    const margin = 8;
    const maxX = Math.max(margin, window.innerWidth - panelWidth - margin);
    const maxY = Math.max(margin, window.innerHeight - panelHeight - margin);
    return {
      x: THREE.MathUtils.clamp(nextX, margin, maxX),
      y: THREE.MathUtils.clamp(nextY, margin, maxY),
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setManualSnapPose(null);
      setActiveSection((prev) => (prev + 1) % closestAnchor.poses.length);
    }, 1250);
    return () => {
      window.clearInterval(timer);
    };
  }, [closestAnchor.poses.length, isPlaying]);

  useEffect(() => {
    const onResize = () => {
      setPanelPosition((prev) => clampPanelPosition(prev.x, prev.y));
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [clampPanelPosition]);

  const handlePanelPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-panel-control='true']")) return;

    dragRef.current.active = true;
    dragRef.current.pointerId = event.pointerId;
    dragRef.current.offsetX = event.clientX - panelPosition.x;
    dragRef.current.offsetY = event.clientY - panelPosition.y;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [panelPosition.x, panelPosition.y]);

  const handlePanelPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    const nextX = event.clientX - dragRef.current.offsetX;
    const nextY = event.clientY - dragRef.current.offsetY;
    setPanelPosition(clampPanelPosition(nextX, nextY));
  }, [clampPanelPosition]);

  const handlePanelPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.active = false;
    dragRef.current.pointerId = -1;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const cameraSnippet = `position: [${f(telemetry.cameraPos[0])}, ${f(telemetry.cameraPos[1])}, ${f(telemetry.cameraPos[2])}], rotation: [${f(telemetry.cameraRot[0])}, ${f(telemetry.cameraRot[1])}, ${f(telemetry.cameraRot[2])}], lookAt: [${f(telemetry.target[0])}, ${f(telemetry.target[1])}, ${f(telemetry.target[2])}]`;

  const savedJson = useMemo(() => JSON.stringify(savedPoses, null, 2), [savedPoses]);

  const handleJumpToScene = (index: number) => {
    setManualSnapPose(null);
    setActiveSection(index);
  };

  const handleSaveCurrentCamera = () => {
    const widthKey = String(parsedWidth);
    const nextPose: SavedPoseData = {
      position: [n3(telemetry.cameraPos[0]), n3(telemetry.cameraPos[1]), n3(telemetry.cameraPos[2])],
      rotation: [n3(telemetry.cameraRot[0]), n3(telemetry.cameraRot[1]), n3(telemetry.cameraRot[2])],
      mouseWorld: telemetry.hit
        ? [n3(telemetry.hit[0]), n3(telemetry.hit[1]), n3(telemetry.hit[2])]
        : null,
    };

    setSavedPoses((prev) => {
      const widthBucket = { ...(prev[widthKey] ?? {}) };
      widthBucket[saveSection] = nextPose;
      return { ...prev, [widthKey]: widthBucket };
    });
  };

  const handleLoadSavedCamera = () => {
    const widthKey = String(parsedWidth);
    const saved = savedPoses[widthKey]?.[saveSection];
    if (!saved) return;
    setActiveSection(Math.max(0, Math.min(8, Number.parseInt(saveSection, 10) - 1)));
    setManualSnapPose({
      position: [...saved.position] as Vec3Tuple,
      rotation: [...saved.rotation] as Vec3Tuple,
    });
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#ffffff", position: "relative" }}>
      <Canvas
        key={`${closestAnchor.width}-${closestAnchor.fov}`}
        dpr={[1, 1]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        camera={{ position: [5, 5, 5], fov: closestAnchor.fov }}
        style={{ height: "100vh" }}
      >
        <DebugScene setTelemetry={setTelemetry} snapRequest={snapRequest} />
      </Canvas>

      {!panelVisible && (
        <Button
          variant="contained"
          size="small"
          onClick={() => setPanelVisible(true)}
          sx={{
            position: "fixed",
            left: 12,
            top: 12,
            zIndex: 11,
            bgcolor: "#000000",
            color: "#ffffff",
            borderRadius: 0,
            "&:hover": { bgcolor: "#222222" },
          }}
        >
          Show Debug
        </Button>
      )}

      {panelVisible && (
        <Box
          ref={panelRef}
          sx={{
            position: "fixed",
            top: panelPosition.y,
            left: panelPosition.x,
            border: "1px solid #000000",
            bgcolor: "rgba(255,255,255,0.96)",
            p: 1.5,
            width: { xs: "min(94vw, 380px)", sm: "min(92vw, 540px)" },
            maxHeight: "90vh",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            onPointerDown={handlePanelPointerDown}
            onPointerMove={handlePanelPointerMove}
            onPointerUp={handlePanelPointerUp}
            onPointerCancel={handlePanelPointerUp}
            sx={{
              mb: 0.8,
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
            }}
          >
            <Typography sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontSize: "0.95rem" }}>
              Technology Debug Controller
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <Button
                data-panel-control="true"
                variant="outlined"
                size="small"
                onClick={() => setPanelCollapsed((prev) => !prev)}
                sx={{ borderColor: "#000000", color: "#000000", fontSize: "0.7rem", px: 1 }}
              >
                {panelCollapsed ? "Expand" : "Collapse"}
              </Button>
              <Button
                data-panel-control="true"
                variant="outlined"
                size="small"
                onClick={() => setPanelVisible(false)}
                sx={{ borderColor: "#000000", color: "#000000", fontSize: "0.7rem", px: 1 }}
              >
                Hide
              </Button>
            </Stack>
          </Stack>

          <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.76rem", mb: panelCollapsed ? 0 : 1 }}>
            Drag the header to move. Hide if it blocks the model on phone.
          </Typography>

          {!panelCollapsed && (
            <>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  label="Screen width (px)"
                  size="small"
                  value={widthInput}
                  onChange={(e) => setWidthInput(e.target.value)}
                  sx={{ minWidth: 170 }}
                />
                <Button variant="outlined" size="small" onClick={() => setWidthInput("430")} sx={{ borderColor: "#000000", color: "#000000" }}>
                  430
                </Button>
                <Button variant="outlined" size="small" onClick={() => setWidthInput("768")} sx={{ borderColor: "#000000", color: "#000000" }}>
                  768
                </Button>
                <Button variant="outlined" size="small" onClick={() => setWidthInput("1920")} sx={{ borderColor: "#000000", color: "#000000" }}>
                  1920
                </Button>
              </Stack>

              <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.8rem", mb: 1 }}>
                Closest boundary: {closestAnchor.label} ({closestAnchor.width}px) | FOV {closestAnchor.fov}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setManualSnapPose(null);
                    setActiveSection((prev) => (prev - 1 + 9) % 9);
                  }}
                  sx={{ borderColor: "#000000", color: "#000000" }}
                >
                  Prev
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setManualSnapPose(null);
                    setActiveSection((prev) => (prev + 1) % 9);
                  }}
                  sx={{ borderColor: "#000000", color: "#000000" }}
                >
                  Next
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setManualSnapPose(null);
                    setActiveSection(0);
                    setIsPlaying(true);
                  }}
                  sx={{ borderColor: "#000000", color: "#000000" }}
                >
                  Play All
                </Button>
                <Button variant="outlined" size="small" onClick={() => setIsPlaying(false)} sx={{ borderColor: "#000000", color: "#000000" }}>
                  Stop
                </Button>
              </Stack>

              <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.8rem", mb: 0.5 }}>
                Current scene: {activeSection + 1}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(9, minmax(0, 1fr))", gap: 0.5, mb: 1.25 }}>
                {Array.from({ length: 9 }, (_, index) => (
                  <Button
                    key={index}
                    variant={activeSection === index ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleJumpToScene(index)}
                    sx={{
                      minWidth: 0,
                      px: 0,
                      borderColor: "#000000",
                      color: activeSection === index ? "#ffffff" : "#000000",
                      bgcolor: activeSection === index ? "#000000" : "#ffffff",
                    }}
                  >
                    {index + 1}
                  </Button>
                ))}
              </Box>

              <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.8rem", mb: 1 }}>
                Scene anchor pose: {poseSnippet(activePose)}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.8rem" }}>
                Camera position: [{f(telemetry.cameraPos[0])}, {f(telemetry.cameraPos[1])}, {f(telemetry.cameraPos[2])}]
              </Typography>
              <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.8rem" }}>
                Camera rotation: [{f(telemetry.cameraRot[0])}, {f(telemetry.cameraRot[1])}, {f(telemetry.cameraRot[2])}]
              </Typography>
              <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.8rem" }}>
                Orbit target: [{f(telemetry.target[0])}, {f(telemetry.target[1])}, {f(telemetry.target[2])}]
              </Typography>
              <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.8rem", mb: 1 }}>
                Mouse world: {telemetry.hit ? `[${f(telemetry.hit[0])}, ${f(telemetry.hit[1])}, ${f(telemetry.hit[2])}]` : "n/a"}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigator.clipboard.writeText(cameraSnippet)}
                  sx={{ borderColor: "#000000", color: "#000000", fontSize: "0.75rem" }}
                >
                  Copy Camera Snippet
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSaveSection(String(activeSection + 1))}
                  sx={{ borderColor: "#000000", color: "#000000", fontSize: "0.75rem" }}
                >
                  Use Active Scene
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  select
                  label="Section"
                  size="small"
                  value={saveSection}
                  onChange={(e) => setSaveSection(e.target.value)}
                  sx={{ minWidth: 130 }}
                >
                  {Array.from({ length: 9 }, (_, index) => (
                    <MenuItem key={index} value={String(index + 1)}>
                      Section {index + 1}
                    </MenuItem>
                  ))}
                </TextField>
                <Button variant="outlined" size="small" onClick={handleSaveCurrentCamera} sx={{ borderColor: "#000000", color: "#000000" }}>
                  Save Camera to JSON
                </Button>
                <Button variant="outlined" size="small" onClick={handleLoadSavedCamera} sx={{ borderColor: "#000000", color: "#000000" }}>
                  Load Saved
                </Button>
              </Stack>

              <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.78rem", mb: 0.6 }}>
                Saved JSON format: width(px) {"->"} section(1-9) {"->"} {"{ position, rotation, mouseWorld }"}
              </Typography>

              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 1,
                  border: "1px solid #d0d0d0",
                  bgcolor: "#fafafa",
                  maxHeight: 200,
                  overflow: "auto",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  fontSize: "0.72rem",
                  lineHeight: 1.35,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {savedJson || "{}"}
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigator.clipboard.writeText(savedJson || "{}")}
                  sx={{ borderColor: "#000000", color: "#000000", fontSize: "0.75rem" }}
                >
                  Copy JSON
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSavedPoses({})}
                  sx={{ borderColor: "#000000", color: "#000000", fontSize: "0.75rem" }}
                >
                  Clear JSON
                </Button>
              </Stack>

              <Typography sx={{ fontFamily: "Figtree, sans-serif", fontSize: "0.78rem", mt: 1 }}>
                Move: arrow keys. Orbit: mouse drag. Width input snaps to nearest boundary.
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, ButtonBase, Dialog, Typography, useMediaQuery } from "@mui/material";

type Certificate = {
  src: string;
  title: string;
};

const CERTIFICATES: Certificate[] = [
  { src: "/docs/certificate4.png", title: "Certificate 4" },
  { src: "/docs/certificate1.png", title: "Certificate 1" },
  { src: "/docs/certificate2.png", title: "Certificate 2" },
  { src: "/docs/certificate3.png", title: "Certificate 3" },
];

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3.4;
const ZOOM_STEP = 0.2;

export default function CertificatesGallery() {
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [viewerSize, setViewerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const isPhone = useMediaQuery("(max-width:768px)");
  const isDesktop = useMediaQuery("(min-width:960px)");

  const canZoomOut = zoomLevel > MIN_ZOOM;
  const canZoomIn = zoomLevel < MAX_ZOOM;

  useEffect(() => {
    if (!activeCertificate) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [activeCertificate]);

  useEffect(() => {
    if (!activeCertificate) return;
    let isMounted = true;
    const image = new Image();
    image.src = activeCertificate.src;
    image.onload = () => {
      if (!isMounted) return;
      setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
    };
    return () => { isMounted = false; };
  }, [activeCertificate]);

  useEffect(() => {
    if (!activeCertificate) return;
    const viewerNode = viewerRef.current;
    if (!viewerNode) return;
    const updateViewerSize = () => {
      setViewerSize({ width: viewerNode.clientWidth, height: viewerNode.clientHeight });
    };
    updateViewerSize();
    window.addEventListener("resize", updateViewerSize);
    let observer: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      observer = new ResizeObserver(updateViewerSize);
      observer.observe(viewerNode);
    }
    return () => {
      window.removeEventListener("resize", updateViewerSize);
      observer?.disconnect();
    };
  }, [activeCertificate]);

  const fitScale = useMemo(() => {
    if (!naturalSize || viewerSize.width === 0 || viewerSize.height === 0) return 1;
    const safeWidth = Math.max(viewerSize.width - 24, 1);
    const safeHeight = Math.max(viewerSize.height - 24, 1);
    return Math.min(safeWidth / naturalSize.width, safeHeight / naturalSize.height, 1);
  }, [naturalSize, viewerSize.height, viewerSize.width]);

  const displayWidth = useMemo(() => {
    if (!naturalSize) return undefined;
    return naturalSize.width * fitScale * zoomLevel;
  }, [fitScale, naturalSize, zoomLevel]);

  const handleOpen = (certificate: Certificate) => {
    setActiveCertificate(certificate);
    setNaturalSize(null);
    setZoomLevel(1);
  };

  const handleClose = () => {
    setActiveCertificate(null);
    setNaturalSize(null);
    setZoomLevel(1);
  };

  const handleZoomOut = () => {
    setZoomLevel((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2))));
  };

  const handleZoomIn = () => {
    setZoomLevel((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2))));
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {isDesktop ? (
        // ── DESKTOP (md+): all 4 certificates in a single row ──
        // The container already has a fixed height from DocsPillar (flex: 1, minHeight: 0)
        // so we just need to fill it and let images scale naturally via maxHeight: 100%
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            px: { md: "2rem", lg: "3rem", xl: "4rem", xxl: "5rem", xxxl: "7rem" },
            py: "1.5rem",
            overflow: "hidden",
          }}
        >
          {CERTIFICATES.map((certificate) => (
            <ButtonBase
              key={certificate.src}
              onClick={() => handleOpen(certificate)}
              sx={{
                border: "none",
                background: "transparent",
                color: "inherit",
                p: 0,
                // Equal share of the row width, never overflows
                flex: "1 1 0",
                minWidth: 0,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.22s linear",
                "&:hover": { transform: "scale(1.04)" },
              }}
            >
              <Box
                component="img"
                src={certificate.src}
                alt={certificate.title}
                loading="lazy"
                decoding="async"
                sx={{
                  display: "block",
                  // max constraints keep it inside its flex cell at any viewport size
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </ButtonBase>
          ))}
        </Box>
      ) : (
        // ── MOBILE / NARROW TABLET: vertical stack, scrollable ──
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
            px: "1rem",
            py: "1rem",
            overflowY: "auto",
          }}
        >
          {CERTIFICATES.map((certificate) => (
            <ButtonBase
              key={certificate.src}
              onClick={() => handleOpen(certificate)}
              sx={{
                border: "none",
                background: "transparent",
                color: "inherit",
                p: 0,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.22s linear",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <Box
                component="img"
                src={certificate.src}
                alt={certificate.title}
                loading="lazy"
                decoding="async"
                sx={{
                  display: "block",
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "22vh",
                  objectFit: "contain",
                }}
              />
            </ButtonBase>
          ))}
        </Box>
      )}

      <Dialog
        open={Boolean(activeCertificate)}
        onClose={handleClose}
        fullScreen={isPhone}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            m: isPhone ? 0 : 2,
            height: isPhone ? "100%" : "90vh",
            maxHeight: isPhone ? "100%" : "90vh",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              p: 1.5,
              borderBottom: "1px solid #d4d4d4",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Stack Sans Headline",
                fontWeight: 700,
                fontSize: { xs: "0.98rem", md: "1.08rem", lg: "1.16rem", xl: "1.35rem", xxl: "1.7rem", xxxl: "2.1rem" },
                color: "#000000",
              }}
            >
              {activeCertificate?.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={handleZoomOut}
                disabled={!canZoomOut}
                sx={{ minWidth: "2.2rem", px: 1, py: 0.6, bgcolor: "#f3f3f3", color: "#000000", "&:hover": { bgcolor: "#e9e9e9" } }}
              >
                -
              </Button>
              <Typography
                sx={{
                  minWidth: "3.5rem",
                  textAlign: "center",
                  fontFamily: "Stack Sans Headline",
                  fontWeight: 600,
                  fontSize: { xs: "0.86rem", xl: "1.08rem", xxl: "1.34rem", xxxl: "1.72rem" },
                  color: "#000000",
                }}
              >
                {Math.round(zoomLevel * 100)}%
              </Typography>
              <Button
                onClick={handleZoomIn}
                disabled={!canZoomIn}
                sx={{ minWidth: "2.2rem", px: 1, py: 0.6, bgcolor: "#f3f3f3", color: "#000000", "&:hover": { bgcolor: "#e9e9e9" } }}
              >
                +
              </Button>
              <Button
                onClick={handleClose}
                sx={{ minWidth: "4rem", px: 1.25, py: 0.6, bgcolor: "#000000", color: "#ffffff", "&:hover": { bgcolor: "#111111" } }}
              >
                Close
              </Button>
            </Box>
          </Box>

          <Box ref={viewerRef} sx={{ flex: 1, overflow: "auto", bgcolor: "#f8f8f8" }}>
            <Box
              sx={{
                minWidth: "100%",
                minHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 1, md: 2 },
              }}
            >
              {activeCertificate ? (
                <Box
                  component="img"
                  src={activeCertificate.src}
                  alt={activeCertificate.title}
                  sx={{
                    display: "block",
                    width: displayWidth ? `${displayWidth}px` : "auto",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    height: "auto",
                    bgcolor: "#ffffff",
                    transition: "width 0.2s linear",
                  }}
                />
              ) : null}
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

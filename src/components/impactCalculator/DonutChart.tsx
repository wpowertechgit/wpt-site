import { Box, Typography } from "@mui/material";

interface DonutChartProps {
  segments: { key: string; pct: number; color: string; label: string }[];
  size?: number;
}

export default function DonutChart({ segments, size = 160 }: DonutChartProps) {
  const radius = size * 0.38;
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = size * 0.17;
  const total = segments.reduce((sum, segment) => sum + segment.pct, 0);

  if (total === 0) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "3px dashed #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: "0.7rem", color: "#ccc" }}>0%</Typography>
      </Box>
    );
  }

  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Box sx={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
        />
        {segments
          .filter((segment) => segment.pct > 0)
          .map((segment) => {
            const dash = (segment.pct / 100) * circumference;
            const gap = circumference - dash;
            const element = (
              <circle
                key={segment.key}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
                style={{ transition: "stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease" }}
              />
            );
            offset += dash;
            return element;
          })}
      </svg>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: size * 0.135, lineHeight: 1, color: "#1a1a1a" }}>
          {Math.round(total)}%
        </Typography>
        <Typography sx={{ fontSize: size * 0.075, color: "#aaa", mt: "0.1rem" }}>of 100%</Typography>
      </Box>
    </Box>
  );
}

import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { clampFloat } from "./model";

interface FloatInputProps {
  value: number;
  onChange: (value: number) => void;
  unit: string;
  min?: number;
  max?: number;
  placeholder?: string;
  step?: number;
  sx?: object;
}

export default function FloatInput({
  value,
  onChange,
  unit,
  min = 0,
  max = 99999,
  placeholder = "0",
  step = 0.5,
  sx = {},
}: FloatInputProps) {
  const [localVal, setLocalVal] = useState(value === 0 ? "" : String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const nextValue = clampFloat(raw, min, max);
    setLocalVal(nextValue === 0 ? "" : String(nextValue));
    onChange(nextValue);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "0.35rem", xxl: "0.45rem", xxxl: "0.55rem" }, ...sx }}>
      <IconButton
        size="small"
        onClick={() => {
          const nextValue = Math.max(min, parseFloat(((value || 0) - step).toFixed(2)));
          setLocalVal(nextValue === 0 ? "" : String(nextValue));
          onChange(nextValue);
        }}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 0, p: { xs: "2px", xxl: "6px", xxxl: "8px" }, minWidth: { xxl: "2.75rem", xxxl: "3.25rem" }, minHeight: { xxl: "2.75rem", xxxl: "3.25rem" }, flexShrink: 0, "& svg": { width: { xxl: "0.95rem", xxxl: "1.15rem" }, height: { xxl: "0.95rem", xxxl: "1.15rem" } } }}
      >
        <FaMinus size={8} />
      </IconButton>
      <TextField
        size="small"
        inputRef={inputRef}
        value={localVal}
        onChange={(event) => {
          const safe = event.target.value
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1")
            .slice(0, 10);
          setLocalVal(safe);
        }}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commit((event.target as HTMLInputElement).value);
          }
        }}
        placeholder={placeholder}
        inputProps={{ inputMode: "decimal", pattern: "[0-9.]*", maxLength: 10 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography sx={{ fontSize: { xs: "0.65rem", xxl: "0.74rem", xxxl: "0.86rem" }, color: "#aaa", whiteSpace: "nowrap" }}>{unit}</Typography>
            </InputAdornment>
          ),
        }}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": { borderRadius: 0, minHeight: { xxl: "3rem", xxxl: "3.5rem" } },
          "& input": { textAlign: "center", fontWeight: 700, fontSize: { xs: "0.85rem", xxl: "1.12rem", xxxl: "1.32rem" }, p: { xs: "4px 0", xxl: "8px 0", xxxl: "10px 0" } },
        }}
      />
      <IconButton
        size="small"
        onClick={() => {
          const nextValue = Math.min(max, parseFloat(((value || 0) + step).toFixed(2)));
          setLocalVal(String(nextValue));
          onChange(nextValue);
        }}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 0, p: { xs: "2px", xxl: "6px", xxxl: "8px" }, minWidth: { xxl: "2.75rem", xxxl: "3.25rem" }, minHeight: { xxl: "2.75rem", xxxl: "3.25rem" }, flexShrink: 0, "& svg": { width: { xxl: "0.95rem", xxxl: "1.15rem" }, height: { xxl: "0.95rem", xxxl: "1.15rem" } } }}
      >
        <FaPlus size={8} />
      </IconButton>
    </Box>
  );
}

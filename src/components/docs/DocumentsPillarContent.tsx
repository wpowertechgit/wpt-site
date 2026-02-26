import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BsFileEarmarkPdfFill } from "react-icons/bs";

const DOCUMENT_KEYS = ["document3", "document4", "document5", "document6", "document7", "document8"] as const;
const DIRECTIVES = [
  "EU Directive: 2000/76 EG 2014/35/EU 2014/30/EU 2006/42/EC",
  "SR EN ISO12100:2011",
  "SR EN 60204 1:2007",
  "SR EN 62061:2005",
  "SR EN 842+A1:2009",
] as const;

export default function DocumentsPillarContent() {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.25, md: 1.5, lg: 1.8, xl: 2.1, xxl: 2.5, xxxl: 3 }, height: "100%", minHeight: 0 }}>
      <Typography
        sx={{
          fontFamily: "Figtree",
          fontWeight: 500,
          fontSize: { xs: "0.98rem", md: "1.05rem", lg: "1.15rem", xl: "1.35rem", xxl: "1.65rem", xxxl: "2.1rem" },
          lineHeight: 1.55,
          color: "#ffffff",
          maxWidth: "70ch",
        }}
      >
        Agreements, approvals, and authorizations are listed in this module as documentation records.
      </Typography>

      <Box sx={{ minHeight: 0, overflow: "auto" }}>
        <Box
          sx={{
            border: "1px solid rgba(255, 255, 255, 0.45)",
            display: "grid",
            gridTemplateColumns: "1fr",
          }}
        >
          {Array.from({ length: Math.max(DOCUMENT_KEYS.length, DIRECTIVES.length) }).map((_, index, rows) => {
            const entryKey = DOCUMENT_KEYS[index];
            const directive = DIRECTIVES[index];
            const isLastRow = index === rows.length - 1;

            return (
              <Box
                key={`doc-row-${index}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
                  borderBottom: isLastRow ? "none" : "1px solid rgba(255, 255, 255, 0.28)",
                }}
              >
                <Box
                  sx={{
                    minWidth: 0,
                    borderRight: "1px solid rgba(255, 255, 255, 0.28)",
                    px: { xs: 0.8, md: 1, lg: 1.1, xl: 1.3, xxl: 1.55, xxxl: 1.9 },
                    py: { xs: 0.7, md: 0.8, lg: 0.92, xl: 1.05, xxl: 1.25, xxxl: 1.5 },
                  }}
                >
                  {entryKey ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1.35rem 1fr", md: "1.5rem 1fr", xl: "1.7rem 1fr", xxl: "2rem 1fr", xxxl: "2.4rem 1fr" },
                        alignItems: "start",
                        gap: { xs: 0.55, md: 0.65, xl: 0.75, xxl: 0.9, xxxl: 1.1 },
                      }}
                    >
                      <Box sx={{ pt: { xs: "0.1rem", xl: "0.16rem", xxl: "0.2rem" }, color: "#ffffff", lineHeight: 0 }}>
                        <BsFileEarmarkPdfFill />
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: "Figtree",
                          fontWeight: 500,
                          fontSize: { xs: "0.84rem", md: "0.9rem", lg: "0.98rem", xl: "1.15rem", xxl: "1.4rem", xxxl: "1.8rem" },
                          lineHeight: 1.45,
                          color: "#ffffff",
                        }}
                      >
                        {t(entryKey)}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                    px: { xs: 0.8, md: 1, lg: 1.1, xl: 1.3, xxl: 1.55, xxxl: 1.9 },
                    py: { xs: 0.7, md: 0.8, lg: 0.92, xl: 1.05, xxl: 1.25, xxxl: 1.5 },
                  }}
                >
                  {directive ? (
                    <Typography
                      sx={{
                        fontFamily: "Figtree",
                        fontWeight: 500,
                        fontSize: { xs: "0.82rem", md: "0.88rem", lg: "0.94rem", xl: "1.1rem", xxl: "1.35rem", xxxl: "1.72rem" },
                        lineHeight: 1.45,
                        color: "#ffffff",
                      }}
                    >
                      • {directive}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

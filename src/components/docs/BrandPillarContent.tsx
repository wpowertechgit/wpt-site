import { Box, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const BRAND_FILES = [
  { labelKey: "docs.brand.fileEn", defaultLabel: "Brochure (English)", href: "/docs/wpt-%20brosura-en.pdf", flag: "/us.png" },
  { labelKey: "docs.brand.fileRo", defaultLabel: "Brochure (Romanian)", href: "/docs/wpt-%20brosura-ro.pdf", flag: "/ro.png" },
] as const;

export default function BrandPillarContent() {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.25, md: 1.6, lg: 1.9, xl: 2.2, xxl: 2.7, xxxl: 3.2 }, height: "100%" }}>
      <Typography
        sx={{
          fontFamily: "Figtree",
          fontWeight: 500,
          fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem", lg: "2rem", xl: "3rem", xxl: "3.6rem", xxxl: "5rem" },
          lineHeight: 1.55,
          color: "#ffffff",
          maxWidth: "62ch",
        }}
      >
        {t("docs.brand.intro", {
          defaultValue: "Brochures and brand assets are published in this module in PDF format.",
        })}
      </Typography>

      <Box sx={{ display: "grid", gap: 1 }}>
        {BRAND_FILES.map((file) => (
          <Link
            key={file.href}
            href={file.href}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.72)",
              px: 1.25,
              py: 1,
              color: "#ffffff",
              fontFamily: "Figtree",
              fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem", lg: "2rem", xl: "3rem", xxl: "3.6rem", xxxl: "5rem" },
              fontWeight: 600,
              lineHeight: 1.4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              transition: "transform 0.2s linear",
              "&:hover": { transform: "translateX(2px)", color: "#ffffff" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {file.flag ? (
                <Box
                  component="img"
                  src={file.flag}
                  alt=""
                  aria-hidden="true"
                  sx={{
                    width: { xs: "3rem", xl: "4rem", xxl: "6rem", xxxl: "7rem" },
                    height: "auto",
                    objectFit: "cover",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    flexShrink: 0,
                  }}
                />
              ) : null}
              <span>{t(file.labelKey, { defaultValue: file.defaultLabel })}</span>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

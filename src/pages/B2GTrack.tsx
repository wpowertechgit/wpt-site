import { useRef, type RefObject } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next"; // assumes react-i18next setup

const THEME = {
    bg: "#FFFFFF",
    text: "#000000",
    muted: "#2f2f2f",
    border: "#d8d8d8",
    accent: "#111111",
};

type SectionKey = "overview" | "caseStudies" | "specs";
type SectionRefs = Record<SectionKey, RefObject<HTMLDivElement | null>>;

const subNavItems: { key: SectionKey; labelKey: string }[] = [
    { key: "overview", labelKey: "b2g.subnav.cityIntegration" },
    { key: "caseStudies", labelKey: "b2g.subnav.caseStudies" },
    { key: "specs", labelKey: "b2g.subnav.certifications" },
];

function PlaceholderImage({
    alt,
    height = 260,
    priority = false,
}: {
    alt: string;
    height?: number;
    priority?: boolean;
}) {
    return (
        <Box
            component="img"
            src="/waste.jpg"
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            sx={{
                width: "100%",
                height: { xs: 180, md: height },
                objectFit: "cover",
                display: "block",
                border: `1px solid ${THEME.border}`,
                mb: 2,
                filter: "grayscale(10%)",
            }}
        />
    );
}

export default function B2GTrack() {
    const { t } = useTranslation();
    const overviewRef = useRef<HTMLDivElement | null>(null);
    const caseStudiesRef = useRef<HTMLDivElement | null>(null);
    const specsRef = useRef<HTMLDivElement | null>(null);
    const sectionRefs: SectionRefs = {
        overview: overviewRef,
        caseStudies: caseStudiesRef,
        specs: specsRef,
    };

    const jumpTo = (key: SectionKey) => {
        sectionRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <Box sx={{ color: THEME.text }}>
            {/* ── Sub-nav ── */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, md: 1.5 }}
                sx={{ mb: { xs: 3, md: 4 }, mt: 1 }}
            >
                {subNavItems.map((item) => (
                    <Button
                        key={item.key}
                        onClick={() => jumpTo(item.key)}
                        disableRipple
                        sx={{
                            alignSelf: "flex-start",
                            borderRadius: 0,
                            border: `1px solid ${THEME.border}`,
                            color: THEME.text,
                            bgcolor: "transparent",
                            fontFamily: "'Figtree', sans-serif",
                            fontWeight: 600,
                            fontSize: { xs: "0.85rem", md: "0.95rem", xl: "1.05rem" },
                            textTransform: "none",
                            px: { xs: 1.6, md: 2 },
                            py: { xs: 0.7, md: 0.9 },
                            letterSpacing: "0.02em",
                            transition: "background 180ms linear, transform 160ms ease",
                            "&:hover": {
                                bgcolor: "#f0f0f0",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        {t(item.labelKey)}
                    </Button>
                ))}
            </Stack>

            {/* ── Overview ── */}
            <Box ref={overviewRef} sx={{ mb: 5 }}>
                <Typography
                    sx={{
                        fontFamily: "'Stack Sans Headline', 'Syne', sans-serif",
                        fontSize: { xs: "2rem", md: "2.7rem", xl: "3.8rem" },
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        mb: 2,
                    }}
                >
                    {t("b2g.overview.title")}
                </Typography>

                <PlaceholderImage alt={t("b2g.overview.imageAlt")} height={320} priority />

                <Typography
                    sx={{
                        maxWidth: "72ch",
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: { xs: "1rem", md: "1.15rem", xl: "1.35rem" },
                        lineHeight: 1.75,
                        color: THEME.muted,
                    }}
                >
                    {t("b2g.overview.body")}
                </Typography>
            </Box>

            <Divider sx={{ borderColor: THEME.border, mb: 4 }} />

            {/* ── Case Studies ── */}
            <Box ref={caseStudiesRef} sx={{ mb: 5 }}>
                <Typography
                    sx={{
                        fontFamily: "'Stack Sans Headline', 'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: "1.5rem", md: "1.9rem", xl: "2.5rem" },
                        letterSpacing: "-0.01em",
                        mb: 2.5,
                    }}
                >
                    {t("b2g.caseStudies.title")}
                </Typography>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{ mb: 3 }}
                >
                    {/* Card 1 */}
                    <Box sx={{ flex: 1 }}>
                        <PlaceholderImage alt={t("b2g.caseStudies.card1.imageAlt")} height={220} />
                        <Typography
                            sx={{
                                fontFamily: "'Stack Sans Headline', sans-serif",
                                fontWeight: 700,
                                fontSize: { xs: "1rem", xl: "1.25rem" },
                                mb: 0.8,
                            }}
                        >
                            {t("b2g.caseStudies.card1.title")}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "'Figtree', sans-serif",
                                fontSize: { xs: "0.9rem", xl: "1.1rem" },
                                lineHeight: 1.65,
                                color: THEME.muted,
                            }}
                        >
                            {t("b2g.caseStudies.card1.body")}
                        </Typography>
                    </Box>

                    {/* Card 2 */}
                    <Box sx={{ flex: 1 }}>
                        <PlaceholderImage alt={t("b2g.caseStudies.card2.imageAlt")} height={220} />
                        <Typography
                            sx={{
                                fontFamily: "'Stack Sans Headline', sans-serif",
                                fontWeight: 700,
                                fontSize: { xs: "1rem", xl: "1.25rem" },
                                mb: 0.8,
                            }}
                        >
                            {t("b2g.caseStudies.card2.title")}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "'Figtree', sans-serif",
                                fontSize: { xs: "0.9rem", xl: "1.1rem" },
                                lineHeight: 1.65,
                                color: THEME.muted,
                            }}
                        >
                            {t("b2g.caseStudies.card2.body")}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Divider sx={{ borderColor: THEME.border, mb: 4 }} />

            {/* ── Specs / Certifications ── */}
            <Box ref={specsRef} sx={{ mb: 5 }}>
                <Typography
                    sx={{
                        fontFamily: "'Stack Sans Headline', 'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: "1.5rem", md: "1.9rem", xl: "2.5rem" },
                        letterSpacing: "-0.01em",
                        mb: 2.5,
                    }}
                >
                    {t("b2g.specs.title")}
                </Typography>

                <PlaceholderImage alt={t("b2g.specs.imageAlt")} height={200} />

                <Stack spacing={1.4}>
                    {(["spec1", "spec2", "spec3"] as const).map((key) => (
                        <Box
                            key={key}
                            sx={{
                                borderLeft: `3px solid ${THEME.accent}`,
                                pl: 2,
                                py: 0.4,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "'Figtree', sans-serif",
                                    fontSize: { xs: "0.95rem", xl: "1.15rem" },
                                    lineHeight: 1.65,
                                    color: THEME.muted,
                                }}
                            >
                                {t(`b2g.specs.${key}`)}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

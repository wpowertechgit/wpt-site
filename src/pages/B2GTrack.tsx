import { useRef, type RefObject } from "react";
import { motion } from "framer-motion";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const THEME = {
    text: "#000000",
    muted: "#2f2f2f",
    border: "#d8d8d8",
    accent: "#111111",
};

type SectionKey = "diversion" | "compliance" | "resilience" | "impact" | "refraction";
type SectionRefs = Record<SectionKey, RefObject<HTMLDivElement | null>>;

const subNavItems: { key: SectionKey; labelKey: string }[] = [
    { key: "diversion", labelKey: "b2g.subnav.diversion" },
    { key: "compliance", labelKey: "b2g.subnav.compliance" },
    { key: "resilience", labelKey: "b2g.subnav.resilience" },
    { key: "impact", labelKey: "b2g.subnav.impact" },
    { key: "refraction", labelKey: "b2g.subnav.refraction" },
];

const imageBySection: Record<Exclude<SectionKey, "refraction">, string> = {
    diversion: "/landfill.jpg",
    compliance: "/factory20.jpg",
    resilience: "/generator.jpg",
    impact: "/studio22.jpg",
};

const fadeInView = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.28 },
    transition: { duration: 0.45, ease: "linear" as const },
};

function SectionImage({
    src,
    alt,
    priority = false,
}: {
    src: string;
    alt: string;
    priority?: boolean;
}) {
    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            sx={{
                width: "100%",
                height: { xs: 220, md: 320 },
                objectFit: "cover",
                display: "block",
                border: `1px solid ${THEME.border}`,
                filter: "grayscale(12%)",
            }}
        />
    );
}

export default function B2GTrack() {
    const { t } = useTranslation();
    const diversionRef = useRef<HTMLDivElement | null>(null);
    const complianceRef = useRef<HTMLDivElement | null>(null);
    const resilienceRef = useRef<HTMLDivElement | null>(null);
    const impactRef = useRef<HTMLDivElement | null>(null);
    const refractionRef = useRef<HTMLDivElement | null>(null);

    const sectionRefs: SectionRefs = {
        diversion: diversionRef,
        compliance: complianceRef,
        resilience: resilienceRef,
        impact: impactRef,
        refraction: refractionRef,
    };

    const jumpTo = (key: SectionKey) => {
        sectionRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const contentSections = ["diversion", "compliance", "resilience", "impact"] as const;

    return (
        <Box sx={{ color: THEME.text }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, md: 1.5 }}
                sx={{ mb: 0, mt: 0, flexWrap: "wrap" }}
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
                            transition: "background 180ms linear",
                            "&:hover": {
                                bgcolor: "#f0f0f0",
                            },
                        }}
                    >
                        {t(item.labelKey)}
                    </Button>
                ))}
            </Stack>

            <Box sx={{ mb: 4 }}>
                <Typography
                    sx={{
                        fontFamily: "'Stack Sans Headline', 'Syne', sans-serif",
                        fontSize: { xs: "2rem", md: "2.7rem", xl: "3.8rem" },
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        mb: 1.5,
                    }}
                >
                    {t("b2g.hero.title")}
                </Typography>
                <Typography
                    sx={{
                        maxWidth: "72ch",
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: { xs: "1rem", md: "1.05rem", xl: "1.2rem" },
                        lineHeight: 1.7,
                        color: THEME.muted,
                        mb: 2.3,
                    }}
                >
                    {t("b2g.hero.body")}
                </Typography>
                <SectionImage src="/facility6.jpg" alt={t("b2g.hero.imageAlt")} priority />
            </Box>

            {contentSections.map((section, index) => (
                <Box
                    key={section}
                    ref={sectionRefs[section]}
                    component={motion.section}
                    {...fadeInView}
                    sx={{ mb: 5 }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.05fr) minmax(0, 0.95fr)" },
                            gap: { xs: 2.2, md: 3.5, xl: 4.5 },
                            alignItems: "start",
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: "'Stack Sans Headline', 'Syne', sans-serif",
                                    fontWeight: 700,
                                    fontSize: { xs: "1.5rem", md: "1.9rem", xl: "2.5rem" },
                                    letterSpacing: "-0.01em",
                                    mb: 1.6,
                                }}
                            >
                                {t(`b2g.sections.${section}.title`)}
                            </Typography>
                            <Typography
                                sx={{
                                    maxWidth: "70ch",
                                    fontFamily: "'Figtree', sans-serif",
                                    fontSize: { xs: "0.95rem", md: "1.05rem", xl: "1.2rem" },
                                    lineHeight: 1.7,
                                    color: THEME.muted,
                                }}
                            >
                                {t(`b2g.sections.${section}.body`)}
                            </Typography>
                        </Box>

                        <SectionImage src={imageBySection[section]} alt={t(`b2g.sections.${section}.imageAlt`)} />
                    </Box>

                    {index < contentSections.length - 1 && <Divider sx={{ borderColor: THEME.border, mt: 4 }} />}
                </Box>
            ))}

            <Divider sx={{ borderColor: THEME.border, mb: 4 }} />

            <Box ref={refractionRef} component={motion.section} {...fadeInView} sx={{ mb: 5 }}>
                <Typography
                    sx={{
                        fontFamily: "'Stack Sans Headline', 'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: "1.5rem", md: "1.9rem", xl: "2.5rem" },
                        letterSpacing: "-0.01em",
                        mb: 2,
                    }}
                >
                    {t("b2g.refraction.title")}
                </Typography>
                <Typography
                    sx={{
                        maxWidth: "74ch",
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: { xs: "0.95rem", md: "1.05rem", xl: "1.2rem" },
                        lineHeight: 1.7,
                        color: THEME.muted,
                        mb: 2,
                    }}
                >
                    {t("b2g.refraction.intro")}
                </Typography>

                <Stack spacing={1.3}>
                    {(["principle1", "principle2", "principle3"] as const).map((key) => (
                        <Box
                            key={key}
                            sx={{
                                borderLeft: `3px solid ${THEME.accent}`,
                                pl: 1.6,
                                py: 0.4,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "'Figtree', sans-serif",
                                    fontSize: { xs: "0.95rem", md: "1rem", xl: "1.1rem" },
                                    lineHeight: 1.65,
                                    color: THEME.muted,
                                }}
                            >
                                {t(`b2g.refraction.${key}`)}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

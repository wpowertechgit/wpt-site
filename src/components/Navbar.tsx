import { AppBar, Box, Button, Menu, MenuItem, Container, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoLanguage } from "react-icons/io5";
import { MdLanguage } from "react-icons/md";
import { useUIStore } from "../store/uiStore";

const NAV_ITEMS = [
    { labelKey: "nav.applications", to: "/applications" },
    { labelKey: "nav.docs", to: "/docs" },
    { labelKey: "nav.press", to: "/press" },
    { labelKey: "nav.history", to: "/about/history" },
    { labelKey: "nav.contact", to: "/contact" },
];

const LOCALES = [
    ["en", "/us.png", "English"],
    ["ro", "/ro.png", "Română"],
];

export default function Navbar() {
    const { t } = useTranslation();
    const currentLanguage = useUIStore((state) => state.language);
    const setLanguage = useUIStore((state) => state.setLanguage);
    const [localeAnchor, setLocaleAnchor] = useState<null | HTMLElement>(null);
    const technologySiteLabel = t("tech-title");
    const brochureHref =
        currentLanguage === "ro"
            ? "/docs/wpt- brosura-ro.pdf"
            : "/docs/wpt- brosura-en.pdf";

    const handleLocaleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setLocaleAnchor(event.currentTarget);
    };

    const handleLocaleClose = () => {
        setLocaleAnchor(null);
    };

    const handleLanguageChange = (lng: string) => {
        setLanguage(lng);
        handleLocaleClose();
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                bgcolor: "#ffffff",
                color: "#000",
                boxShadow: "none",
                borderBottom: "1px solid #ddd",
                zIndex: 50
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    px: { md: "2rem !important", xl: "3rem !important", xxl: "4rem !important" },
                    width: "100%",
                    maxWidth: "120rem",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: { xs: "clamp(4.5rem, 4vw, 6rem)", xxl: "7.25rem", xxxl: "10vh" }
                    }}
                >
                    {/* LOGO */}
                    <MuiLink
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            "&:hover": {
                                opacity: 0.8
                            }
                        }}
                    >
                        <Box
                            component="img"
                            src="/wpt-black-full-length-logo.svg"
                            alt="Waste Powertech Logo"
                            loading="eager"
                            decoding="async"
                            fetchPriority="high"
                            sx={{
                                height: { xs: "clamp(4.75rem, 3.4vw, 4rem)", xxl: "7.2rem", xxxl: "8vh" },
                                width: "auto"
                            }}
                        />
                    </MuiLink>

                    {/* NAV ITEMS */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", ml: "auto" }}>
                        <Box
                            sx={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                alignSelf: "stretch",
                                "&:hover .tech-chevron": {
                                    transform: "rotate(225deg) translateY(1px)",
                                },
                                "&:hover .tech-submenu": {
                                    opacity: 1,
                                    pointerEvents: "auto",
                                },
                            }}
                        >
                            <Button
                                sx={{
                                    color: "#000",
                                    textTransform: "none",
                                    fontSize: { xs: "clamp(1rem, 0.95vw, 1.4rem)", xxl: "1.55rem", xxxl: "2.7rem" },
                                    fontFamily: "Figtree",
                                    fontWeight: 600,
                                    px: "clamp(1rem, 1.2vw, 2rem)",
                                    py: "clamp(0.6rem, 0.8vw, 1rem)",
                                    position: "relative",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                        bgcolor: "#000",
                                        color: "#fff",
                                    }
                                }}
                            >
                                {t("nav.technology")}
                                <Box
                                    component="span"
                                    className="tech-chevron"
                                    sx={{
                                        ml: "0.45rem",
                                        width: "0.45rem",
                                        height: "0.45rem",
                                        display: "inline-block",
                                        borderRight: "2px solid currentColor",
                                        borderBottom: "2px solid currentColor",
                                        transform: "rotate(45deg) translateY(-1px)",
                                        transformOrigin: "center",
                                        transition: "transform 0.2s ease",
                                        flexShrink: 0,
                                    }}
                                />
                            </Button>
                            <Box
                                className="tech-submenu"
                                sx={{
                                    position: "absolute",
                                    top: "calc(100% - 1px)",
                                    left: 0,
                                    minWidth: {
                                        md: "14rem",
                                        xl: "16rem",
                                        xxl: "19rem",
                                        xxxl: "30rem",
                                    },
                                    bgcolor: "#fff",
                                    border: "1px solid #ddd",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                                    opacity: 0,
                                    pointerEvents: "none",
                                    transition: "opacity 0.2s ease",
                                    zIndex: 2,
                                }}
                            >
                                <Button
                                    component={RouterLink}
                                    to="/technology"
                                    sx={{
                                        width: "100%",
                                        justifyContent: "flex-start",
                                        color: "#000",
                                        textTransform: "none",
                                        fontFamily: "Figtree",
                                        fontWeight: 600,
                                        fontSize: {
                                            xs: "clamp(1rem, 0.95vw, 1.4rem)",
                                            xxl: "1.55rem",
                                            xxxl: "2.7rem",
                                        },
                                        px: {
                                            xs: "0.8rem",
                                            xxl: "1rem",
                                            xxxl: "1.4rem",
                                        },
                                        py: {
                                            xs: "0.55rem",
                                            xxl: "0.75rem",
                                            xxxl: "1rem",
                                        },
                                        borderRadius: 0,
                                        minHeight: 0,
                                        whiteSpace: "nowrap",
                                        "&:hover": {
                                            bgcolor: "#000",
                                            color: "#fff",
                                        },
                                    }}
                                >
                                    {technologySiteLabel}
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/calculator"
                                    sx={{
                                        width: "100%",
                                        justifyContent: "flex-start",
                                        color: "#000",
                                        textTransform: "none",
                                        fontFamily: "Figtree",
                                        fontWeight: 600,
                                        fontSize: {
                                            xs: "clamp(1rem, 0.95vw, 1.4rem)",
                                            xxl: "1.55rem",
                                            xxxl: "2.7rem",
                                        },
                                        px: {
                                            xs: "0.8rem",
                                            xxl: "1rem",
                                            xxxl: "1.4rem",
                                        },
                                        py: {
                                            xs: "0.55rem",
                                            xxl: "0.75rem",
                                            xxxl: "1rem",
                                        },
                                        borderRadius: 0,
                                        minHeight: 0,
                                        whiteSpace: "nowrap",
                                        "&:hover": {
                                            bgcolor: "#000",
                                            color: "#fff",
                                        },
                                    }}
                                >
                                    {t("nav.calculator")}
                                </Button>
                            </Box>
                        </Box>

                        {NAV_ITEMS.map((item) => (
                            <Button
                                key={item.to}
                                component={RouterLink}
                                to={item.to}
                                sx={{
                                    color: "#000",
                                    textTransform: "none",
                                    fontSize: { xs: "clamp(1rem, 0.95vw, 1.4rem)", xxl: "1.55rem", xxxl: "2.7rem" },
                                    fontFamily: "Figtree",
                                    fontWeight: 600,
                                    px: "clamp(1rem, 1.2vw, 2rem)",
                                    py: "clamp(0.6rem, 0.8vw, 1rem)",
                                    position: "relative",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                        bgcolor: "#000",
                                        color: "#fff",
                                        transform: "translateY(-2px)"
                                    }
                                }}
                            >
                                {t(item.labelKey)}
                            </Button>
                        ))}

                        <Button
                            component="a"
                            href={brochureHref}
                            target="_blank"
                            rel="noreferrer"
                            sx={{
                                color: "#000",
                                textTransform: "none",
                                fontSize: { xs: "clamp(1rem, 0.95vw, 1.4rem)", xxl: "1.55rem", xxxl: "2.7rem" },
                                fontFamily: "Figtree",
                                fontWeight: 600,
                                px: "clamp(1rem, 1.2vw, 2rem)",
                                py: "clamp(0.6rem, 0.8vw, 1rem)",
                                position: "relative",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "& svg": {
                                    fontSize: {
                                        xs: "clamp(2rem, 1.45vw, 2.8rem)",
                                        xxl: "3.2rem",
                                        xxxl: "4.4rem",
                                    },
                                },
                                "&:hover": {
                                    bgcolor: "#000",
                                    color: "#fff",
                                    transform: "translateY(-2px)"
                                }
                            }}
                        >
                            {t("commercial-presentation")}
                        </Button>

                        {/* LOCALE DROPDOWN */}
                        <Button
                            onClick={handleLocaleClick}
                            sx={{
                                color: "#000",
                                textTransform: "none",
                                fontSize: { xs: "clamp(1rem, 0.95vw, 1.4rem)", xxl: "1.55rem", xxxl: "2.7rem" },
                                fontFamily: "Figtree",
                                fontWeight: 600,
                                px: "clamp(1rem, 1.2vw, 2rem)",
                                py: "clamp(0.6rem, 0.8vw, 1rem)",
                                position: "relative",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    bgcolor: "#000",
                                    color: "#fff",
                                    transform: "translateY(-2px)"
                                }
                            }}
                        >
                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                                <Box
                                    component={IoLanguage}
                                    sx={{
                                        fontSize: {
                                            xs: "1.5rem",
                                            md: "1.7rem",
                                            lg: "1.9rem",
                                            xl: "2.2rem",
                                            xxl: "2.8rem",
                                            xxxl: "3.6rem",
                                        },
                                    }}
                                />
                                <Box
                                    component={MdLanguage}
                                    sx={{
                                        fontSize: {
                                            xs: "1.5rem",
                                            md: "1.7rem",
                                            lg: "1.9rem",
                                            xl: "2.2rem",
                                            xxl: "2.8rem",
                                            xxxl: "3.6rem",
                                        },
                                    }}
                                />
                            </Box>
                        </Button>
                        <Menu
                            anchorEl={localeAnchor}
                            open={Boolean(localeAnchor)}
                            onClose={handleLocaleClose}
                            disableScrollLock
                            sx={{
                                "& .MuiPaper-root": {
                                    bgcolor: "#ffffff",
                                    border: "1px solid #ddd",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    minWidth: {
                                        xs: "12.5rem",
                                        lg: "14rem",
                                        xxl: "18rem",
                                        xxxl: "28rem",
                                    },
                                    py: {
                                        xs: "0.3rem",
                                        xxl: "0.5rem",
                                        xxxl: "0.8rem",
                                    }
                                }
                            }}
                        >
                            {LOCALES.map(([code, flag, label]) => (
                                <MenuItem
                                    key={code}
                                    onClick={() => handleLanguageChange(code)}
                                    selected={currentLanguage === code}
                                    sx={{
                                        fontFamily: "Figtree",
                                        fontSize: {
                                            xs: "clamp(1rem, 0.95vw, 1.2rem)",
                                            xxl: "1.55rem",
                                            xxxl: "2.7rem",
                                        },
                                        minHeight: {
                                            xs: "2.6rem",
                                            xxl: "3.6rem",
                                            xxxl: "5.25rem",
                                        },
                                        color: "#000",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: {
                                            xs: "0.75rem",
                                            xxl: "1rem",
                                            xxxl: "1.35rem",
                                        },
                                        px: {
                                            xs: "0.9rem",
                                            xxl: "1.2rem",
                                            xxxl: "1.6rem",
                                        },
                                        "&:hover": {
                                            bgcolor: "#f5f5f5"
                                        },
                                        "&.Mui-selected": {
                                            bgcolor: "#f0f0f0",
                                            "&:hover": {
                                                bgcolor: "#e8e8e8"
                                            }
                                        }
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={flag}
                                        alt={label}
                                        loading="lazy"
                                        decoding="async"
                                        fetchPriority="low"
                                        sx={{
                                            width: {
                                                xs: "2rem",
                                                lg: "2.25rem",
                                                xxl: "3rem",
                                                xxxl: "4.5rem",
                                            },
                                            height: {
                                                xs: "1.35rem",
                                                lg: "1.5rem",
                                                xxl: "2rem",
                                                xxxl: "3rem",
                                            },
                                            objectFit: "contain"
                                        }}
                                    />
                                    {label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Box>
            </Container>
        </AppBar>
    );
}

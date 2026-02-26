import { AppBar, Box, Button, Menu, MenuItem, Container, Link as MuiLink, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IoLanguage } from "react-icons/io5";
import { MdLanguage } from "react-icons/md";

const NAV_ITEMS = [
    { label: "Technology", to: "/technology" },
    { label: "Applications", to: "/applications" },
    { label: "Docs", to: "/docs" },
    { label: "Press", to: "/press" },
    { label: "History", to: "/about/history" },
    { label: "Contact", to: "/contact" },
];

const LOCALES = [
    ["en", "/us.png", "English"],
    ["ro", "/ro.png", "Română"],
    ["hu", "/hu.png", "Magyar"],
    ["de", "/de.png", "Deutsch"],
    ["fr", "/fr.png", "Français"],
    ["it", "/it.png", "Italiano"],
    ["gr", "/gr.png", "Ελληνικά"],
    ["tr", "/tr.png", "Türkçe"],
    ["zh", "/zh.png", "中文"],
    ["es", "/es.png", "Español"],
    ["pl", "/pl.png", "Polski"]
];

export default function Navbar() {
    const { i18n } = useTranslation();
    const [localeAnchor, setLocaleAnchor] = useState<null | HTMLElement>(null);

    const handleLocaleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setLocaleAnchor(event.currentTarget);
    };

    const handleLocaleClose = () => {
        setLocaleAnchor(null);
    };

    const handleLanguageChange = (lng: string) => {
        i18n.changeLanguage(lng);
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
                        {NAV_ITEMS.map((item) => (
                            <Button
                                key={item.to}
                                component={item.to === "/technology" ? "a" : RouterLink}
                                href={item.to === "/technology" ? item.to : undefined}
                                to={item.to === "/technology" ? undefined : item.to}
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
                                {item.label}
                            </Button>
                        ))}

                        {/* LOCALE DROPDOWN */}
                        <IconButton
                            onClick={handleLocaleClick}
                            sx={{
                                "--IconButton-hoverBg": "transparent",
                                color: "#000",
                                ml: "clamp(0.5rem, 0.8vw, 1.2rem)",
                                p: { xs: "0.5rem", xxl: "0.7rem", xxxl: "0.95rem" },
                                "& svg": {
                                    fontSize: { xs: "clamp(1.7rem, 1.2vw, 2.5rem)", xxl: "3rem", xxxl: "4rem" }
                                },
                                "&:hover": {
                                    bgcolor: "transparent",
                                    color: "#ED1C24"
                                }
                            }}
                        >
                            <IoLanguage />
                            <MdLanguage />
                        </IconButton>
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
                                    minWidth: { xs: "12.5rem", lg: "14rem", xxl: "14rem", xxxl: "22rem" },
                                    py: { xs: "0.3rem", xxl: "0.3rem", xxxl: "0.7rem" }
                                }
                            }}
                        >
                            {LOCALES.map(([code, flag, label]) => (
                                <MenuItem
                                    key={code}
                                    onClick={() => handleLanguageChange(code)}
                                    selected={i18n.language === code}
                                    sx={{
                                        fontFamily: "Figtree",
                                        fontSize: { xs: "clamp(1rem, 0.95vw, 1.2rem)", xxxl: "2rem" },
                                        minHeight: { xs: "2.6rem", xxl: "2.6rem", xxxl: "4.2rem" },
                                        color: "#000",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: { xs: "0.75rem", xxl: "0.75rem", xxxl: "1.2rem" },
                                        px: { xs: "0.9rem", xxl: "0.9rem", xxxl: "1.4rem" },
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
                                            width: { xs: "2rem", lg: "2.25rem", xxl: "2.25rem", xxxl: "4.5rem" },
                                            height: { xs: "1.35rem", lg: "1.5rem", xxl: "1.5rem", xxxl: "3rem" },
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


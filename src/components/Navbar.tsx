import { AppBar, Box, Button, Menu, MenuItem, Container, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const NAV_ITEMS = [
    { label: "Technology", to: "/technology" },
    { label: "Applications", to: "/applications" },
    { label: "Docs", to: "/docs" },
    { label: "Press", to: "/press" },
    { label: "Contact", to: "/contact" },
];

const LOCALES = ["en", "de", "fr"];

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
            <Container maxWidth="lg" sx={{ px: "2rem !important" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "4rem"
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
                            src="/logo.svg"
                            alt="Waste Powertech Logo"
                            sx={{
                                height: "2.5rem",
                                width: "auto"
                            }}
                        />
                    </MuiLink>

                    {/* NAV ITEMS */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", ml: "auto" }}>
                        {NAV_ITEMS.map((item) => (
                            <Button
                                key={item.to}
                                component={RouterLink}
                                to={item.to}
                                sx={{
                                    color: "#000",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontFamily: "Figtree",
                                    fontWeight: 500,
                                    px: "1.5rem",
                                    py: "0.75rem",
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
                        <Button
                            onClick={handleLocaleClick}
                            sx={{
                                color: "#000",
                                textTransform: "none",
                                fontSize: "1rem",
                                fontFamily: "Figtree",
                                fontWeight: 500,
                                px: "1.5rem",
                                py: "0.75rem",
                                ml: "1rem",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    bgcolor: "#000",
                                    color: "#fff",
                                    transform: "translateY(-2px)"
                                }
                            }}
                        >
                            {i18n.language.toUpperCase()}
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
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                                }
                            }}
                        >
                            {LOCALES.map((lng) => (
                                <MenuItem
                                    key={lng}
                                    onClick={() => handleLanguageChange(lng)}
                                    selected={i18n.language === lng}
                                    sx={{
                                        fontFamily: "Figtree",
                                        color: "#000",
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
                                    {lng.toUpperCase()}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Box>
            </Container>
        </AppBar>
    );
}

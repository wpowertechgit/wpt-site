import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: "Figtree, sans-serif",
        h1: {
            fontFamily: "Stack Sans Headline, sans-serif",
            fontWeight: 700
        },
        h2: {
            fontFamily: "Stack Sans Headline, sans-serif",
            fontWeight: 700
        },
        h3: {
            fontFamily: "Stack Sans Headline, sans-serif",
            fontWeight: 700
        },
        h4: {
            fontFamily: "Stack Sans Headline, sans-serif",
            fontWeight: 700
        },
        h5: {
            fontFamily: "Stack Sans Headline, sans-serif",
            fontWeight: 700
        },
        h6: {
            fontFamily: "Stack Sans Headline, sans-serif",
            fontWeight: 700
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    textTransform: "none",
                    fontSize: "1rem"
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    boxShadow: "none",
                    border: "1px solid #e0e0e0"
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 0
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 0
                    }
                }
            }
        }
    },
    shape: {
        borderRadius: 0
    }
});

export default theme;

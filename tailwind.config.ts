import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    waste: "#8E8E8E",   // Waste Grey: Neutral background/accents
                    power: "#ED1C24",   // Power Red: Transformation points only
                    tech: "#0000FF",    // Technology Blue: Diagrams/structure
                    black: "#000000",
                    white: "#FFFFFF",   // Default background 
                },
            },
            fontFamily: {
                headline: ["Stack Sans Headline", "sans-serif"],
                body: ["Figtree", "sans-serif"],
            },
            borderRadius: {
                none: "0px",
            },
            maxWidth: {
                '8xl': '100rem',
            },
        },
    },
    plugins: [
        // Custom plugin to force global alignment and reset rounding
        function ({ addBase }: { addBase: (styles: Record<string, Record<string, string>>) => void }) {
            addBase({
                'h1, h2, h3, h4': {
                    fontFamily: 'Stack Sans Headline',
                    textAlign: 'left',
                    fontWeight: '700'
                },
                'p, span, li': {
                    fontFamily: 'Figtree',
                    textAlign: 'left'
                },
                '*': {
                    borderRadius: '0px !important'
                },
            })
        },
    ],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Core brand colors [cite: 33]
                brand: {
                    waste: "#8E8E8E",   // Waste Grey: Neutral background/accents
                    power: "#ED1C24",   // Power Red: Transformation points only
                    tech: "#0000FF",    // Technology Blue: Diagrams/structure
                    black: "#000000",
                    white: "#FFFFFF",   // Default background [cite: 35]
                },
            },
            fontFamily: {
                // Mandatory typography stack [cite: 25-26]
                headline: ["Stack Sans Headline", "sans-serif"],
                body: ["Figtree", "sans-serif"],
            },
            borderRadius: {
                // Brand rule: No rounded shapes anywhere [cite: 47, 151]
                none: "0px",
            },
            maxWidth: {
                // Optimized for 4K while maintaining line length [cite: 285, 365]
                '8xl': '100rem',
            },
        },
    },
    plugins: [
        // Custom plugin to force global alignment and reset rounding
        function ({ addBase }: { addBase: (styles: Record<string, any>) => void }) {
            addBase({
                'h1, h2, h3, h4': {
                    fontFamily: 'Stack Sans Headline',
                    textAlign: 'left', // Strict left-alignment [cite: 28]
                    fontWeight: '700'
                },
                'p, span, li': {
                    fontFamily: 'Figtree',
                    textAlign: 'left' // No centered text [cite: 29]
                },
                '*': {
                    borderRadius: '0px !important' // Nuclear option for no rounded corners [cite: 301]
                },
            })
        },
    ],
};

export default config;
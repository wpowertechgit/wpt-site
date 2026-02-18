# `agents.md`

# WPT — Core System Knowledge for AI

Minimal, factual, machine‑usable rules extracted from the brand and website documentation.

***

## 1. Brand Structure (Non‑Negotiable Sequence)

The entire system must follow this mandatory logic:

    WASTE → POWER → TECHNOLOGY

Used for:

*   Navigation order
*   Section order
*   Content structuring
*   Diagrams and flows
*   Page layouts
*   Narrative sequence

***

## 2. Language Rules (Required for All Text Output)

**Allowed style**

*   Clear
*   Factual
*   Neutral
*   Technical
*   Short sentences
*   Consistent use of the term **“molecular disintegration”**

**Forbidden**

*   Marketing language
*   Emotional/dramatic tone
*   Sustainability slogans
*   “Burning”, “fire”, “incineration”
*   Hype words (“revolutionary”, “game‑changing”, etc.)

**Overall tone:**  
Technical documentation, not marketing.

***

## 3. Typography Rules

*   **Headings:** Stack Sans Headline
*   **Body text:** Figtree
*   **Alignment:** *Left‑aligned only*
*   No centered or right‑aligned text

***

## 4. Color System (Canonical Tokens)

Color: Waste Grey , Hex: #8E8E8E , Usage : Neutral background, accents 
Color: Power Red  , Hex: #ED1C24 , Usage : Highlights of results / transformation points
Color: Technology Blue, Hex: #0000FF , Usage: Technical elements, diagrams  
Color: White , Hex: #FFFFFF , Usage: Default background, dominant color on the page

Rules:

*   Red & Blue are **accents**, not backgrounds
*   Avoid color-heavy UI
*   Always clean, neutral, controlled

***

## 5. Logo Rules

*   Keep original spacing and proportions
*   Required clear space = **50% of symbol height**
*   Placement: **top‑left** or **bottom‑right**
*   Centered only on special pages (not main site)
*   Logo = only element allowed to have rounded forms
File explanation: wpt-#color#-compact-logo.svg : the symbol + the text "Waste Power Tech" each in their respective line
wpt-#color#-full-length.svg : the symbol + the text "Waste Power Tech" in one line, official logo
logo-white or logo.svg : only the symbol

***

## 6. Layout & Component Rules

General:

*   Use **horizontal lines** and dividers as main structural elements
*   No rounded shapes (except logo)
*   White space dominant
*   Technical, modular, neutral layout
*   QR codes represent “documentation modules”

Photography rules:

*   **Waste:** neutral materials, documentary style
*   **Technology:** clean product/tech shots, neutral lighting
*   **Power:** humans allowed, neutral everyday context, no emotion

***

## 7. Brand Persona

The “feel”:

*   Serious
*   Controlled
*   Institutional
*   Engineering‑driven
*   Zero emotional storytelling

Think:  
**NASA documentation + clean industrial technology.**

***

## 8. Website Page Requirements

### Homepage

*   Must start with **Waste → Power → Technology** block
*   Left‑aligned title
*   Neutral factual explanation
*   Simple photography modules
*   Calm UI, no heavy animations

### Technology Page

*   Title: **“Molecular Disintegration: A Controlled Technical Process”**
*   Linear diagram
*   Technical explanation (no metaphors)

### Applications Page

Three categories:

1.  **Institutional (B2G)**
2.  **Industrial (B2B/B2I)**
3.  **Infrastructure (B2I)**

Each section must include:

*   2–3 advantage bullets
*   Technical paragraph
*   Use cases

### About Page

*   Scientific, institutional tone
*   No hero imagery
*   White background

### Footer

*   Logo (bottom‑right)
*   QR to documentation
*   No social media icons unless necessary

***

## 9. Output Calculator (Functional Specification)

### Inputs

*   Number of modules (slider)
*   Optional waste/capacity inputs
*   Presets for project sizes

### Outputs

*   Total MWh/year
*   Households powered
*   % of 300,000‑population city powered
*   CO₂ equivalent avoided
*   Operational metrics
*   Graphs (horizontal bar / line)

### Implementation notes

*   Use a separate calculation module (`/utils/calculator.ts`)
*   Must feel institutional, verifiable, factual

***

## 10. Motion Rules

*   Controlled
*   Precise
*   Subtle
*   Horizontal motion preferred
*   No spring/bounce animations
*   Use linear tweens only

***

## 11. Frontend System (Recommended)

*   **Framework:** Next.js 15 or Vite + React
*   **Styling:** TailwindCSS with brand tokens
*   **Components:** Radix UI / Headless UI
*   **Charts:** VisX (preferred) or Recharts
*   **Motion:** Framer Motion with linear transitions
*   **i18n:** next‑intl or react‑i18next
*   **Image:** Next.js Image or vite-imagetools

***

## 12. Tokens for Tailwind (Required)

    --wpt-waste-gray: #8E8E8E;
    --wpt-power-red:  #ED1C24;
    --wpt-tech-blue:  #0000FF;
    --wpt-black:      #000000;
    --wpt-white:      #FFFFFF;

Rules:

*   Disable rounded corners globally
*   Strict spacing system
*   Strict left alignment

***

## 13. Required Breakpoints

    xs: 360
    sm: 640
    md: 768
    lg: 1024
    xl: 1280
    2xl: 1536
    4k: 2560+

Constraints:

*   Max line length: 60–80 characters
*   Expand margins on 4K, not text width

***

## 14. Applications — Core Knowledge Blocks (for AI)

### Institutional (B2G)

*   Controlled, non-combustion waste processing
*   Auditable, compliant method
*   Reduced landfill dependency
*   Suitable for city‑level waste/energy systems

### Industrial (B2B)

*   Handles complex/expensive waste
*   Stable throughput
*   Predictable energy recovery
*   On-site / near-site deployment

### Infrastructure (B2I)

*   Supports large regional hubs
*   Integrates with distributed energy networks
*   Long‑term, controlled operation
*   District/regional waste → power facilities

***

## 15. Contact / Documentation Requirements

Needed for launch:

*   Address, phone, email, legal info
*   PDFs: brochure, technical sheet, press kit
*   Case study: Cluj (KPIs, photos, timeline)

***

# End of `agents.md`

***

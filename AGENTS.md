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

## 10. Motion Rules

*   Controlled
*   Precise
*   Subtle
*   Horizontal motion preferred
*   Spring animations allowed
*   Fade-ins and outs preferred when inView
*   Use linear tweens only

***

## 11. Frontend System

*   **Framework:** Vite + React typescript
*   **Styling:** Inline Material-UI
*   **Components** Material-UI preffered
*   **Charts:** VisX (preferred) or Recharts
*   **Motion:** Framer Motion with linear transitions
*   **i18n:** react‑i18next
*   **Image:** :Lazy loading and vite-imagetools
*   **Global:** Zustand storing
*   **3D-Renders:** React-drei
***
## 13. Required Breakpoints

            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
            xxl: 2560,
            xxxl: 3840

Constraints:

*   Max line length: 60–80 characters
*   Expand margins on 4K, not text width

***

# End of `agents.md`

***

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AppLayout from "./layouts/AppLayout";
import AppLanguageSync from "./components/AppLanguageSync";

const Home = lazy(() => import("./pages/Home"));
const History = lazy(() => import("./pages/about/History"));
const Technology = lazy(() => import("./pages/Technology"));
const Applications = lazy(() => import("./pages/Applications"));
const Press = lazy(() => import("./pages/Press"));
const TechnologyDebug = lazy(() => import("./pages/TechnologyDebug"));
const TechnologyBodyDebug = lazy(() => import("./pages/TechnologyBodyDebug"));
const PrivacyPolicy = lazy(() => import("./pages/compliance/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/compliance/TermsOfUse"));
const Accessibility = lazy(() => import("./pages/compliance/Accessibility"));
const Docs = lazy(() => import("./pages/Docs"));
const Contact = lazy(() => import("./pages/Contact"));
const ClujCaseStudy = lazy(() => import("./pages/ClujCaseStudy"));
const Calculator = lazy(() => import("./pages/Calculator"));
// import Documentation from "./pages/Documentation";
// import CaseStudyCluj from "./pages/CaseStudyCluj";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppLanguageSync />
        <Suspense fallback={<Box sx={{ minHeight: "100vh", bgcolor: "#ffffff" }} />}>
          <Routes>
            <Route path="technology-debug" element={<TechnologyDebug />} />
            <Route path="technology-body-debug" element={<TechnologyBodyDebug />} />
            <Route element={<AppLayout />}>
              {/* Root */}
              <Route index element={<Home />} />

              {/* Main sections */}
              <Route path="about/history" element={<History />} />
              <Route path="technology" element={<Technology />} />
              <Route path="applications" element={<Applications />} />
              <Route path="docs" element={<Docs />} />
              <Route path="press" element={<Press />} />
              <Route path="contact" element={<Contact />} />
              <Route path="case-study-cluj" element={<ClujCaseStudy />} />
              <Route path="calculator" element={<Calculator />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-use" element={<TermsOfUse />} />
              <Route path="accessibility" element={<Accessibility />} />
              {/* <Route path="documentation" element={<Documentation />} /> */}
              {/* <Route path="case-study-cluj" element={<CaseStudyCluj />} /> */}
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;



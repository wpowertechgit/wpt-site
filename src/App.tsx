import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AppLayout from "./layouts/AppLayout";

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
// import Calculator from "./pages/Calculator";
// import Documentation from "./pages/Documentation";
// import CaseStudyCluj from "./pages/CaseStudyCluj";
// import Contact from "./pages/Contact";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
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
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-use" element={<TermsOfUse />} />
              <Route path="accessibility" element={<Accessibility />} />
              {/* <Route path="calculator" element={<Calculator />} /> */}
              {/* <Route path="documentation" element={<Documentation />} /> */}
              {/* <Route path="case-study-cluj" element={<CaseStudyCluj />} /> */}
              {/* <Route path="contact" element={<Contact />} /> */}
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;



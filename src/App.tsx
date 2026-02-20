import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AppLayout from "./layouts/AppLayout";

const Home = lazy(() => import("./pages/Home"));
const Technology = lazy(() => import("./pages/Technology"));
const Applications = lazy(() => import("./pages/Applications"));
// import Calculator from "./pages/Calculator";
// import Documentation from "./pages/Documentation";
// import Press from "./pages/Press";
// import CaseStudyCluj from "./pages/CaseStudyCluj";
// import Contact from "./pages/Contact";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={<Box sx={{ minHeight: "100vh", bgcolor: "#ffffff" }} />}>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Root */}
              <Route index element={<Home />} />

              {/* Main sections */}
              <Route path="technology" element={<Technology />} />
              <Route path="applications" element={<Applications />} />
              {/* <Route path="calculator" element={<Calculator />} /> */}
              {/* <Route path="documentation" element={<Documentation />} /> */}
              {/* <Route path="press" element={<Press />} /> */}
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



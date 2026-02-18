import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import AppLayout from "./layouts/AppLayout";

import Home from "./pages/Home";
// import Technology from "./pages/Technology";
// import Applications from "./pages/Applications";
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
        <Routes>
          <Route element={<AppLayout />}>
            {/* Root */}
            <Route index element={<Home />} />

            {/* Main sections */}
            {/* <Route path="technology" element={<Technology />} /> */}
            {/* <Route path="applications" element={<Applications />} /> */}
            {/* <Route path="calculator" element={<Calculator />} /> */}
            {/* <Route path="documentation" element={<Documentation />} /> */}
            {/* <Route path="press" element={<Press />} /> */}
            {/* <Route path="case-study-cluj" element={<CaseStudyCluj />} /> */}
            {/* <Route path="contact" element={<Contact />} /> */}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

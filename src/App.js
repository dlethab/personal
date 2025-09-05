// App.js (only showing the top-level structure)
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import AppLayout from "./AppLayout";
import Home from "./Home";
import CompanyCasePage from "./work/CompanyCasePage";
import ProjectsCasePage from "./projects/ProjectsCasePage";
import InfoPage from "./info/InfoPage.jsx";
import ResumePage from "./info/ResumePage.jsx";

import ScrollToTop from "./ScrollToTop";   // ← add this
import ArtCasePage from "./artdesign/ArtCasePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop behavior="smooth" />      {/* or "smooth" if you prefer */}
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/workexperience/:company" element={<CompanyCasePage />} />
          <Route path="/projects/:project" element={<ProjectsCasePage />} />
          <Route path="/artdesign/:piece" element={<ArtCasePage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
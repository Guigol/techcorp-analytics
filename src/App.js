import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Tools from "./pages/Tools";
import { SearchProvider } from "./context/SearchContext";

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>          {/* ✅ Provider autour de Navbar et Routes */}
        <Navbar />               {/* Navbar peut utiliser useSearch */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App; // ✅ juste l'export par défaut

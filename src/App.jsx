import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Routes pour Tools, Analytics, Settings */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Game from "../pages/Game";
import HowItWorks from "../pages/HowItWorks";
import Stats from "../pages/Stats";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Game from "../pages/Game";
import HowItWorks from "../pages/HowItWorks";
import Stats from "../pages/Stats";
import Archive from "../pages/Archive";
import OfflineBanner from "../components/OfflineBanner";
import InstallAppPrompt from "../components/InstallAppPrompt";

const ROUTE_TITLES: Record<string, string> = {
  "/": "GuessMe — Dossiê Digital",
  "/game": "Investigação — GuessMe",
  "/how-it-works": "Manual do Agente — GuessMe",
  "/stats": "Estatísticas — GuessMe",
  "/archive": "Arquivo de Casos — GuessMe",
};

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = ROUTE_TITLES[pathname] ?? ROUTE_TITLES["/"];
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteMetadata />
      <a className="skipLink" href="#main-content">Ir para o conteúdo</a>
      <OfflineBanner />
      <InstallAppPrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

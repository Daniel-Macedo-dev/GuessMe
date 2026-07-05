import { useEffect, useState } from "react";
import DossierIcon from "./DossierIcon";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline  = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online",  goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online",  goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="offlineBanner" role="status" aria-live="polite" data-testid="offline-banner">
      <DossierIcon name="offline" size={16} aria-hidden={true} className="offlineBannerSvgIcon" />
      <span className="caseStamp caseStamp--classified caseStamp--sm" aria-hidden="true">Offline</span>
      <span className="offlineBannerText">
        <strong>Conexão perdida</strong> — histórico local disponível · perguntas à IA exigem conexão
      </span>
    </div>
  );
}

import { useEffect, useState } from "react";

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
      <span className="offlineBannerIcon" aria-hidden="true">○</span>
      <span className="offlineBannerText">
        <strong>Offline</strong> — histórico local disponível · perguntas à IA exigem conexão
      </span>
    </div>
  );
}

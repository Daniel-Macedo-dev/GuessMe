import { useEffect, useState } from "react";
import DossierIcon from "./DossierIcon";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallAppPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!prompt || dismissed) return null;

  const handleInstall = async () => {
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setDismissed(true);
      setPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setPrompt(null);
  };

  return (
    <div
      className="installPrompt"
      role="dialog"
      aria-labelledby="install-prompt-title"
      data-testid="install-prompt"
    >
      <div className="installPromptLabel" aria-hidden="true">DOSSIÊ DIGITAL · INSTALAR</div>
      <div className="installPromptBody">
        <div className="installPromptIconWrap" aria-hidden="true">
          <DossierIcon name="install" size={20} aria-hidden={true} />
        </div>
        <div className="installPromptText">
          <span id="install-prompt-title">Instalar GuessMe</span>
          <span>Acesso rápido como aplicativo nativo</span>
        </div>
      </div>
      <div className="installPromptActions">
        <button
          className="installPromptDismiss"
          onClick={handleDismiss}
          aria-label="Dispensar prompt de instalação"
          data-testid="install-prompt-dismiss"
        >
          Agora não
        </button>
        <button
          className="btn btn-primary installPromptInstall"
          onClick={handleInstall}
          data-testid="install-prompt-install"
        >
          Instalar
        </button>
      </div>
    </div>
  );
}

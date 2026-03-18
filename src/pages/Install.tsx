import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Smartphone, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    setIsIos(/iphone|ipad|ipod/i.test(ua));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <img src="/pwa-icon-512.png" alt="VibeForge Studio" className="w-24 h-24 mx-auto rounded-2xl shadow-lg" />
        <h1 className="text-3xl font-bold text-foreground">Install VibeForge Studio</h1>
        <p className="text-muted-foreground">
          Get the full app experience — instant launch from your home screen, fullscreen mode, and offline access.
        </p>

        {installed ? (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg font-semibold">Installed! Open from your home screen.</span>
          </div>
        ) : deferredPrompt ? (
          <Button size="lg" onClick={handleInstall} className="gap-2 w-full text-lg py-6">
            <Download className="w-5 h-5" />
            Install App
          </Button>
        ) : isIos ? (
          <div className="space-y-4 text-left bg-muted/30 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Smartphone className="w-5 h-5" /> iOS Install Steps
            </h2>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                Tap the <strong className="text-foreground">Share</strong> button in Safari (bottom bar)
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                Scroll down and tap <strong className="text-foreground">Add to Home Screen</strong>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                Tap <strong className="text-foreground">Add</strong> to confirm
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4 text-left bg-muted/30 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Monitor className="w-5 h-5" /> Install from Browser
            </h2>
            <p className="text-muted-foreground">
              Look for the install icon <Download className="w-4 h-4 inline" /> in your browser's address bar, or open the browser menu and select <strong className="text-foreground">Install App</strong>.
            </p>
          </div>
        )}

        <a href="/" className="block text-sm text-primary hover:underline">
          Continue in browser →
        </a>
      </div>
    </div>
  );
};

export default Install;

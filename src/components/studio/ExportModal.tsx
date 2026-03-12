import { useState } from "react";
import { X, Download, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

const exportFormats = [
  { id: "tiktok", label: "TikTok / Reels", ratio: "9:16", resolution: "1080×1920" },
  { id: "instagram", label: "Instagram Post", ratio: "1:1", resolution: "1080×1080" },
  { id: "youtube", label: "YouTube", ratio: "16:9", resolution: "1920×1080" },
  { id: "story", label: "Story / Shorts", ratio: "9:16", resolution: "1080×1920" },
  { id: "twitter", label: "X / Twitter", ratio: "16:9", resolution: "1280×720" },
];

const qualityOptions = ["720p", "1080p", "4K"];

const ExportModal = ({ open, onClose }: ExportModalProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(["tiktok"]));
  const [quality, setQuality] = useState("1080p");

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="studio-panel w-full max-w-lg p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">Export Video</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Select dimensions for batch export. No watermarks.
            </p>

            {/* Format checkboxes */}
            <div className="space-y-2">
              {exportFormats.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => toggle(fmt.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-md border transition-colors ${
                    selected.has(fmt.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selected.has(fmt.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selected.has(fmt.id) && <Check size={12} className="text-primary-foreground" />}
                    </div>
                    <span className="text-sm text-foreground">{fmt.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{fmt.ratio}</span>
                    <span className="text-xs text-muted-foreground">{fmt.resolution}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quality selector */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quality</label>
              <div className="flex gap-2 mt-2">
                {qualityOptions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={q === quality ? "aspect-chip-active" : "aspect-chip-inactive"}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Export button */}
            <button
              disabled={selected.size === 0}
              className="studio-btn-secondary w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-40"
            >
              <Download size={16} />
              Export {selected.size} Format{selected.size !== 1 ? "s" : ""}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportModal;

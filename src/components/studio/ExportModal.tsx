import { useState } from "react";
import { X, Download, Check, Sparkles, Loader2, Clock, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

const exportFormats = [
  { id: "tiktok", label: "TikTok", ratio: "9:16", resolution: "1080×1920", maxDuration: "3:00", aspect: 9 / 16, color: "#00f2ea" },
  { id: "reels", label: "Instagram Reels", ratio: "9:16", resolution: "1080×1920", maxDuration: "1:30", aspect: 9 / 16, color: "#e1306c" },
  { id: "ig-post", label: "Instagram Post", ratio: "1:1", resolution: "1080×1080", maxDuration: "1:00", aspect: 1, color: "#c13584" },
  { id: "ig-story", label: "Instagram Story", ratio: "9:16", resolution: "1080×1920", maxDuration: "0:15", aspect: 9 / 16, color: "#fd1d1d" },
  { id: "youtube", label: "YouTube", ratio: "16:9", resolution: "1920×1080", maxDuration: "∞", aspect: 16 / 9, color: "#ff0000" },
  { id: "yt-shorts", label: "YouTube Shorts", ratio: "9:16", resolution: "1080×1920", maxDuration: "1:00", aspect: 9 / 16, color: "#ff4444" },
  { id: "facebook", label: "Facebook Video", ratio: "16:9", resolution: "1920×1080", maxDuration: "∞", aspect: 16 / 9, color: "#1877f2" },
  { id: "fb-reels", label: "Facebook Reels", ratio: "9:16", resolution: "1080×1920", maxDuration: "1:30", aspect: 9 / 16, color: "#1877f2" },
  { id: "twitter", label: "X / Twitter", ratio: "16:9", resolution: "1280×720", maxDuration: "2:20", aspect: 16 / 9, color: "#1da1f2" },
  { id: "snapchat", label: "Snapchat", ratio: "9:16", resolution: "1080×1920", maxDuration: "1:00", aspect: 9 / 16, color: "#fffc00" },
];

const qualityOptions = ["720p", "1080p", "4K"];

const ExportModal = ({ open, onClose }: ExportModalProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(["tiktok"]));
  const [quality, setQuality] = useState("1080p");
  const [aiCrop, setAiCrop] = useState(true);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === exportFormats.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(exportFormats.map((f) => f.id)));
    }
  };

  const selectedFormats = exportFormats.filter((f) => selected.has(f.id));

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
            className="studio-panel w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">Export Video</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Select platforms for batch export. Audio will be auto-trimmed per platform. No watermarks.
            </p>

            {/* Select all */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{selected.size} of {exportFormats.length} selected</span>
              <button onClick={selectAll} className="text-xs text-primary hover:underline">
                {selected.size === exportFormats.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            {/* Format grid with checkboxes */}
            <div className="grid grid-cols-2 gap-2">
              {exportFormats.map((fmt) => {
                const isSelected = selected.has(fmt.id);
                return (
                  <button
                    key={fmt.id}
                    onClick={() => toggle(fmt.id)}
                    className={`flex items-start gap-3 p-3 rounded-md border transition-all text-left ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                      }`}
                    >
                      {isSelected && <Check size={10} className="text-primary-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: fmt.color }}
                        />
                        <span className="text-xs font-medium text-foreground truncate">{fmt.label}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">{fmt.ratio}</span>
                        <span className="text-[10px] text-muted-foreground">{fmt.resolution}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock size={8} />
                          {fmt.maxDuration}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Thumbnail previews of selected formats */}
            {selectedFormats.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Preview ({selectedFormats.length})
                </label>
                <div className="flex gap-3 mt-2 overflow-x-auto pb-2">
                  {selectedFormats.map((fmt) => (
                    <div key={fmt.id} className="flex-shrink-0 flex flex-col items-center gap-1.5">
                      <div
                        className="rounded border border-border bg-card relative overflow-hidden flex items-center justify-center"
                        style={{
                          width: fmt.aspect >= 1 ? 100 : 60,
                          height: fmt.aspect >= 1 ? 100 / fmt.aspect : 100,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-background to-neon-green/10" />
                        <div className="relative z-10 text-center">
                          <p className="text-[6px] text-foreground font-display font-semibold leading-tight px-1">
                            ♪ Your lyrics ♪
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] text-muted-foreground text-center leading-tight">{fmt.label}</span>
                      <span className="text-[8px] text-muted-foreground/60">{fmt.ratio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Audio Cropping */}
            <div className="studio-panel p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors size={14} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">AI Audio Cropping</span>
                </div>
                <button
                  onClick={() => setAiCrop(!aiCrop)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    aiCrop ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground transition-transform ${
                      aiCrop ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                AI analyzes your track to select the best segment for each platform's max duration —
                finding the hook, drop, or chorus automatically. Audio is trimmed with smooth fade-in/out.
              </p>
              {aiCrop && selectedFormats.some((f) => f.maxDuration !== "∞") && (
                <div className="mt-2 space-y-1">
                  {selectedFormats
                    .filter((f) => f.maxDuration !== "∞")
                    .map((fmt) => (
                      <div key={fmt.id} className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">{fmt.label}</span>
                        <span className="text-foreground font-mono flex items-center gap-1">
                          <Sparkles size={8} className="text-primary" />
                          Best {fmt.maxDuration} segment
                        </span>
                      </div>
                    ))}
                </div>
              )}
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
              {aiCrop && selected.size > 0 && (
                <span className="text-[10px] opacity-60 ml-1">with AI crop</span>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportModal;

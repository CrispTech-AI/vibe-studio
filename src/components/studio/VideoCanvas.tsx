import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Maximize2, Volume2 } from "lucide-react";

type AspectRatio = "9:16" | "1:1" | "16:9" | "4:5";

const aspectStyles: Record<AspectRatio, { css: string; label: string; platforms: string }> = {
  "9:16": { css: "aspect-[9/16] max-h-[420px]", label: "9:16", platforms: "TikTok · Reels · Shorts" },
  "1:1": { css: "aspect-square max-h-[420px]", label: "1:1", platforms: "Instagram Post" },
  "4:5": { css: "aspect-[4/5] max-h-[420px]", label: "4:5", platforms: "Facebook · Pinterest" },
  "16:9": { css: "aspect-video max-h-[360px]", label: "16:9", platforms: "YouTube · Twitter" },
};

interface VideoCanvasProps {
  currentTime: number;
  totalTime: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

const VideoCanvas = ({ currentTime, totalTime, isPlaying, onPlayPause, onSeek }: VideoCanvasProps) => {
  const [aspect, setAspect] = useState<AspectRatio>("9:16");

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background p-6 gap-4 min-w-0">
      {/* Aspect ratio selector */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {(Object.keys(aspectStyles) as AspectRatio[]).map((r) => (
          <button
            key={r}
            onClick={() => setAspect(r)}
            className={r === aspect ? "aspect-chip-active" : "aspect-chip-inactive"}
          >
            {aspectStyles[r].label}
            <span className="ml-1 opacity-60 hidden sm:inline">{aspectStyles[r].platforms}</span>
          </button>
        ))}
      </div>

      {/* Video preview */}
      <div
        className={`${aspectStyles[aspect].css} w-full max-w-md bg-card rounded-lg border border-border flex items-center justify-center relative overflow-hidden transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-background to-neon-green/10" />
        <div className="relative z-10 text-center space-y-2">
          <div className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center mx-auto">
            <Play size={24} className="text-primary ml-1" />
          </div>
          <p className="text-xs text-muted-foreground">Preview will appear here</p>
        </div>
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-foreground font-display text-lg font-semibold drop-shadow-lg px-4">
            ♪ Your lyrics appear here ♪
          </p>
        </div>
        {/* Ratio badge */}
        <div className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm border border-border rounded px-1.5 py-0.5">
          <span className="text-[9px] text-muted-foreground font-mono">{aspectStyles[aspect].label}</span>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-4">
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => onSeek(Math.max(0, currentTime - 10))}
        >
          <SkipBack size={18} />
        </button>
        <button
          onClick={onPlayPause}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => onSeek(Math.min(totalTime, currentTime + 10))}
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Time display */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
        <span>{formatTime(currentTime)}</span>
        <div
          className="w-48 h-1 bg-muted rounded-full overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            onSeek(percent * totalTime);
          }}
        >
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(currentTime / totalTime) * 100}%` }}
          />
        </div>
        <span>{formatTime(totalTime)}</span>
        <Volume2 size={14} className="ml-2" />
        <Maximize2 size={14} />
      </div>
    </div>
  );
};

export default VideoCanvas;

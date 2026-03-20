import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Maximize2, Volume2, LayoutGrid, Monitor } from "lucide-react";

type AspectRatio = "9:16" | "1:1" | "16:9" | "4:5";

const aspectStyles: Record<AspectRatio, { css: string; label: string; platforms: string }> = {
  "9:16": { css: "aspect-[9/16]", label: "9:16", platforms: "TikTok · Reels · Shorts" },
  "1:1": { css: "aspect-square", label: "1:1", platforms: "Instagram Post" },
  "4:5": { css: "aspect-[4/5]", label: "4:5", platforms: "Facebook · Pinterest" },
  "16:9": { css: "aspect-video", label: "16:9", platforms: "YouTube · Twitter" },
};

interface VideoCanvasProps {
  currentTime: number;
  totalTime: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  project: any;
}

const PreviewCard = ({
  ratio,
  project,
  compact = false,
}: {
  ratio: AspectRatio;
  project: any;
  compact?: boolean;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    <div
      className={`${aspectStyles[ratio].css} ${compact ? "max-h-[200px] w-auto" : "max-h-[420px] w-full max-w-md"} bg-card rounded-lg border border-border flex items-center justify-center relative overflow-hidden transition-all duration-300`}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/10 bg-black/30">
        {project?.cover_image ? (
          <img
            src={project.cover_image}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-purple-500/10 to-cyan-500/20" />
        )}
        <div className={`relative z-10 flex h-full flex-col items-center justify-center text-center ${compact ? "p-2" : "p-6"}`}>
          <div className={`text-muted-foreground mb-1 ${compact ? "text-[8px]" : "text-xs"}`}>
            {project?.format || "Preview"}
          </div>
          <h2 className={`font-semibold text-foreground mb-1 ${compact ? "text-xs" : "text-2xl"}`}>
            {project?.title || "Untitled Project"}
          </h2>
          <p className={`text-muted-foreground ${compact ? "text-[8px] line-clamp-2" : "max-w-xl"}`}>
            {project?.lyrics || "Your lyrics appear here"}
          </p>
        </div>
      </div>
    </div>
    {compact && (
      <span className="text-[10px] text-muted-foreground font-medium">
        {aspectStyles[ratio].label} <span className="opacity-60">{aspectStyles[ratio].platforms}</span>
      </span>
    )}
  </div>
);

const VideoCanvas = ({ currentTime, totalTime, isPlaying, onPlayPause, onSeek, project }: VideoCanvasProps) => {
  const [aspect, setAspect] = useState<AspectRatio>("9:16");
  const [multiPreview, setMultiPreview] = useState(false);
  const [selectedRatios, setSelectedRatios] = useState<Set<AspectRatio>>(
    new Set(Object.keys(aspectStyles) as AspectRatio[])
  );

  const toggleRatio = (r: AspectRatio) => {
    setSelectedRatios((prev) => {
      const next = new Set(prev);
      if (next.has(r)) {
        if (next.size > 1) next.delete(r);
      } else {
        next.add(r);
      }
      return next;
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const activeRatios = (Object.keys(aspectStyles) as AspectRatio[]).filter((r) =>
    selectedRatios.has(r)
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background p-6 gap-4 min-w-0">
      {/* Mode toggle + ratio selector */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => setMultiPreview(false)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
            !multiPreview ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Monitor size={12} /> Single
        </button>
        <button
          onClick={() => setMultiPreview(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
            multiPreview ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutGrid size={12} /> Multi
        </button>
        <div className="w-px h-4 bg-border" />
        {(Object.keys(aspectStyles) as AspectRatio[]).map((r) => (
          <button
            key={r}
            onClick={() => (multiPreview ? toggleRatio(r) : setAspect(r))}
            className={
              multiPreview
                ? selectedRatios.has(r)
                  ? "aspect-chip-active"
                  : "aspect-chip-inactive"
                : r === aspect
                  ? "aspect-chip-active"
                  : "aspect-chip-inactive"
            }
          >
            {aspectStyles[r].label}
            <span className="ml-1 opacity-60 hidden sm:inline">{aspectStyles[r].platforms}</span>
          </button>
        ))}
      </div>

      {/* Preview area */}
      {multiPreview ? (
        <div className="flex-1 w-full flex items-center justify-center overflow-auto">
          <div className="flex gap-4 items-end flex-wrap justify-center py-2">
            {activeRatios.map((r) => (
              <PreviewCard key={r} ratio={r} project={project} compact />
            ))}
          </div>
        </div>
      ) : (
        <PreviewCard ratio={aspect} project={project} />
      )}

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

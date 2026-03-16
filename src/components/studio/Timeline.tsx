import { useMemo, useRef, useCallback } from "react";
import { Music, Image, Type, Eye, Unlock } from "lucide-react";

interface TimelineProps {
  currentTime: number;
  totalTime: number;
  onSeek: (time: number) => void;
}

const Timeline = ({ currentTime, totalTime, onSeek }: TimelineProps) => {
  const trackContentRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const waveformBars = useMemo(
    () => Array.from({ length: 120 }, () => 15 + Math.random() * 85),
    []
  );

  const tracks = [
    { id: "audio", label: "Audio", icon: <Music size={14} />, color: "bg-primary" },
    { id: "bg", label: "Background", icon: <Image size={14} />, color: "bg-neon-green" },
    { id: "lyrics", label: "Lyrics / Lip Sync", icon: <Type size={14} />, color: "bg-amber-500" },
  ];

  const timeMarkers = ["0:00", "0:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:15"];

  const playheadPercent = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;

  const seekFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const ruler = trackContentRef.current;
      if (!ruler) return;
      const rect = ruler.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = x / rect.width;
      onSeek(percent * totalTime);
    },
    [totalTime, onSeek]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      seekFromEvent(e);

      const handleMouseMove = (ev: MouseEvent) => {
        if (isDragging.current) seekFromEvent(ev);
      };
      const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [seekFromEvent]
  );

  return (
    <div className="h-52 border-t border-border bg-card flex flex-col select-none">
      {/* Time ruler – clickable */}
      <div
        className="flex items-center h-6 border-b border-border px-20 cursor-pointer"
        onMouseDown={handleMouseDown}
        ref={trackContentRef}
      >
        <div className="flex-1 flex justify-between px-2 pointer-events-none">
          {timeMarkers.map((t) => (
            <span key={t} className="text-[10px] text-muted-foreground font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto">
        {tracks.map((track) => (
          <div key={track.id} className="track-row group">
            <div className="w-16 flex items-center gap-1.5 shrink-0">
              <span className={`w-2 h-2 rounded-full ${track.color}`} />
              <span className="text-[11px] text-muted-foreground">{track.label}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-0.5 text-muted-foreground hover:text-foreground">
                <Eye size={12} />
              </button>
              <button className="p-0.5 text-muted-foreground hover:text-foreground">
                <Unlock size={12} />
              </button>
            </div>

            <div
              className="flex-1 h-10 bg-muted/50 rounded-sm relative overflow-hidden ml-1 cursor-pointer"
              onMouseDown={handleMouseDown}
            >
              {track.id === "audio" && (
                <div className="flex items-end h-full gap-px px-1 pointer-events-none">
                  {waveformBars.map((h, i) => (
                    <div
                      key={i}
                      className="waveform-bar flex-1 min-w-[2px]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              )}

              {track.id === "bg" && (
                <div className="h-full flex items-center pointer-events-none">
                  <div className="h-6 bg-neon-green/20 border border-neon-green/30 rounded-sm mx-1 flex-1 flex items-center px-2">
                    <span className="text-[10px] text-neon-green truncate">Gradient Mesh Animation</span>
                  </div>
                </div>
              )}

              {track.id === "lyrics" && (
                <div className="h-full flex items-center gap-1 px-1 pointer-events-none">
                  {["Verse 1", "Chorus", "Verse 2", "Chorus", "Bridge", "Outro"].map((section, i) => (
                    <div
                      key={i}
                      className="h-6 bg-amber-500/15 border border-amber-500/30 rounded-sm flex items-center px-1.5 shrink-0"
                      style={{ width: `${14 + Math.random() * 6}%` }}
                    >
                      <span className="text-[9px] text-amber-400 truncate">{section}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Playhead */}
              <div
                className="timeline-cursor"
                style={{ left: `${playheadPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground font-mono">BPM: 128</span>
          <span className="text-[10px] text-muted-foreground font-mono">Key: Am</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Snap to Beat</button>
          <span className="text-border">|</span>
          <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Auto-Sync Lyrics</button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

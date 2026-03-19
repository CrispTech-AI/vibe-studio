import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  fileName: string;
  onRemove?: () => void;
}

const AudioPlayer = ({ src, fileName, onRemove }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="studio-panel p-3 space-y-2">
      <audio ref={audioRef} src={src} muted={muted} />
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground truncate max-w-[160px]">{fileName}</span>
        {onRemove && (
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive">
            <X size={12} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={togglePlay} className="text-primary hover:text-primary/80 transition-colors">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div
          className="flex-1 h-1.5 bg-muted rounded-full cursor-pointer overflow-hidden"
          onClick={seek}
        >
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono w-16 text-right">
          {fmt(currentTime)} / {fmt(duration)}
        </span>
        <button onClick={() => setMuted(!muted)} className="text-muted-foreground hover:text-foreground">
          {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
